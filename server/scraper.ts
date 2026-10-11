import { PDFParse } from 'pdf-parse';
import crypto from 'crypto';
import { db } from './db';
import { DocumentChunk, IngestionRun, SourceResource } from '../src/types/civic';

const OPENCITY_DATASET_ID = 'report-on-the-status-of-civic-issues-in-mumbai-may-2025';
const OPENCITY_CATALOG_URL = `https://data.opencity.in/dataset/${OPENCITY_DATASET_ID}`;
const OPENCITY_CKAN_API = `https://data.opencity.in/api/3/action/package_show?id=${OPENCITY_DATASET_ID}`;
const DEFAULT_PDF_URL = 'https://data.opencity.in/dataset/0cd78ce4-1088-480e-91cf-762734f6d6b7/resource/eae0e205-c8d3-4827-b8c4-87fb4dcd122e/download/9fd725e6-910d-41ae-957f-242dad034cf9.pdf';

let isScrapingInProgress = false;

export function getScrapingState() {
  return { isScrapingInProgress };
}

function getSectionHeadingForPage(pageNum: number): string {
  if (pageNum <= 9) return 'Introduction & Overview';
  if (pageNum <= 23) return 'Section I: Water Supply & Transmission';
  if (pageNum <= 29) return 'Section I: Part 2. Sewerage & Drainage Infrastructure';
  if (pageNum <= 48) return 'Section II: Solid Waste Management (SWM) & Sanitation';
  if (pageNum <= 59) return 'Section III: Public Toilets in Mumbai City';
  return 'Section IV: Air Quality Index (AQI) & Environmental Governance';
}

export async function runOpenCityIngestion(): Promise<{
  run: IngestionRun;
  resource: SourceResource;
}> {
  if (isScrapingInProgress) {
    throw new Error('An ingestion run is already in progress. Please wait.');
  }

  isScrapingInProgress = true;
  const startedAt = new Date();
  const logEntries: string[] = [];

  try {
    logEntries.push(`[Scraper] Initializing OpenCity India scraper at ${startedAt.toISOString()}`);
    logEntries.push(`[Scraper] Querying CKAN API endpoint: ${OPENCITY_CKAN_API}`);

    // Step 1: Query OpenCity CKAN API
    let datasetTitle = 'Report on the Status of Civic Issues in Mumbai - May 2025';
    let pdfUrl = DEFAULT_PDF_URL;
    let fileSize = 4785939;

    try {
      const apiRes = await fetch(OPENCITY_CKAN_API, {
        headers: { 'User-Agent': 'KartavyaCivicBot/1.0 (+https://data.opencity.in)' },
      });
      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (apiData?.result) {
          datasetTitle = apiData.result.title || datasetTitle;
          const pdfResource = apiData.result.resources?.find(
            (r: any) => r.format?.toLowerCase() === 'pdf' || r.url?.endsWith('.pdf')
          );
          if (pdfResource?.url) {
            pdfUrl = pdfResource.url;
            fileSize = pdfResource.size || fileSize;
            logEntries.push(`[Scraper] CKAN API confirmed resource: "${pdfResource.name || datasetTitle}" (${fileSize} bytes)`);
          }
        }
      } else {
        logEntries.push(`[Scraper] CKAN API returned status ${apiRes.status}; falling back to direct catalogue resource`);
      }
    } catch (apiErr: any) {
      logEntries.push(`[Scraper] CKAN API warning: ${apiErr?.message}. Proceeding with verified catalogue resource.`);
    }

    // Step 2: Download the official PDF document
    logEntries.push(`[Scraper] Downloading document resource from: ${pdfUrl}`);
    const pdfResponse = await fetch(pdfUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) KartavyaCivicBot/1.0',
        Accept: 'application/pdf,*/*',
      },
    });

    if (!pdfResponse.ok) {
      throw new Error(`Failed to download resource PDF: HTTP status ${pdfResponse.status} ${pdfResponse.statusText}`);
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const uint8Data = new Uint8Array(arrayBuffer);
    const contentHash = crypto.createHash('sha256').update(uint8Data).digest('hex').slice(0, 16);
    logEntries.push(`[Scraper] Downloaded ${uint8Data.length} bytes. SHA256 checksum: ${contentHash}`);

    // Step 3: Parse PDF text and page segments
    logEntries.push(`[Scraper] Parsing document layout and extracting text via PDFParse...`);
    const parser = new PDFParse(uint8Data);
    await (parser as any).load();
    const textOutput = await parser.getText();
    const fullText = typeof textOutput === 'string' ? textOutput : (textOutput as any)?.text || '';

    logEntries.push(`[Scraper] Extracted ${fullText.length} characters of raw text`);

    // Step 4: Split into page-level chunks with page markers `-- X of 93 --`
    const chunks: DocumentChunk[] = [];
    const pageSplits = fullText.split(/-- (\d+) of (\d+) --/g);

    if (pageSplits.length > 1) {
      // Split produces [preamble, pageNum, totalPages, pageContent, pageNum, totalPages, pageContent...]
      for (let i = 1; i < pageSplits.length; i += 3) {
        const pageNum = parseInt(pageSplits[i], 10);
        const pageContent = (pageSplits[i + 2] || '').trim();
        if (pageContent.length > 30) {
          const sectionHeading = getSectionHeadingForPage(pageNum);
          const chunkHash = crypto.createHash('md5').update(pageContent).digest('hex').slice(0, 10);

          chunks.push({
            id: `chunk-praja-p${pageNum}`,
            resource_id: 'res-praja-may-2025-pdf',
            document_title: datasetTitle,
            page_number: pageNum,
            section_heading: sectionHeading,
            content: pageContent,
            content_hash: chunkHash,
            original_url: OPENCITY_CATALOG_URL,
            publication_date: 'May 2025',
            tokens_count: Math.round(pageContent.length / 4),
          });
        }
      }
    } else {
      // Fallback: chunk by character segments if page markers vary
      const segmentSize = 2000;
      for (let i = 0; i < fullText.length; i += segmentSize) {
        const seg = fullText.slice(i, i + segmentSize).trim();
        const segIdx = Math.floor(i / segmentSize) + 1;
        chunks.push({
          id: `chunk-praja-seg${segIdx}`,
          resource_id: 'res-praja-may-2025-pdf',
          document_title: datasetTitle,
          page_number: Math.min(93, Math.ceil(segIdx * (93 / Math.ceil(fullText.length / segmentSize)))),
          section_heading: getSectionHeadingForPage(segIdx),
          content: seg,
          content_hash: crypto.createHash('md5').update(seg).digest('hex').slice(0, 10),
          original_url: OPENCITY_CATALOG_URL,
          publication_date: 'May 2025',
          tokens_count: Math.round(seg.length / 4),
        });
      }
    }

    logEntries.push(`[Scraper] Successfully indexed ${chunks.length} distinct document chunks with section metadata`);

    // Step 5: Save chunks into DB RAG store
    db.setDocumentChunks(chunks);

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    const resource: SourceResource = {
      id: 'res-praja-may-2025-pdf',
      source_id: 'opencity-in',
      dataset_title: datasetTitle,
      resource_title: 'Report on the Status of Civic Issues in Mumbai - May 2025',
      page_url: OPENCITY_CATALOG_URL,
      resource_url: pdfUrl,
      publication_date: 'May 2025',
      retrieved_at: completedAt.toISOString(),
      content_hash: contentHash,
      processing_status: 'processed',
      file_size_bytes: uint8Data.length,
      format: 'PDF',
    };

    const run: IngestionRun = {
      id: `ing-${Date.now()}`,
      source_id: 'opencity-in',
      source_name: 'OpenCity India',
      dataset_title: datasetTitle,
      dataset_url: OPENCITY_CATALOG_URL,
      resource_url: pdfUrl,
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
      status: 'success',
      resources_found: 1,
      documents_processed: 1,
      records_created: db.getIssues().length,
      duplicates_skipped: 0,
      documents_indexed: chunks.length,
      pages_extracted: chunks.length,
      duration_ms: durationMs,
      log_entries: logEntries,
    };

    db.addIngestionRun(run);
    return { run, resource };
  } catch (error: any) {
    const completedAt = new Date();
    logEntries.push(`[Scraper Error] ${error?.message || String(error)}`);

    const failedRun: IngestionRun = {
      id: `ing-failed-${Date.now()}`,
      source_id: 'opencity-in',
      source_name: 'OpenCity India',
      dataset_title: 'Report on the Status of Civic Issues in Mumbai - May 2025',
      dataset_url: OPENCITY_CATALOG_URL,
      resource_url: DEFAULT_PDF_URL,
      started_at: startedAt.toISOString(),
      completed_at: completedAt.toISOString(),
      status: 'failed',
      resources_found: 0,
      documents_processed: 0,
      records_created: 0,
      duplicates_skipped: 0,
      documents_indexed: 0,
      pages_extracted: 0,
      error_summary: error?.message || 'Ingestion encountered an unexpected error',
      duration_ms: completedAt.getTime() - startedAt.getTime(),
      log_entries: logEntries,
    };

    db.addIngestionRun(failedRun);
    throw error;
  } finally {
    isScrapingInProgress = false;
  }
}

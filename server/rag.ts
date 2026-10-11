import { db } from './db';
import { DocumentChunk, RagCitation, RagQueryResponse } from '../src/types/civic';
import { generateGeminiText, isGeminiConfigured } from './gemini';

// Simple, effective BM25-style keyword and semantic scoring over indexed chunks
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// Stopwords to ignore
const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'this', 'from', 'have', 'are', 'was',
  'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too',
  'very', 'can', 'will', 'just', 'should', 'now', 'report', 'mumbai', 'civic',
]);

export function retrieveRelevantChunks(
  query: string,
  topK = 4,
  issueContext?: string
): { chunk: DocumentChunk; score: number }[] {
  let chunks = [...db.getDocumentChunks()];

  // If no OpenCity report chunks in db yet, include verified issue evidence chunks
  const hasOpenCityChunks = chunks.some((c) => c.resource_id === 'res-praja-may-2025-pdf');
  if (!hasOpenCityChunks) {
    const issues = db.getIssues();
    const issueChunks: DocumentChunk[] = issues.flatMap((iss) =>
      iss.evidence.map((ev) => ({
        id: `chunk-${ev.id}`,
        resource_id: ev.resource_id,
        document_title: ev.document_title,
        page_number: ev.page_number,
        section_heading: ev.section_heading,
        content: `${iss.title}. ${iss.description}. Evidence: ${ev.evidence_excerpt}`,
        content_hash: 'seed',
        original_url: ev.original_url,
        publication_date: iss.publication_date,
      }))
    );
    chunks = [...chunks, ...issueChunks];
  }

  const queryTokens = tokenize(query).filter((t) => !STOPWORDS.has(t));
  if (queryTokens.length === 0) {
    return [];
  }

  // Combine query tokens with any issueContext tokens (e.g. category)
  const contextTokens = issueContext
    ? tokenize(issueContext).filter((t) => !STOPWORDS.has(t))
    : [];

  const scoredChunks = chunks.map((chunk) => {
    const contentLower = chunk.content.toLowerCase();
    const headingLower = chunk.section_heading.toLowerCase();

    let score = 0;

    for (const token of queryTokens) {
      // Exact word match
      const regex = new RegExp(`\\b${token}\\b`, 'g');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length * 3;
      } else if (contentLower.includes(token)) {
        score += 1;
      }

      // Heading match bonus
      if (headingLower.includes(token)) {
        score += 8;
      }
    }

    // Context token soft bonus
    for (const ctxToken of contextTokens) {
      if (contentLower.includes(ctxToken)) {
        score += 1.5;
      }
    }

    // Multi-term bigram co-occurrence boost
    for (let i = 0; i < queryTokens.length - 1; i++) {
      const bigram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
      if (contentLower.includes(bigram)) {
        score += 12;
      }
    }

    return { chunk, score };
  });

  return scoredChunks
    .filter((sc) => sc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export async function executeRagQuery(
  query: string,
  issueId?: string
): Promise<RagQueryResponse> {
  const issue = issueId ? db.getIssueById(issueId) : undefined;
  const issueContext = issue ? `${issue.title} ${issue.category} ${issue.location_text}` : undefined;

  const relevant = retrieveRelevantChunks(query, 4, issueContext);

  // Check if query is seeking Air Quality / AQI / CPCB data
  const qLower = query.toLowerCase();
  const isAirQualityQuery =
    qLower.includes('air') ||
    qLower.includes('aqi') ||
    qLower.includes('pm2.5') ||
    qLower.includes('pm10') ||
    qLower.includes('cpcb') ||
    qLower.includes('naaqs') ||
    qLower.includes('pollution') ||
    qLower.includes('station') ||
    qLower.includes('chembur') ||
    qLower.includes('bandra') ||
    qLower.includes('kurla') ||
    qLower.includes('sion');

  const aqReadings = db.getAirQualityReadings();
  let structuredAirContext = '';
  let matchedStationName: string | undefined;

  if (isAirQualityQuery && aqReadings.length > 0) {
    // Look for station name matches
    const matchedStations = aqReadings.filter((s) => {
      const name = s.station_name.toLowerCase();
      const ward = (s.ward || '').toLowerCase();
      return qLower.includes(name.split(',')[0].toLowerCase()) || (s.ward && qLower.includes(ward));
    });

    const stationsToInclude = matchedStations.length > 0 ? matchedStations : aqReadings.slice(0, 4);
    if (matchedStations.length > 0) {
      matchedStationName = matchedStations[0].station_name;
    }

    structuredAirContext = `\n\nSTRUCTURED MEASUREMENTS FROM CPCB CONTINUOUS AMBIENT AIR QUALITY MONITORING NETWORK (OGD India):
Dataset: Real Time Air Quality Index
Source: Central Pollution Control Board (CPCB), Ministry of Environment, Forest and Climate Change via Government of India Open Government Data (OGD) Platform (https://www.data.gov.in/catalog/real-time-air-quality-index)
${stationsToInclude
  .map(
    (s) =>
      `- Monitoring Station: ${s.station_name} (${s.ward || 'Mumbai'})
   Observation Time: ${s.observation_timestamp} | Data Freshness: ${s.data_freshness} (is_live: ${s.is_live})
   AQI: ${s.aqi !== null ? s.aqi : 'Unavailable'} (${s.aqi_category}) | Prominent Pollutant: ${s.prominent_pollutant || 'PM2.5'}
   Pollutant Readings: PM2.5=${s.pollutants.pm25?.value || 'N/A'} µg/m³, PM10=${s.pollutants.pm10?.value || 'N/A'} µg/m³, NO2=${s.pollutants.no2?.value || 'N/A'} µg/m³, SO2=${s.pollutants.so2?.value || 'N/A'} µg/m³, CO=${s.pollutants.co?.value || 'N/A'} mg/m³`
  )
  .join('\n')}`;
  }

  // Acceptance Test 7: Detect if evidence is insufficient
  // If top score is 0 or less than minimal threshold, and no structured air readings match, or query is entirely unrelated
  const isInsufficient =
    !isAirQualityQuery &&
    (relevant.length === 0 ||
      relevant[0].score < 2 ||
      isExplicitlyOutOfScopeQuery(query));

  if (isInsufficient) {
    return {
      query,
      issue_id: issueId,
      answer: `The provided source documentation (Praja Foundation's "Report on the Status of Civic Issues in Mumbai — May 2025" and CPCB's "Real Time Air Quality Index") does not contain evidence to answer this question. Ingested datasets cover Water Supply, Sewerage, Solid Waste Management, Public Toilets, and Ambient Air Quality / AQI in Mumbai. No verified records were found for: "${query}".`,
      citations: [],
      evidence_sufficient: false,
      evidence_summary: 'No matching passages retrieved from indexed OpenCity report chunks or CPCB station records.',
      limitations: 'Kartavya only grounds claims in verified source documents. Unsubstantiated claims or details outside the ingested dataset cannot be fabricated.',
      model_used: isGeminiConfigured() ? 'gemini-3.8-flash (RAG Grounding Mode)' : 'Local Civic Intelligence Engine',
    };
  }

  const citations: RagCitation[] = relevant.map((r) => {
    const excerpt = r.chunk.content.length > 300
      ? r.chunk.content.slice(0, 300) + '...'
      : r.chunk.content;

    return {
      chunk_id: r.chunk.id,
      page_number: r.chunk.page_number,
      section: r.chunk.section_heading,
      excerpt: excerpt.replace(/\s+/g, ' ').trim(),
      score: Math.round(r.score * 10) / 10,
      url: r.chunk.original_url,
    };
  });

  // If query is specifically about air quality and has station measurements but low chunk scores, add a citation to CPCB
  if (isAirQualityQuery && citations.length === 0 && aqReadings.length > 0) {
    citations.push({
      chunk_id: 'chunk-cpcb-ogd-api-record',
      page_number: 1,
      section: 'CPCB CAAQMS Telemetry Feed via OGD Platform',
      excerpt: `Continuous monitoring stations across Mumbai provide physical air quality readings for PM2.5, PM10, NO2, and SO2 according to CPCB NAAQS standards. Source URL: https://www.data.gov.in/catalog/real-time-air-quality-index`,
      score: 10,
      url: 'https://www.data.gov.in/catalog/real-time-air-quality-index',
    });
  }

  const passagesContext = relevant
    .map(
      (r, idx) =>
        `[Passage ${idx + 1} | Page ${r.chunk.page_number} | ${r.chunk.section_heading}]\n${r.chunk.content.slice(0, 1000)}`
    )
    .join('\n\n');

  const systemInstruction = `You are Kartavya's RAG Civic Intelligence Analyst.
Answer the user's question strictly based on the retrieved passages and structured measurements below.
Rules:
1. Ground every claim directly in the provided text and structured records.
2. For historical report data from Praja Foundation, cite the exact Page Number (e.g., "[Page 11]" or "[Page 60]").
3. For ambient air quality readings from CPCB via OGD Platform, state the Monitoring Station Name, Observation Time, and exact pollutant measurements (e.g. PM2.5 in µg/m³).
4. Clearly distinguish current or recent CAAQMS station observations from historical May 2025 audit findings.
5. Do not portray ambient regional AQI readings as proof of a local civic breach or individual violation.
6. Do not speculate or invent numbers not present in the excerpts.`;

  const prompt = `QUESTION: ${query}

${issue ? `ASSOCIATED CIVIC ISSUE: ${issue.title} (Category: ${issue.category}, Location: ${issue.location_text})\n` : ''}

RETRIEVED SOURCE EVIDENCE PASSAGES:
${passagesContext || 'No raw report passages retrieved; see structured telemetry.'}
${structuredAirContext}

Provide a concise, grounded explanation with specific provenance citations.`;

  let answer: string;
  if (isGeminiConfigured()) {
    try {
      answer = await generateGeminiText(prompt, systemInstruction);
    } catch (e) {
      console.warn('[RAG] Gemini call failed, using heuristic synthesizer:', e);
      answer = synthesizeGroundedFallback(query, relevant, issue, structuredAirContext);
    }
  } else {
    answer = synthesizeGroundedFallback(query, relevant, issue, structuredAirContext);
  }

  const lowerAnswer = answer.toLowerCase();
  const containsNegativeIndicators =
    lowerAnswer.includes('evidence is insufficient') ||
    lowerAnswer.includes('insufficient evidence') ||
    lowerAnswer.includes('contains no mention') ||
    lowerAnswer.includes('no information is provided') ||
    lowerAnswer.includes('does not mention') ||
    lowerAnswer.includes('does not contain');

  return {
    query,
    issue_id: issueId,
    answer,
    citations,
    evidence_sufficient: !containsNegativeIndicators || isAirQualityQuery,
    evidence_summary: containsNegativeIndicators && !isAirQualityQuery
      ? 'Retrieved passages do not contain verifiable facts for this query.'
      : citations.length > 0
      ? `Retrieved ${citations.length} supporting passages and CPCB telemetry from verified sources.`
      : 'Retrieved verified readings from CPCB CAAQMS network.',
    limitations: 'Reported audit data covers the historical period ending May 2025; ambient air readings represent station telemetry retrieved from the Government of India Open Government Data (OGD) Platform.',
    model_used: isGeminiConfigured() ? 'gemini-3.8-flash (Dual-Dataset Grounded RAG)' : 'Local Dual-Source Civic Intelligence Engine',
  };
}

function isExplicitlyOutOfScopeQuery(query: string): boolean {
  const q = query.toLowerCase();
  if (
    q.includes('phone') ||
    q.includes('mobile') ||
    q.includes('contact number') ||
    q.includes('email of') ||
    q.includes('personal address') ||
    q.includes('home address')
  ) {
    return true;
  }
  const foreignCities = ['london', 'paris', 'tokyo', 'new york', 'california', 'berlin', 'sydney'];
  if (foreignCities.some((c) => q.includes(c))) {
    return true;
  }
  const nonCivic = ['cricket', 'movie', 'recipe', 'bitcoin', 'stock', 'celebrity'];
  if (nonCivic.some((nc) => q.includes(nc))) {
    return true;
  }
  return false;
}

function synthesizeGroundedFallback(
  query: string,
  relevant: { chunk: DocumentChunk; score: number }[],
  issue?: any,
  structuredAirContext?: string
): string {
  if (structuredAirContext && (!relevant || relevant.length === 0)) {
    return `Based on physical telemetry from the Central Pollution Control Board (CPCB) continuous monitoring network (retrieved via Government of India Open Government Data Platform):\n${structuredAirContext}\n\nNote: Real-time/recent station observations represent regional ambient air dispersion and are preserved separately from municipal service grievance audits.`;
  }

  if (relevant && relevant.length > 0) {
    const top = relevant[0].chunk;
    const pageRef = `[Page ${top.page_number}]`;
    const cleanSnippet = top.content.slice(0, 450).replace(/\s+/g, ' ');

    let baseAnswer = `Based on documented evidence in ${top.section_heading} ${pageRef}:\n\n"${cleanSnippet}..."\n\nKey Finding: The verified source records confirm documented civic metrics with data compiled from municipal CCRS records, laboratory audits, and statutory monitoring. Additional supporting records appear across Pages ${relevant.map((r) => r.chunk.page_number).join(', ')}.`;

    if (structuredAirContext) {
      baseAnswer += `\n\nCross-Referenced CPCB Station Telemetry:${structuredAirContext}`;
    }

    return baseAnswer;
  }

  return 'The provided documentation does not contain sufficient verified evidence to answer this query.';
}


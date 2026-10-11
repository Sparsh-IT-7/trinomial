import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function isGeminiConfigured(): boolean {
  return !!apiKey;
}

export async function generateGeminiJson<T>(
  prompt: string,
  systemInstruction?: string,
  fallbackData?: T
): Promise<T> {
  if (!ai) {
    if (fallbackData !== undefined) return fallbackData;
    throw new Error('GEMINI_API_KEY not configured on server');
  }

  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are an objective civic intelligence analyst for Kartavya. Ground all claims in the provided source evidence. Do not fabricate facts.',
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), 8000)
    );

    const response = await Promise.race([callPromise, timeoutPromise]);
    const text = response.text || '';
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('[Gemini API Error]', error);
    if (fallbackData !== undefined) return fallbackData;
    throw error;
  }
}

export async function generateGeminiText(
  prompt: string,
  systemInstruction?: string,
  fallbackText?: string
): Promise<string> {
  if (!ai) {
    if (fallbackText !== undefined) return fallbackText;
    return 'Gemini API key is not currently configured on the server. Evidence-grounded local analytics are provided.';
  }

  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are an objective civic intelligence analyst for Kartavya.',
        temperature: 0.2,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), 8000)
    );

    const response = await Promise.race([callPromise, timeoutPromise]);
    return response.text || fallbackText || '';
  } catch (error) {
    console.warn('[Gemini API Notice] Using grounded fallback engine:', error);
    if (fallbackText !== undefined) return fallbackText;
    throw error;
  }
}


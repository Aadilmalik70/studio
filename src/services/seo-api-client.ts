
/**
 * @fileOverview Mock SEO API Client for BlogCraft AI.
 * This module simulates responses from a third-party SEO data API.
 * In a real application, this would interact with an actual API provider.
 */

import type { KeywordMetric } from '@/types/keyword-research';

// Simulate API latency
const MOCK_API_DELAY = 500; // ms

const generateMockMetrics = (keyword: string): Omit<KeywordMetric, 'intent'> => {
  const randomFactor = Math.random();
  return {
    keyword,
    volume: `${Math.floor(randomFactor * 5000)}`, // e.g., "1.2K" or "2500"
    difficulty: `${Math.floor(randomFactor * 100)}/100`, // e.g., "45/100"
    cpc: `$${(randomFactor * 5).toFixed(2)}`, // e.g., "$2.50"
  };
};

export async function getKeywordMetrics(
  keyword: string,
  targetCountry?: string,
  targetLanguage?: string
): Promise<Omit<KeywordMetric, 'intent'>> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log(`Mock API: Fetching metrics for "${keyword}" (Country: ${targetCountry}, Lang: ${targetLanguage})`);
  return generateMockMetrics(keyword);
}

export async function getRelatedKeywords(
  seedKeyword: string,
  targetCountry?: string,
  targetLanguage?: string
): Promise<Omit<KeywordMetric, 'intent'>[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log(`Mock API: Fetching related keywords for "${seedKeyword}"`);
  const related = [
    `${seedKeyword} benefits`,
    `best ${seedKeyword} tools`,
    `${seedKeyword} examples`,
    `how to use ${seedKeyword}`,
    `${seedKeyword} strategy`,
    `compare ${seedKeyword} solutions`,
    `${seedKeyword} for beginners`,
    `advanced ${seedKeyword} techniques`,
    `${seedKeyword} pricing`,
    `${seedKeyword} reviews`,
  ];
  return related.map(generateMockMetrics);
}

export async function getQuestionKeywords(
  seedKeyword: string,
  targetCountry?: string,
  targetLanguage?: string
): Promise<Omit<KeywordMetric, 'intent'>[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log(`Mock API: Fetching question keywords for "${seedKeyword}"`);
  const questions = [
    `what is ${seedKeyword}?`,
    `how does ${seedKeyword} work?`,
    `why use ${seedKeyword}?`,
    `can ${seedKeyword} improve X?`,
    `is ${seedKeyword} worth it?`,
    `where to find ${seedKeyword} resources?`,
  ];
  return questions.map(generateMockMetrics);
}

export async function getLongTailKeywords(
  seedKeyword: string,
  targetCountry?: string,
  targetLanguage?: string
): Promise<Omit<KeywordMetric, 'intent'>[]> {
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
  console.log(`Mock API: Fetching long-tail keywords for "${seedKeyword}"`);
  const longTail = [
    `how to implement ${seedKeyword} for small business`,
    `best ${seedKeyword} practices for content marketing 2025`,
    `step-by-step guide to ${seedKeyword} optimization`,
    `${seedKeyword} impact on user engagement metrics`,
    `future trends in ${seedKeyword} and artificial intelligence`,
  ];
  return longTail.map(generateMockMetrics);
}

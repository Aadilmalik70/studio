
export interface KeywordResearchRequest {
  seedKeywords: string[];
  targetCountry?: string;
  targetLanguage?: string;
}

export interface KeywordMetric {
  keyword: string;
  volume: string; // Can be number or string like "1.2K"
  difficulty: string; // Can be number or string like "45/100"
  cpc: string; // Can be number or string like "$2.50"
  intent: string; // e.g., "Informational", "Transactional"
}

export interface TopicCluster {
  clusterName: string;
  keywords: string[];
}

export interface KeywordResearchResponse {
  seedKeywordMetrics?: KeywordMetric[];
  relatedKeywords?: KeywordMetric[];
  questionKeywords?: KeywordMetric[];
  longTailKeywords?: KeywordMetric[];
  topicClusters?: TopicCluster[];
  error?: string | null; 
}

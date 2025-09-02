export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  totalTokens?: number;
  totalSnippets?: number;
  stars?: number;
  trustScore?: number;
  versions?: string[];
}

export interface SearchResponse {
  results: SearchResultItem[];
  error?: string;
}

// Docs API (type=json) item
export interface DocsJsonCodeItem {
  language?: string;
  code?: string;
}

export interface DocsJsonItem {
  codeTitle?: string;
  codeDescription?: string;
  codeLanguage?: string;
  codeTokens?: number;
  codeId?: string; // e.g., source URL
  pageTitle?: string;
  codeList?: DocsJsonCodeItem[];
  relevance?: number;
}

export type DocsJsonResponse = DocsJsonItem[];



import { request } from "undici";
import type { SearchResponse, DocsJsonResponse } from "./type.js";

const BASE_URL = "https://context7.com/api/v1";

export interface Context7ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  token?: string;
}

export class Context7Client {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly token: string;
  constructor(options: Context7ClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? BASE_URL;
    this.apiKey = options.apiKey ?? process.env.CONTEXT7_KEY ?? "";
    this.token = options.token ?? process.env.CONTEXT7_TOKEN ?? "5000";
    if (!this.apiKey) {
      // 保留空 key，调用时可提示
    }
  }

  private authHeaders() {
    return this.apiKey
      ? { Authorization: `Bearer ${this.apiKey}` }
      : {} as Record<string, string>;
  }

  async searchLibraries(query: string): Promise<SearchResponse> {
    if (!query?.trim()) {
      return { results: [], error: "query is required" };
    }
    const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}`;
    const { body, statusCode } = await request(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...this.authHeaders()
      }
    });

    if (statusCode < 200 || statusCode >= 300) {
      const text = await body.text();
      return { results: [], error: `HTTP ${statusCode}: ${text}` };
    }

    const json = (await body.json()) as SearchResponse;
    if (!Array.isArray(json.results)) {
      return { results: [], error: "invalid response format" };
    }
    return json;
  }

  async getLibraryDocs(
    id: string,
    options?: { type?: "txt" | "json"; topic?: string; tokens?: number }
  ): Promise<string | DocsJsonResponse | { error: string }> {
    if (!id?.trim()) return { error: "id is required" };
    const type = options?.type ?? "json";
    const topic = options?.topic;
    const tokens = options?.tokens ?? this.token;
    const qs = new URLSearchParams();
    if (type) qs.set("type", type);
    if (topic) qs.set("topic", topic);
    if (tokens) qs.set("tokens", String(tokens));

    // 规范：id 形如 /org/project 或 /org/project/version
    const clean = id.startsWith("/") ? id.slice(1) : id;
    const url = `${this.baseUrl}/${clean}?${qs.toString()}`;
    const { body, statusCode } = await request(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        ...this.authHeaders()
      }
    });

    if (statusCode < 200 || statusCode >= 300) {
      const text = await body.text();
      return { error: `HTTP ${statusCode}: ${text}` };
    }

    if (type === "json") {
      return (await body.json()) as DocsJsonResponse;
    }
    return await body.text();
  }
}



import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { SearchResponse } from "../utils/type";
import { Context7Client } from "../utils/api";

export function registerResolveLibraryIdTool(server: McpServer) {
  // Register Context7 tools
  server.registerTool(
    "resolve-library-id",
    {
      title: "Resolve Context7 Library ID",
      description: `Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

Selection Process:
1. Analyze the query to understand what library/package the user is looking for
2. Return the most relevant match based on:
- Name similarity to the query (exact matches prioritized)
- Description relevance to the query's intent
- Documentation coverage (prioritize libraries with higher Code Snippet counts)
- Trust score (consider libraries with scores of 7-10 more authoritative)

Response Format:
- Return the selected library ID in a clearly marked section
- Provide a brief explanation for why this library was chosen
- If multiple good matches exist, acknowledge this but proceed with the most relevant one
- If no good matches exist, clearly state this and suggest query refinements

For ambiguous queries, request clarification before proceeding with a best-guess match.`,
      inputSchema: {
        libraryName: z
          .string()
          .describe("Library name to search for and retrieve a Context7-compatible library ID."),
      },
    },
    async ({ libraryName }) => {
      const client = new Context7Client();
      const searchResponse: SearchResponse = await client.searchLibraries(libraryName);

      console.error('searchResponse: ', searchResponse);

      if (!searchResponse.results || searchResponse.results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: searchResponse.error
                ? searchResponse.error
                : "Failed to retrieve library documentation data from Context7",
            },
          ],
        };
      }

      return {
        content: [{
          type: "text",
          text: `Available Libraries (top matches):

Each result includes:
- Library ID: Context7-compatible identifier (format: /org/project)
- Name: Library or package name
- Description: Short summary
- Code Snippets: Number of available code examples
- Trust Score: Authority indicator
- Versions: List of versions if available. Use one of those versions if and only if the user explicitly provides a version in their query.

For best results, select libraries based on name match, trust score, snippet coverage, and relevance to your use case.

----------
${searchResponse.results.map((result) => result.id).join("\n")}`
        }]
      }
    }
  );
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Context7Client } from "../utils/api";

const DEFAULT_MINIMUM_TOKENS = process.env.CONTEXT7_TOKEN ? Number(process.env.CONTEXT7_TOKEN) : 5000;

export function registerGetLibraryDocsTool(server: McpServer) {
  server.registerTool(
    "get-library-docs",
    {
      title: "Get Library Docs",
      description:
        "Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.",
      inputSchema: {
        context7CompatibleLibraryID: z
          .string()
          .describe(
            "Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'."
          ),
        topic: z
          .string()
          .optional()
          .describe("Topic to focus documentation on (e.g., 'hooks', 'routing')."),
        tokens: z
          .preprocess((val) => (typeof val === "string" ? Number(val) : val), z.number())
          .transform((val) => (val < DEFAULT_MINIMUM_TOKENS ? DEFAULT_MINIMUM_TOKENS : val))
          .optional()
          .describe(
            `Maximum number of tokens of documentation to retrieve (default: ${DEFAULT_MINIMUM_TOKENS}). Higher values provide more context but consume more tokens.`
          ),
      },
    },
    async ({ context7CompatibleLibraryID, tokens = DEFAULT_MINIMUM_TOKENS, topic = "" }) => {
      const client = new Context7Client();
      const fetchDocsResponse = await client.getLibraryDocs(
        context7CompatibleLibraryID,
        {
          tokens,
          topic,
        }
      );

      if (!fetchDocsResponse) {
        return {
          content: [
            {
              type: "text",
              text: "Documentation not found or not finalized for this library. This might have happened because you used an invalid Context7-compatible library ID. To get a valid Context7-compatible library ID, use the 'resolve-library-id' with the package name you wish to retrieve documentation for.",
            },
          ],
        };
      }

      // MCP 的 text 内容必须是字符串；将对象/错误统一转换为字符串
      let text: string;
      if (typeof fetchDocsResponse === "string") {
        text = fetchDocsResponse;
      } else if (fetchDocsResponse && typeof fetchDocsResponse === "object" && "error" in fetchDocsResponse) {
        text = `Error: ${String((fetchDocsResponse as { error: string }).error)}`;
      } else {
        text = JSON.stringify(fetchDocsResponse, null, 2);
      }

      return {
        content: [
          {
            type: "text",
            text
          },
        ],
      };
    }
  );
}

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTestTool(server: McpServer) {
  server.registerTool("add",
    {
      title: "加法工具",
      description: "将两个数字相加",
      inputSchema: { a: z.number(), b: z.number() }
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }]
    })
  );
}
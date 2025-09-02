import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTestTool } from "./testTool";
import { registerResolveLibraryIdTool } from "./resolveLibraryId";
import { registerGetLibraryDocsTool } from "./getLibraryDocs";

// 批量注册工具
export function registerTools(server: McpServer) {
  registerTestTool(server);
  registerResolveLibraryIdTool(server);
  registerGetLibraryDocsTool(server);
}
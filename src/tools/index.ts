import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; 
import { registerResolveLibraryIdTool } from "./resolveLibraryId";
import { registerGetLibraryDocsTool } from "./getLibraryDocs";
import { registerGetProjectSpecificationTool } from "./getProjectSpecification";
import { registerGetPageTemplateTool } from "./getPageTemplate";

// 批量注册工具
export function registerTools(server: McpServer) {
  registerResolveLibraryIdTool(server);
  registerGetLibraryDocsTool(server);
  registerGetProjectSpecificationTool(server);
  registerGetPageTemplateTool(server);
}
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSpecDoc } from "../utils/fileReader";
import { z } from "zod";

export function registerGetProjectSpecificationTool(server: McpServer) {
  server.registerTool("get-project-specification", {
    title: "Get project specification",
    description: "Please prioritize using this tool to access the project documentation standards to understand the project’s basic information, development workflow, and development specifications. If the documentation provides a clear development process, follow that process for subsequent development.",
    inputSchema: {
      specDir: z.string().optional().describe("Optional. The path used to locate the project specification file. If it is an absolute path, the file at that absolute path is used. If it is a relative path, the file is searched for relative to the current working directory. If left unspecified, the environment variable path is used first; otherwise, the default relative path './contexts/specs' is used."),
    },
  }, async ({ specDir }) => {
    const specDoc = await getSpecDoc(specDir);
    return {
      content: [{ type: "text", text: specDoc }],
    };
  });
}

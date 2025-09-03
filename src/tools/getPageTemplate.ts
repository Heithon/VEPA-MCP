import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getPageTemp } from "../utils/fileReader";
import { z } from "zod";

export function registerGetPageTemplateTool(server: McpServer) {
  server.registerTool("get-page-template", {
    title: "Get page template",
    description: "Obtain the sample template file for the page; you will need to write code based on the template you retrieve. First, call the 'get-project-specification' tool to obtain the project specification document and check whether it specifies the path to the page template file, as well as the exact steps to take after obtaining the template. There may be multiple page template files, in which case you will need to call this tool multiple times. If you cannot obtain the project specification document, you can also use this tool to search for existing template files for reference.",
    inputSchema: {
      pageTempDir: z.string().optional().describe("Optional. The path used to locate the template file. If it is an absolute path, the file at that absolute path is used. If it is a relative path, the file is searched for relative to the current working directory. If left unspecified, the environment variable path is used first; otherwise, the default relative path './contexts/template' is used."),
    },
  }, async ({ pageTempDir }) => {
    const pageTempDoc = await getPageTemp(pageTempDir);
    return {
      content: [{ type: "text", text: pageTempDoc }],
    };
  });
}
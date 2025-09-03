import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getSpecDoc } from "../utils/fileReader";
import { z } from "zod";

export function registerGetProjectSpecificationTool(server: McpServer) {
  server.registerTool("get-project-specification", {
    title: "Get project specification",
    description: "Please use this tool as your first choice to obtain the project documentation specification, so you can understand the project’s basic information, development workflow, and development conventions. If the documentation specifies a clear development workflow, follow that workflow for subsequent development. Pay special attention to the context7 Id mentioned in the specification; you can use this Id to call get-library-docs to retrieve the required documents.",
    inputSchema: {
      specDir: z.string().optional().describe("Optional. The path used to locate the project specification file. If it is an absolute path, the file at that absolute path is used. If it is a relative path, the file is searched for relative to the current working directory. If left unspecified, the environment variable path is used first; otherwise, the default relative path './contexts/specs' is used."),
    },
  }, async ({ specDir }) => {
    const specDoc = await getSpecDoc(specDir);
    return {
      content: [{ type: "text", text: `
        This is the project’s specification document. Please pay particular attention to which frameworks or libraries this framework depends on. As needed, you can call the 'resolve-library-id' tool and 'get-library-docs' to obtain usage documentation for relevant libraries via context7, including usage docs for specific components or methods.

The specification may also indicate the context7 ID of the library being used, allowing you to call 'get-library-docs' directly to retrieve the desired documentation.

The specification may specify the paths to certain template files. You can obtain templates via the 'get-page-template' tool. If not explicitly stated, you can also try searching for default templates for reference.

If the specification outlines a follow-up development workflow, follow the process in the specification as closely as possible.

The project specification is as follows:
-------------------------------------------------
        \n${specDoc}` }],
    };
  });
}

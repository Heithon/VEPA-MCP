import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools";
import { parseCliOptions } from "./utils/commander";

async function main() {
  // 解析命令行参数并注入到环境变量
  parseCliOptions();
  // 初始化MCP服务器
  const server = new McpServer({
    name: "VEPA-MCP",
    version: process.env.npm_package_version || "1.0.0"
  });
  // 注册工具
  registerTools(server);

  const transport = new StdioServerTransport();

  process.on("SIGINT", async () => {
    try {
      await transport.close();
    } finally {
      process.exit(0);
    }
  });

  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


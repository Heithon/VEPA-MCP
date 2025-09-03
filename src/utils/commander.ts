import { program } from "commander";

export interface CliOptions {
	key?: string;
	token?: string;
	specDir?: string;
	pageTempDir?: string;
}

export function parseCliOptions(argv: string[] = process.argv): CliOptions {
	program
		.name("vepa-mcp")
		.description("VEPA MCP server")
		.option("--key <string>", "用于连接 context7 的服务密钥")
		.option("--token <string>", "控制context7的返回值长度")
		.option("--spec-dir <path>", "规范文档目录, 默认为'./contexts/specs.md'")
		.option("--page-temp-dir <path>", "页面模板根目录");

	program.parse(argv);
	const opts = program.opts<{
		key?: string;
		token?: string;
		specDir?: string;
		pageTempDir?: string;
	}>();

	const normalized: CliOptions = {
		key: opts.key,
		token: opts.token,
		specDir: opts.specDir,
		pageTempDir: opts.pageTempDir
	};

	// 同步到进程环境，便于全局获取
	if (normalized.key) process.env.CONTEXT7_KEY = normalized.key;
	if (normalized.token) process.env.CONTEXT7_TOKEN = normalized.token;
	if (normalized.specDir) process.env.SPEC_DIR = normalized.specDir;
	if (normalized.pageTempDir) process.env.PAGE_TEMP_DIR = normalized.pageTempDir;

	return normalized;
}


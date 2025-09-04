# VEPA-MCP

[English](./README.md) | 中文

VEPA-MCP 现在已成为适用于各类项目的通用 MCP 服务器，LLM可以调用本MCP获取指定开源项目的最新文档，读取指定目录中的规范和模板文件。它目前提供 4 个工具： 

- resolve-library-id：获取 context7 ID。
- get-library-docs：通过 context7 ID 获取你想了解的项目文档。 
- get-project-specification：从指定目录获取规范文档。 
- get-page-template：从指定目录获取页面模板文件。

获取最新文档的功能来自[Context7](https://github.com/upstash/context7)项目，这个项目能够搜索常见开源项目的最新文档，由于对项目文档做了RAG，因此能够进行比较模糊的搜索，并召回最相关的多条文档片段。我们可以将这些文档片段插入LLM的上下文来减少幻觉。

## 安装

### 环境

- Node.js >= v18.0.0
- Cursor, Claude Code, VSCode, Windsurf or another MCP Client
- Context7 API Key，其实不要也可以，但是有key能提高请求频率。（[获取Context API Key](https://context7.com/dashboard)）

本项目已发布为npm包，地址为：https://www.npmjs.com/package/@silkide/vepa-mcp，因此可以使用npx调用服务。下面以cursor中添加MCP服务器为例：

进入Cursor的MCP服务器设置：`Settings` -> `Cursor Settings` -> `MCP` -> `Add new global MCP server`

![](./icons/cursor-mcp-setting.png)

在这里你可以进入MCP的JSON配置文件，将下面这段配置复制进去：

``` JSON
{
  "mcpServers": {
    // ....
    "vepa-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@silkide/vepa-mcp@latest"
      ]
    }
  }
}
```

其它支持MCP的平台也大同小异，可以查阅相关文档。

### 环境变量和启动参数

vepa-mcp提供了一些环境变量和启动参数进行个性化配置：

- `CONTEXT7_KEY` : 添加Context7 API Key，也可以通过启动参数 `--key xxx` 进行配置
- `CONTEXT7_TOKEN` : 控制Context7返回的默认token数量，也可以通过启动参数 `--token xxx` 进行配置（不一定生效，LLM调用工具时也可以自行传入token）
- `SPEC_DIR` : 指定项目规范文档目录，默认为 `project/contexts/spec.md`，也可以通过启动参数 `--spec-dir xxx` 进行配置
- `PAGE_TEMP_DIR` : 指定页面模板的目录，默认为 `project/contexts/template`，也可以通过启动参数 `--page-temp-dir xxx` 进行配置

你可以在Cursor的MCP配置文件中设置启动参数和环境变量

```json
{
  "mcpServers": {
    // ....
    "vepa-mcp": {
      "command": "npx",
      "args": [
          "-y",
          "@silkide/vepa-mcp@latest",
          "--key xxx",
          "--spec-dir /xxx/xxx"
      ],
        "env": {
          "KEY": "value"
      }
    }
  }
}
```

## 规范文档

当LLM调用此MCP，会优先调用get-project-specification工具查看项目规范文档。规范文档中，建议指明本项目用到的主要依赖和框架，并提前在[context7.com](https://context7.com/) 中找到对应文档的ID，一并写入规范中。

你还可以在规范中指明LLM在读取规范后的下一步处理流程，让其有更强的指令遵循性。你可以在项目 ./test/contexts/spec.md 中查看示例文档。

## 开发

克隆本项目并安装依赖：

```shel
pnpm install
```

构建本项目: 

```shell
pnpm build
```

最终产物在 dist/index.js，你可以运行这个脚本：

```shell
node dist/index.js
```

推荐使用锦恢大佬开发的vscode MCP调试插件：[OpenMCP](https://openmcp.kirigaya.cn/zh/)，能够非常方便的调试MCP服务。

你也可以使用官方出品的 [inspector](https://github.com/modelcontextprotocol/inspector) 进行调试。


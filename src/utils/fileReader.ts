import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import os from "node:os";

/**
 * 判断路径是否为绝对路径或相对路径
 * @param input 路径
 * @returns 绝对路径或相对路径
 */
export function isAbsoluteOrRelative(input: string): "absolute" | "relative" {
  // 处理 file://
  if (input.startsWith("file://")) {
    const fsPath = fileURLToPath(input);
    return path.isAbsolute(fsPath) ? "absolute" : "relative";
  }
  // 处理 ~
  const expanded = input.startsWith("~/")
    ? path.join(os.homedir(), input.slice(2))
    : input;

  return path.isAbsolute(expanded) ? "absolute" : "relative";
}

/**
 * 若路径无扩展名，则在同目录下查找第一个同名的文件
 */
async function resolveWithAnyExtension(absPath: string): Promise<string> {
  const ext = path.extname(absPath);
  if (ext) return absPath;
  const dir = path.dirname(absPath);
  const base = path.basename(absPath);
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const match = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .find((name) => path.parse(name).name === base);
    return match ? path.join(dir, match) : absPath;
  } catch {
    return absPath;
  }
}

/**
 * 获取规范文档
 * @returns 规范文档
 */
export async function getSpecDoc(dir?: string) {
  let specDir = dir ?? process.env.SPEC_DIR ?? '/contexts/specs';
  specDir = specDir.replace(/^["']|["']$/g, '');
  if (isAbsoluteOrRelative(specDir) === "relative") {
    specDir = path.join(process.cwd(), specDir);
  }
  specDir = await resolveWithAnyExtension(specDir);
  try {
    const specDoc = await readFile(specDir, "utf-8");
    return specDoc;
  } catch (error) {
    console.error(`获取规范文档失败: ${error}`);
    return (error as Error).toString();
  }
}
/**
 * 获取页面模板
 * @returns 页面模板
 */
export async function getPageTemp(dir?: string) {
  let pageTempDir = dir ?? process.env.PAGE_TEMP_DIR ?? '/contexts/template';
  pageTempDir = pageTempDir.replace(/^["']|["']$/g, '');
  if (isAbsoluteOrRelative(pageTempDir) === "relative") {
    pageTempDir = path.join(process.cwd(), pageTempDir);
  }
  pageTempDir = await resolveWithAnyExtension(pageTempDir);
  try {
    const pageTempDoc = await readFile(pageTempDir, "utf-8");
    return pageTempDoc;
  } catch (error) {
    console.error(`获取页面模板失败: ${error}`);
    return (error as Error).toString();
  }
}
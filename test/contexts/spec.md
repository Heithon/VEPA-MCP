# 前端项目规范（测试版）

适用于基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia 的中大型前端项目。该文档为测试版，用于演示与验证 MCP 读取规范文档的能力，可按需裁剪与扩展。

使用 vue-element-plus-admin这个框架进行开发
框架文档的context7库的ID为：/kailong321200875/vue-element-plus-admin-doc

## 1. 技术栈与基础约定

- **框架**: Vue 3 (Composition API, `<script setup>`)
- **语言**: TypeScript（严格模式，禁用 `any`，尽量使用类型别名/字面量联合而非枚举）
- **构建**: Vite（ESM 优先，按需打包）
- **组件库**: Element Plus（统一主题与交互规范）
- **状态管理**: Pinia（模块化 Store）
- **路由**: Vue Router（按路由分包，懒加载）
- **网络**: Axios 封装（统一拦截与错误处理）
- **样式**: SCSS + 原子化/工具类（可选），移动端优先/响应式
- **国际化**: Vue I18n（key 规范，文案外置）
- **测试**: Vitest + Vue Test Utils
- **代码质量**: ESLint + Prettier（提交前自动修复），Commitlint（约定式提交）

## 2. 目录结构

```
src/
  api/                # 接口层（axios 实例、模块化服务）
  components/         # 复用组件（Base/业务组件）
  composables/        # 组合式函数（useXxx）
  pages/              # 页面（按路由组织）
  router/             # 路由配置
  stores/             # Pinia store（模块化）
  styles/             # 全局样式、变量、mixin
  utils/              # 工具方法、类型
  i18n/               # 国际化资源
  assets/             # 静态资源
  types/              # 通用类型声明
  app.vue
  main.ts
```

## 3. 命名规范

- **文件/目录**: `kebab-case`（如 `user-profile.vue`, `user-service.ts`）
- **组件**: `PascalCase`（如 `BaseButton.vue`, `UserCard.vue`）
- **变量/函数**: `camelCase`；常量 `UPPER_SNAKE_CASE`
- **Pinia Store**: `useXxxStore`，id 同名 `xxx`
- **Props/事件**: `props` 使用名词；事件 `update:modelValue` 或 `xxx-change`
- **CSS 类**: BEM 或 `prefix-block__elem--mod`（避免全局命名污染）

## 4. TypeScript 规范

- 启用严格模式；避免 `any`；必要时使用 `unknown` 并在边界处缩小类型
- 公共类型统一放在 `types/`，对外 `export type Xxx`
- 使用字面量联合（如 `type Size = 'sm' | 'md' | 'lg'`）替代枚举，便于树摇与可读
- API DTO、分页、通用响应统一建模

示例：

```ts
// types/http.ts
export interface PageReq {
  page: number;
  pageSize: number;
}
export interface PageResp<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}
export interface ApiResp<T> {
  code: number;
  msg: string;
  data: T;
}
```

## 5. 组件规范

- 使用 `<script setup>`；**先类型后逻辑**，结构顺序：imports → 类型 → props/emits → 变量/计算 → 方法 → 生命周期
- 防止组件过大：单文件不超过 ~300 行，拆分子组件或抽到 `composables/`
- 受控/双向绑定统一使用 `v-model` 与 `defineEmits(['update:modelValue'])`
- 对外暴露方法使用 `defineExpose`

示例：

```vue
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string;
  disabled?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>

<template>
  <el-input v-model="value" :disabled="props.disabled" />
</template>
```

## 6. 路由规范

- 路由按页面懒加载：`component: () => import('../pages/xxx/index.vue')`
- `meta` 统一字段：`title`、`auth`、`keepAlive`、`icon`、`order`
- 路由守卫仅做**鉴权**与**必要重定向**，复杂逻辑下沉至业务层

## 7. API 层规范（Axios）

- 单例 axios 实例，超时、baseURL、headers、token 注入、统一错误码处理
- Service 模块化，方法命名语义化：`getUserDetail`、`updateUserProfile`
- 避免在组件中直接拼 URL/Query；所有网络交互经由 `api/`

示例：

```ts
// api/http.ts
import axios from "axios";

export const http = axios.create({ baseURL: "/api", timeout: 15000 });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (resp) => resp.data,
  (err) => {
    // 统一错误提示
    const msg = err?.response?.data?.msg || err.message;
    // 这里可接 ElementPlus ElMessage
    return Promise.reject(new Error(msg));
  }
);

// api/user.ts
import type { ApiResp } from "@/types/http";
import { http } from "./http";

export function getUserDetail(id: string) {
  return http.get<ApiResp<{ id: string; name: string }>>(`/user/${id}`);
}
```

## 8. 状态管理（Pinia）

- Store 仅承载**可复用跨页面状态**与**与之相关的动作**；页面私有状态放组件内
- Store 内部按 `state/getters/actions` 分组；异步 action 要有错误兜底

示例：

```ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({ info: null as null | { id: string; name: string } }),
  getters: { isLogin: (s) => !!s.info },
  actions: {
    async fetch() {
      // 调 api 获取用户信息
    },
  },
});
```

## 9. 样式与设计规范

- 主题变量集中：`styles/variables.scss`；全局工具在 `styles/mixins.scss`
- 使用 **BEM** 或原子化类，避免嵌套层级超过 3 层
- 组件内样式默认 `scoped`；全局覆盖放置于 `styles/`
- 响应式：移动端优先，断点：`576/768/992/1200/1600`

## 10. 国际化（i18n）

- key 统一命名：`page.module.key`；中文文案不出现在组件内
- 文案变更需同步更新所有语言包并通过审校

## 11. 可访问性（a11y）

- 交互控件提供可见文本或 `aria-label`
- 表单/对话框支持键盘操作与焦点管理
- 图片拥有 `alt`；颜色对比度满足 AA

## 12. 性能与体验

- 路由/组件懒加载；大组件拆分；第三方库按需引入
- 使用 `computed` 替代过度 `watch`；避免不必要的 `ref` 深层结构
- 列表虚拟化（超 1000 行考虑）

## 13. 安全

- XSS：渲染富文本时使用白名单/清洗（如 DOMPurify）
- CSRF：按后端策略处理；同源携带 Cookie 时注意 `SameSite`
- 输入校验：前后端一致校验规则

## 14. 测试

- 单元测试：Vitest + Vue Test Utils；关键业务逻辑需覆盖
- E2E（可选）：Playwright/Cypress

示例：

```ts
import { mount } from "@vue/test-utils";
import BaseButton from "@/components/base/base-button.vue";

test("emit click", async () => {
  const wrapper = mount(BaseButton);
  await wrapper.trigger("click");
  expect(wrapper.emitted("click")).toBeTruthy();
});
```

## 15. 代码风格与提交

- ESLint + Prettier：提交前自动修复（lint-staged/husky）
- 约定式提交（Commitlint）：`feat: `, `fix: `, `docs: `, `refactor: `, `chore: ` 等
- 分支命名：`feature/xxx`、`fix/xxx`、`chore/xxx`
- PR 检查清单：说明、截图、测试结果、影响范围、回滚方案

## 16. 发布与版本

- 语义化版本：`MAJOR.MINOR.PATCH`
- 变更日志：自动生成（如 conventional-changelog）

---

以上为测试用前端规范，真实项目可在此基础上细化团队约定（如路由权限、错误码、埋点、监控告警、灰度策略等）。

## 测试规范

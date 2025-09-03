<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "submit"): void;
}>();

const value = computed({
  get: () => props.modelValue ?? "",
  set: (v: string) => emit("update:modelValue", v),
});

function onSubmit() {
  emit("submit");
}
</script>

<template>
  <div class="app-template">
    <label v-if="props.label" class="app-template__label">{{
      props.label
    }}</label>
    <input
      class="app-template__input"
      v-model="value"
      :disabled="props.disabled"
      type="text"
      placeholder="请输入"
    />
    <button
      class="app-template__btn"
      type="button"
      @click="onSubmit"
      :disabled="props.disabled"
    >
      提交
    </button>
  </div>
  <!-- 使用示例：
  <Template v-model="text" label="名称" @submit="handleSubmit" />
  -->
</template>

<style scoped>
.app-template {
  display: flex;
  gap: 8px;
  align-items: center;
}
.app-template__label {
  color: #333;
}
.app-template__input {
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.app-template__btn {
  padding: 6px 12px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.app-template__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

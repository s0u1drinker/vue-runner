<script setup lang="ts">
const props = defineProps<{
  labelText: string,
  inputType: string,
  placeholder?: string,
  id: string,
}>()
</script>

<template>
  <div class="l-input">
    <label :for="id" class="l-input__label">{{ `${labelText}:` }}</label>
    <input :type="inputType" :id class="input l-input__input" :placeholder>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.l-input {
  display: flex;
  flex-direction: column;
  gap: var(--indent-half);

  @media (--viewport-md) {
    flex-direction: row;
    align-items: center;
  }
}
</style>
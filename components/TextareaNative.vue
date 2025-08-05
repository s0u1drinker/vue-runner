<script setup lang="ts">
const { rows = 3, placeholder = '', maxlength = 160 } = defineProps<{
  rows?: number,
  placeholder?: string,
  maxlength?: number,
}>()
// Счётчик введённых символов.
const currentCount = computed(() => textareaValue.value.length)
// Значение, заданное пользователем.
const textareaValue = defineModel<string>({ default: '' })
</script>

<template>
  <div class="ta-native">
    <textarea
      class="ta-native__textarea"
      :rows
      :placeholder
      :maxlength
      v-model="textareaValue"
    ></textarea>
    <span
      class="ta-native__counter"
      :class="{ 'color_red': currentCount === maxlength }"
    >{{ `${currentCount}/${maxlength}` }}</span>
  </div>
</template>

<style scoped>
.ta-native {
  color: var(--gray);
  display: flex;
  flex-direction: column;
  border: var(--border);
  border-radius: .25rem;
  box-sizing: border-box;
  overflow: hidden;
  min-width: 15rem;

  &:focus-within {
    outline: var(--focus);
  }

  &__textarea {
    border: 0 none;
    border-radius: .25rem .25rem 0 0;
    padding: var(--indent-half);

    &:focus {
      outline: 0 none;
    }
  }

  &__counter {
    padding: var(--indent-half);
    text-align: right;
  }
}
</style>
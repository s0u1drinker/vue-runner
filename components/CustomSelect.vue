<script setup lang="ts">
import type { SelectOptions } from '@/types/selectOptions'

// Значение Placeholder по умолчанию.
// Также отображается в aria-label, если в placeholder "пришла" пустая строка.
const defaultPlaceholder = 'Выберите элемент...'

const { options, name, placeholder = defaultPlaceholder } = defineProps<{
  options: SelectOptions[],
  name: string,
  placeholder?: string
}>()

// Выбранное значение.
const selectValue = defineModel()
</script>

<template>
  <select
    class="select"
    v-model="selectValue"
    :aria-label="placeholder || defaultPlaceholder"
    :name
  >
    <option value="-1" disabled hidden>{{ placeholder }}</option>
    <option
      :value="option.value"
      v-for="(option, index) in options"
      :key="`${option.value}-${index}`"
    >{{ option.label }}</option>
  </select>
</template>

<style scoped>
.select {
  padding: var(--indent-quarter) var(--indent-half);
  border: var(--border);
  border-radius: var(--indent-quarter);
}
</style>
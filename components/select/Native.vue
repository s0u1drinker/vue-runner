<script setup lang="ts">
import type { SelectNativeOptions } from '~/types/selectNativeOptions'

// Значение Placeholder по умолчанию.
// Также отображается в aria-label, если в placeholder "пришла" пустая строка.
const defaultPlaceholder = 'Выберите элемент...'

const { options, name, placeholder = defaultPlaceholder } = defineProps<{
  options: SelectNativeOptions[],
  name: string,
  placeholder?: string
}>()

// Выбранное значение.
const selectValue = defineModel()
</script>

<template>
  <select
    class="n-select"
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
.n-select {
  padding: var(--indent-quarter) var(--indent-half);
  border: var(--border);
  border-radius: var(--indent-quarter);
}
</style>
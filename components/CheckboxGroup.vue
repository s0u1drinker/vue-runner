<script setup lang="ts">
const props = defineProps<{
  titles: string[],
  colors?: string[],
  class?: string,
}>()

// Выбранные элементы.
const checkedValue = defineModel<number[]>()

/**
 * Возвращает наименование класса, если был передан массив props.colors.
 */
function getLabelColorClass(index: number): string | boolean {
  return (props.colors) ? `color_${props.colors[index]}` : false
}
</script>

<template>
  <div class="group" :class="props.class">
    <label
      v-for="(title, index) in props.titles"
      :key="index"
      class="group__label"
      :class="getLabelColorClass(index)"
    >
      <input type="checkbox" class="group__input" :value="index" v-model="checkedValue">
      <span class="group__text">{{ title }}</span>
    </label>
  </div>
</template>

<style scoped></style>
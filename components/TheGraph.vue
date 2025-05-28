<script setup lang="ts">
import type { GraphPoint } from '@/types/graphPoint'

const props = defineProps<{
  graphs: Array<{
    title: string,
    points: Array<GraphPoint>,
  }>
}>()

// Возможные цвета.
const chartColors: string[] = [ 'red', 'blue', 'green' ]
// Графики, выбранные для отображения.
const checkedCharts = ref([0])
provide('checkedCharts', checkedCharts.value)
// Количество графиков для отображения.
const chartsCount = computed<number>(() => {
  const colorsLength = chartColors.length
  const chartsLength = props.graphs.length

  let returnCount = 0

  if (chartsLength > colorsLength) {
    console.error(`Количество грфиков для отображения (${chartsLength}) больше, чем определено цветов в переменной chartColors (${colorsLength}). Будут отображены не все графики.`)
    returnCount = colorsLength
  } else {
    returnCount = chartsLength
  }

  return returnCount
})

/**
 * Проверка переданных данных.
 */
const availableData = computed(() => {
  if (props.graphs.length > 0) {
    return {
      titles: props.graphs.slice(0, chartsCount.value).map((item) => item.title),
      points: props.graphs.slice(0, chartsCount.value).map((item) => item.points),
    }
  } else {
    console.error('Не переданы данные для отрисовки графиков (пустой массив <graphs>).')
    return false
  }
})
</script>

<template>
  <div class="graph">
    <template v-if="availableData">
      <CheckboxGroup
        :titles="availableData.titles"
        :colors="chartColors"
        v-model="checkedCharts"
      />
      <CanvasSVG v-if="checkedCharts.length"
      :points="availableData.points"
      :colors="chartColors"
      :showCharts="checkedCharts"
      />
      <div class="graph__error" v-else>Выберите график для отображения.</div>
    </template>
    <div class="graph__error" v-else>Нет данных для отображения.</div>
  </div>
</template>

<style scoped>
.graph {

  &__error {
    padding: var(--indent-double) 0;
  }
}
</style>
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
    /**
     * Сумма длин массивов Points для каждого графика.
     * Если 0 - не переданы точки для отрисовки графиков.
     */
    const lengthSum = props.graphs.reduce((currentSum, item) => currentSum + item.points.length, 0)

    if (lengthSum) {
      return {
        titles: props.graphs.slice(0, chartsCount.value).map((item) => item.title),
        points: props.graphs.slice(0, chartsCount.value).map((item) => item.points),
      }
    } else {
      console.error('Не переданы данные для отрисовки графиков (пустой(ые) массив(ы) <points>).')
      return false
    }
  } else {
    console.error('Передан пустой массив <graphs>.')
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
      <div class="graph__message" v-else>Выберите график для отображения.</div>
    </template>
    <div class="graph__message" v-else>Нет данных для отображения.</div>
  </div>
</template>

<style scoped>
.graph {

  &__message {
    padding: var(--indent-double) 0;
  }
}
</style>
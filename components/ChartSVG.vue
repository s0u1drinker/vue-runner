<script setup lang="ts">
import type { GraphPoint } from '@/types/graphPoint'

const circleRadius = 3

const props = defineProps<{
  points: GraphPoint[],
  chartWidth: number,
  chartHeight: number,
  startX: number,
  startY: number,
  color: string,
  showBackground?: boolean,
  serialNumber: number
}>()

const idGradient = computed<string>(() => {
  return `${props.color}Gradient`
})
/**
 * Максимальное значение по Y.
 */
const maxPointY = computed<number>(() => {
  return Math.max.apply(null, props.points.map(item => item.y))
})

const coordinates = computed(() => {
  const arrayPoints: Array<{ x: number, y: number }> = []
  // Значение для элемента polyline.
  let linePoints: string = ''
  // Значение для элемента polygon.
  let polygonPoints: string = ''

  if (props.chartWidth > 0) {
    // Максимальная разность между максимальным значением по Y и элементом массива с точками.
    const maxDifference = Math.max.apply(null, props.points.map(item => maxPointY.value - item.y))
    // Коэффициент увеличения графика.
    // Так как некоторые значения изменяются на каждом круге не сильно - на графике всё сливается в прямую линию.
    // Чтобы было видно изменения, применяется этот коэффициент.
    const zoomY: number = maxDifference > 15 ? 1 : 5
    // Дополнительнный отступ сверху для графика.
    // Необходимо, чтобы корректно отобразить значение.
    const offsetY: number = 10
    // Расстояние между двумя точками по оси X.
    const distanceBetweenPoints: number = Math.trunc(props.chartWidth / (props.points.length - 1))

    let positionX: number = props.startX
    let positionY: number = props.startY

    for (let i=0; i<props.points.length; i++) {
      // Вычисление значения по оси Y: отступ на графике + дополнительный отступ + разность между максимальным и текущим значением * коэффициент увеличения графика.
      positionY = (props.startY - props.chartHeight) + offsetY + (maxPointY.value - props.points[i].y) * zoomY
      linePoints += ` ${positionX},${positionY}`
      arrayPoints.push({ x: positionX, y: positionY })
      positionX += distanceBetweenPoints
    }

    polygonPoints = `${props.startX},${props.startY} ${linePoints} ${positionX - distanceBetweenPoints},${props.startY}`
  }

  return {
    polyline: linePoints,
    polygon: polygonPoints,
    arr: arrayPoints
  }
})
</script>

<template>
  <g :class="`chart chart_${props.color}`">
    <polygon stroke="none" :fill="`url(#${idGradient})`" :points="coordinates.polygon" v-show="props.showBackground" />
    <polyline :stroke="props.color" stroke-width="2px" fill="none" :points="coordinates.polyline" />

    <g class="chart__point-group" v-for="(point, index) in coordinates.arr" :key="`${point.x}-${point.y}`">
      <g class="chart__point-data">
        <circle :r="circleRadius" :cx="point.x" :cy="point.y" :fill="color" />
        <line class="chart__point-line" stroke-width="1" :x1="point.x" :y1="props.startY + 2" :x2="point.x" :y2="point.y - circleRadius" />
        <text text-anchor="middle" font-size="12" :x="point.x" :y="point.y - 8">{{ points[index].titleY }}</text>
        <text text-anchor="middle" font-size="11" :x="point.x" :y="props.startY + 14">{{ points[index].titleX }}</text>
      </g>
      <rect class="chart__point-area" :x="point.x - 5" :y="point.y - 5" width="10" :height="props.startY - point.y + 5" fill="transparent" />
    </g>

    <linearGradient :id="idGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" :stop-color="`var(--light-${props.color})`"/>
      <stop offset="100%" stop-color="white"/>
    </linearGradient>
  </g>
</template>

<style scoped>
.chart {

  &__point {

    &-data {
      opacity: 0;
      transition: opacity var(--animation);
      pointer-events: none;

      &:has(+ .chart__point-area:hover) {
        opacity: 1;
      }
    }

    &-line {
      stroke: var(--gray);
      stroke-width: 1;
    }
  }
}
</style>
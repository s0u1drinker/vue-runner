<script setup lang="ts">
import type { GraphPoint } from '@/types/graphPoint'

const canvas = useTemplateRef('canvas')
// Высота холста с графиком.
const canvasHeight: number = 200
// Отступ.
const indent: number = 15
/**
 * Ширина холста с графиком. Зависит от размера экрана пользователя.
 */
const canvasWidth = computed<number>(() => {
  return canvas.value?.clientWidth ?? 0
})
/**
 * Начало координат по оси Y.
 */
const startPositionY = computed<number>(() => {
  return canvasHeight - indent
})

const props = defineProps<{
  points: GraphPoint[][],
  colors: string[],
  showCharts?: number[]
}>()

onMounted(() => {
  window.addEventListener('resize', (event) => { console.log(event) })
})
</script>

<template>
  <svg class="canvas" ref="canvas" :height="canvasHeight" :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`">
    <ChartSVG
      v-for="(chartPoints, index) in props.points"
      :key="index"
      :points="chartPoints"
      :chartWidth="canvasWidth - indent * 2"
      :chartHeight="canvasHeight - indent * 2"
      :startX="indent"
      :startY="startPositionY"
      :color="props.colors[index]"
      :showBackground="props.showCharts && props.showCharts.length === 1"
      :serialNumber="index"
      v-show="props.showCharts?.includes(index)"
    />

    <line class="canvas__axis canvas__axis_x" x1="0" :y1="startPositionY" x2="100%" :y2="startPositionY" />
  </svg>
</template>

<style scoped>
.canvas {
  max-width: 500px;
  width: 100%;

  &__axis {
    stroke: var(--gray);
    stroke-width: 1;
  }
}
</style>
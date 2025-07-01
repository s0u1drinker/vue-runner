<script setup lang="ts">
import type { GoalYear } from '@/types/goalYear'

const { rows } = defineProps<{
  rows: GoalYear[],
}>()
</script>

<template>
  <TheTable>
    <template #thead>
      <tr>
        <th>Год</th>
        <th>Цель</th>
        <th class="extra-column">Количество тренировок</th>
        <th>Результат</th>
        <th class="extra-column">Средняя дистанция</th>
        <th class="extra-column">Процент выполнения плана</th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(row, index) in rows" :key="row.year">
        <td>{{ row.year }}</td>
        <td>{{ `${row.goalDistance} км` }}</td>
        <td class="extra-column">{{ row.workoutCounter }}</td>
        <td :class="{ 'color_red': row.goalDistance > row.completedDistance }">{{ `${row.completedDistance} км` }}</td>
        <td class="extra-column">{{ `${getAverage(row.completedDistance, row.workoutCounter, 2)} км` }}</td>
        <td class="extra-column">{{ getPercent(row.completedDistance, row.goalDistance, 2) }}</td>
      </tr>
    </template>
  </TheTable>
</template>

<style scoped></style>
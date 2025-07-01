<script setup lang="ts">
import type { GoalMonth } from '@/types/goalMonth'

const { rows } = defineProps<{
  rows: GoalMonth[],
}>()
</script>

<template>
  <TheTable>
    <template #thead>
      <tr>
        <th>Год</th>
        <th>Месяц</th>
        <th>Цель</th>
        <th class="extra-column">Количество тренировок</th>
        <th>Результат</th>
        <th class="extra-column">Средняя дистанция</th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(row, index) in rows" :key="row.month">
        <td>{{ row.year }}</td>
        <td>{{ MONTHS[row.month] }}</td>
        <td>{{ `${row.goalDistance} км` }}</td>
        <td class="extra-column">{{ row.workoutCounter }}</td>
        <td :class="{ 'color_red': row.goalDistance > row.completedDistance }">{{ `${row.completedDistance} км` }}</td>
        <td class="extra-column">{{ `${getAverage(row.completedDistance, row.workoutCounter, 2)} км` }}</td>
      </tr>
    </template>
  </TheTable>
</template>

<style scoped></style>
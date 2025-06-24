<script setup lang="ts">
import type { WeekData } from '@/types/weekData'

const { rows } = defineProps<{
  rows: WeekData[],
}>()
</script>

<template>
  <TheTable>
    <template #thead>
      <tr>
        <th>Год</th>
        <th>Номер недели</th>
        <th class="extra-column">Период</th>
        <th>Цель</th>
        <th class="extra-column">Количество тренировок</th>
        <th>Результат</th>
        <th class="extra-column">Средняя дистанция</th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(row, index) in rows" :key="row.year">
        <td>{{ row.year }}</td>
        <td>{{ `#${row.weekNumber}` }}</td>
        <td class="extra-column">{{ `${prettyDate(row.dateStart).date} - ${prettyDate(row.dateEnd).date}` }}</td>
        <td>{{ `${row.goalDistance} км` }}</td>
        <td class="extra-column">{{ row.workoutCounter }}</td>
        <td :class="{ 'color_red': row.goalDistance > row.completedDistance }">{{ `${row.completedDistance} км` }}</td>
        <td class="extra-column">{{ `${getAverage(row.completedDistance, row.workoutCounter, 2)} км` }}</td>
      </tr>
    </template>
  </TheTable>
</template>

<style scoped></style>
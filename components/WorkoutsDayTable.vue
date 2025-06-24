<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { TableTHead } from '@/types/tableThead'

const workoutStore = useWorkoutStore()

const { rows } = defineProps<{
  rows: Workout[],
}>()

// Шапка таблицы.
const thead: TableTHead[] = [
  { title: '', },
  { title: 'Дата', },
  { title: 'Дистанция', },
  { title: 'Время', },
  { title: 'Темп', extraColumn: true, },
  { title: 'Пульс', extraColumn: true, },
  { title: 'Температура', extraColumn: true, },
]
</script>

<template>
  <TheTable>
    <template #thead>
      <tr>
        <th
          :class="{ 'extra-column': th?.extraColumn }"
          v-for="(th, index) in thead"
          :key="`th-${index}`"
        >{{ th.title }}</th>
      </tr>
    </template>
    <template #tbody v-if="rows.length">
      <tr
        class="table__tr"
        v-for="(workout, index) in rows"
        :key="workout.id"
        @click="navigateTo(`/workout/${workout.id}`)"
        role="button"
        :tabindex="30 + index"
      >
        <td class="flex flex_ai-center flex_gap-half">
          <Icon :name="workoutStore.getActivityByID(workout.idActivity).icon" />
          <span class="show-lg show-lg_inline">{{ workoutStore.getActivityByID(workout.idActivity).title }}</span>
        </td>
        <td>{{ prettyDate(workout.dateStart).date }}</td>
        <td>{{ `${workout.distance} км` }}</td>
        <td>{{ workout.trainingTime }}</td>
        <td class="extra-column">{{ workout.averagePace || '-' }}</td>
        <td class="extra-column">{{ workout.heartrate }}</td>
        <td class="extra-column">{{ prettyTemperature(workout.temperature) }}</td>
      </tr>
    </template>
  </TheTable>
</template>

<style scoped></style>
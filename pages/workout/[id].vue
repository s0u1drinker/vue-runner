<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { Indicator } from '@/types/indicator'

const route = useRoute()
const workoutStore = useWorkoutStore()
// Идентификатор тренировки.
const idWorkout = route.params.id as string
// Данные о тренировке.
const workout = workoutStore.getWorkoutByID(idWorkout) as Workout
// Данные об активности, указанной в тренировке.
const activity = workoutStore.getActivityByID(workout.idActivity)
// Список индикаторов.
const workoutIndicators: Array<Indicator> = [
  {
    icon: (activity.icon && workoutStore.isValidActivityIcon(activity.icon)) ? activity.icon : '',
    title: activity.title,
    indicator: prettyDistance(workout.distance),
  },
  { title: 'Общее время', indicator: workout.trainingTime },
  { title: 'Темп', indicator: workout.averagePace },
  { title: 'Пульс', indicator: String(workout.heartrate) },
  { title: 'Каденс', indicator: String(workout.cadence) },
  { title: workout.weather.description, indicator: prettyTemperature(workout.weather.temperature) },
  { title: 'Вес до', indicator: `${workout.weightBefore} кг` },
  { title: 'Потеря веса', indicator: weightLoss(workout.weightBefore, workout.weightAfter) },
  { title: 'Круг', indicator: prettyLapDistance(workout.lapDistance) }
]

definePageMeta({
  middleware: ["route-workout"]
})
</script>

<template>
  <template v-if="workout">
    <h1>{{ `Тренировка ${prettyDate(workout.dateStart).date} в ${prettyDate(workout.dateStart).time}` }}</h1>
    <div class="workout">
      <div class="workout__indicators">
        <WorkoutBlocksWrapper :indicators="workoutIndicators" />
      </div>
      <div class="workout__charts">
        <TableLaps :laps="workout.laps" :lapDistance="workout.lapDistance" />
      </div>
      <div class="workout__stat">
        Какие-то графики...
      </div>
    </div>
  </template>
  <TemplateError errorCode="VV01" v-else />
</template>

<style scoped></style>
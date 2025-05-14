<script setup lang="ts">
import type { Workout } from '@/types/workout'
import TemplateError from '@/components/TemplateError.vue'
import WorkoutBlock from '@/components/WorkoutBlock.vue'
import TableLaps from '@/components/TableLaps.vue'

const route = useRoute()
const workoutStore = useWorkoutStore()
// Идентификатор тренировки.
const idWorkout = route.params.id as string
// Данные о тренировке.
const workout = workoutStore.getWorkoutByID(idWorkout) as Workout
// Данные об активности, указанной в тренировке.
const activity = workoutStore.getActivityByID(workout.idActivity)

definePageMeta({
  middleware: ["route-workout"]
})
</script>

<template>
  <template v-if="workout">
    <h1>{{ `Тренировка ${prettyDate(workout.dateStart).date} в ${prettyDate(workout.dateStart).time}` }}</h1>
    <div class="workout">
      <div class="workout__indicators">
        <WorkoutBlock
          :icon="(activity.icon && workoutStore.isValidActivityIcon(activity.icon)) ? activity.icon : ''"
          :title="activity.title"
          :indicator="prettyDistance(workout.distance)"
        />
        <WorkoutBlock title="Общее время" :indicator="workout.trainingTime" />
        <WorkoutBlock title="Темп" :indicator="workout.averagePace" />
        <WorkoutBlock title="Пульс" :indicator="String(workout.heartrate)" />
        <WorkoutBlock title="Каденс" :indicator="String(workout.cadence)" />
        <WorkoutBlock :title="workout.weather.description" :indicator="prettyTemperature(workout.weather.temperature)" />
        <WorkoutBlock title="Вес до" :indicator="`${workout.weightBefore} кг`" />
        <WorkoutBlock title="Потеря веса" :indicator="weightLoss(workout.weightBefore, workout.weightAfter)" />
        <WorkoutBlock title="Круг" :indicator="prettyLapDistance(workout.lapDistance)" />
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
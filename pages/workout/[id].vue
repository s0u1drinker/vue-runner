<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { Indicator } from '@/types/indicator'

const route = useRoute()
const workoutStore = useWorkoutStore()
const activityStore = useActivityStore()
const weatherStore = useWeatherStore()
const { deleteModal } = useModalStore()
// Идентификатор тренировки.
const idWorkout = route.params.id as string
// Данные о тренировке.
const workout = workoutStore.getWorkoutByID(idWorkout) as Workout
// Данные об активности, указанной в тренировке.
const activity = activityStore.getActivityByID(workout.idActivity)
// Данные о погоде, указанной в тренировке
const weather = weatherStore.getWeatherInfoByID(workout.idWeather)
// Список индикаторов.
const workoutIndicators: Array<Indicator> = [
  {
    icon: (activity.icon && activityStore.isValidActivityIcon(activity.icon)) ? activity.icon : '',
    title: activity.title,
    indicator: prettyDistance(workout.distance),
  },
  { title: 'Общее время', indicator: workout.trainingTime },
  {
    icon: weather?.icon || '',
    title: weather?.description || '',
    indicator: prettyTemperature(workout.temperature)
  },
  { title: 'Темп', indicator: workout.averagePace },
  { title: 'Пульс', indicator: String(workout.heartrate) },
  { title: 'Вес до', indicator: `${workout.weightBefore} кг` },
  { title: 'Потеря веса', indicator: weightLoss(workout.weightBefore, workout.weightAfter) },
  { title: 'Каденс', indicator: String(workout.cadence) },
  { title: 'Набор высоты', indicator: workout.climb ? `${workout.climb} м` : '' },
  { title: 'Круг', indicator: prettyLapDistance(workout.lapDistance) }
]

// Данные для графиков.
const graphs = computed(() => {
  return [{
    title: 'Пульс',
    points: workout.laps.map((lap) => {
      return {
        x: timeToSeconds(lap.totalTime),
        y: lap.heartRate,
        titleX: String(lap.totalTime),
        titleY: String(lap.heartRate),
      }
    })
  },
  {
    title: 'Темп',
    points: workout.laps.map((lap) => {
      return {
        x: timeToSeconds(lap.totalTime),
        y: -timeToSeconds(lap.pace),
        titleX: String(lap.totalTime),
        titleY: String(lap.pace),
      }
    })
  }]
})

definePageMeta({
  middleware: ["route-workout"]
})

onMounted(() => {
  const idModal = route.query.idModal
  // Если передан идентификатор модального окна - удаляем это окно (ModalLoader после добавления нового значения).
  if (idModal) deleteModal(idModal as string)
})
</script>

<template>
  <template v-if="workout">
    <h1>{{ `Тренировка ${prettyDate(workout.dateStart).date} в ${prettyDate(workout.dateStart).time}` }}</h1>
    <div class="workout">
      <div class="workout__comment">{{ workout.comment }}</div>
      <div class="workout__indicators">
        <WorkoutIndicators :indicators="workoutIndicators" />
      </div>
      <TableLaps :laps="workout.laps" :lapDistance="workout.lapDistance" />
      <div class="workout__graph">
        <h2>Графическое представление</h2>
        <TheGraph :graphs />
      </div>
    </div>
  </template>
  <TemplateError errorCode="VV01" v-else />
</template>

<style scoped>
.workout {
  display: flex;
  gap: var(--indent-double);
  flex-direction: column;
  margin-top: var(--indent);

  &__comment {
    font-style: italic;
  }

  &__indicators {
    display: flex;
    flex-wrap: wrap;
    gap: var(--indent);
  }

  &__graph {
    display: flex;
    flex-direction: column;
    gap: var(--indent);
  }
}
</style>
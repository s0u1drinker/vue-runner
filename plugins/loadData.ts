import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const appStore = useAppStore()
  const workoutStore = useWorkoutStore()
  const activityStore = useActivityStore()
  const weatherStore = useWeatherStore()
  const goalStore = useGoalStore()

  // Поднимаем флаг загрузки данных.
  appStore.setLoadingDataFlag(true)

  await Promise.all([
    workoutStore.updateWorkoutsFromDB(),
    activityStore.updateActivitiesFromDB(),
    weatherStore.updateWeatherFromDB(),
    goalStore.updateGoalsFromDB()
  ])
  .catch((error) => {
    console.error(`Ошибка при загрузке данных: ${error}`)
    // Поднимаем флаг ошибки.
    appStore.setErrorFlag(APP_ERRORS.get('SU01') as string)
  })
  .finally(() => {
    // Снимаем флаг загрузки данных.
    appStore.setLoadingDataFlag(false)
  })
})
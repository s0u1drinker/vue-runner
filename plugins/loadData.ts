import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
  const appStore = useAppStore()
  const workoutStore = useWorkoutStore()
  const activityStore = useActivityStore()
  const weatherStore = useWeatherStore()
  const goalStore = useGoalStore()
  const achievementStore = useAchievementStore()
  const statistic = useStatisticStore()
  const badges = useBadgeStore()

  // Поднимаем флаг загрузки данных.
  appStore.setLoadingDataFlag(true)

  await Promise.all([
    workoutStore.updateWorkoutsFromDB(),
    activityStore.updateActivitiesFromDB(),
    weatherStore.updateWeatherFromDB(),
    goalStore.updateGoalsFromDB(),
    achievementStore.updateAchievementsFromDB(),
    statistic.updateTotalStatisticFromDB(),
    badges.updateBadgeCommentsFromDB(),
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
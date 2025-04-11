const workoutStore = useWorkoutStore()

export default defineNuxtRouteMiddleware((to, from) => {
  // Если в хранилище нет данных о тренировке с таким идентификатором.
  if (!workoutStore.getWorkoutByID(to.params.id as string)) {
    // Перенаправляем на страницу /workout.
    return navigateTo('/workout')
  }
})
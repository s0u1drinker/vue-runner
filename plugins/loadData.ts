import { defineNuxtPlugin } from '#app'
import { useWorkoutStore } from '@/stores/workoutStore'

export default defineNuxtPlugin(() => {
  const workoutStore = useWorkoutStore();

  try {
    // Поднимаем флаг загрузки данных.
    workoutStore.setLoadingDataFlag(true)
    // Обновляем данные в хранилище.
    workoutStore.updateDataInStoreFromDB()
  } catch (error) {
    // Поднимаем флаг ошибки.
    workoutStore.setErrorFlag(`Ошибка при загрузке данных: ${error}`)
  } finally {
    // Снимаем флаг загрузки данных.
    workoutStore.setLoadingDataFlag(false)
  }
});
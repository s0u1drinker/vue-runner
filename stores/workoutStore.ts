import { defineStore } from 'pinia'
import type { Workout } from '@/types/workout'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [] as Workout[],
    isLoadingData: false,
  }),
  getters: {},
  actions: {
    /**
     * Обновление данных о тренировках в хранилище из БД.
     * @param newWorkoutData Данные о тренировках из БД.
     */
    updateWorkoutInStore(newWorkoutData: Workout[]) {
      this.workouts = newWorkoutData
    },
    /**
     * Меняет значение флага загрузки данных.
     * @param newValue Новое значение флага.
     */
    setLoadingDataFlag(newValue: boolean) {
      this.isLoadingData = newValue
    }
  }
})
import { defineStore } from 'pinia'
import { useFirestore } from 'vuefire'
import { doc, updateDoc } from 'firebase/firestore'
import { getDataFromDB } from './utils/dataFromDB'
import type { Workout } from '@/types/workout'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [] as Workout[],
  }),
  getters: {
    /**
     * Возвращает информацию о тренировке по идентификатору.
     * @param idWorkout Идентификатор трениовки. 
     * @returns Информация о тренировке или undefined.
     */
    getWorkoutByID: (state) => {
      return (idWorkout: string): Workout | undefined => {
        return state.workouts.find((workout) => workout.id === idWorkout)
      }
    },
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateWorkoutsFromDB(): Promise<void> {
      this.workouts = await getDataFromDB<Workout>('workout')
    },
    /**
     * Обновление в БД информации о тренировке.
     * @param idWorkout Идентификатор тренировки.
     * @param workout Данные о тренировке.
     * @returns Результат обновления (true/false).
     */
    async updateWorkoutInDB(idWorkout: string, workout: Workout): Promise<boolean> {
      let updateResult = false

      try {
        if (typeof idWorkout === 'string' && idWorkout.length > 0) {
          if (workout && typeof workout === 'object' && Object.keys(workout).length !== 0) {
            const docRef = doc(useFirestore(), 'workout', idWorkout)

            await updateDoc(docRef, workout)
            updateResult = true
          } else {
            console.error(`Отсутствуют данные о тренировке: ${workout}.`)
          }
        } else {
          console.error(`Неверный тип идентификатора тренировки: ${idWorkout}. Ожидалась строка.`)
        }
      } catch (err) {
        console.error(`Произошла ошибка при обновлении данных в БД: ${err}`)
      }

      return updateResult
    }
  }
})
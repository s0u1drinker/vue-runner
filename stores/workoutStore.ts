import { defineStore } from 'pinia'
import { useFirestore } from 'vuefire'
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { getDataFromDB } from './utils/dataFromDB'
import type { Workout } from '@/types/workout'

type AddWorkoutResult = {
  result: boolean,
  idWorkout: string
}

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
    /**
     * Возвращает идентификатор тренировки за указанную дату или null, если такой нет.
     * @param dateToCheck Дата в виде строки.
     * @returns Идентификатор/null.
     */
    getWorkoutForTheDay: (state) => {
      return (dateToCheck: string): string | null => {
        const workoutOnDate: Workout | undefined = state.workouts.find((workout) => isTwoDateAreTheSame(dateToCheck, workout.dateStart))

        return workoutOnDate?.id ?? null
      }
    },
    /**
     * Возвращает массив тренировок за указанный период.
     * @param period Объект со свойствами: year, month?, week?.
     * @returns Массив тренировок.
     */
    getWorkoutsForThePeriod: (state) => {
      return (period: { year: number, month?: number, week?: number }): Workout[] => {
        if (typeof period.year === 'number' && period.year > 0) {
          if (period.week) {
            if (typeof period.week === 'number' && period.week > 0) {
              // Получаем даты начала и окончания.
              const { dateStart, dateEnd } = getWeekDatesByWeekNumber(period.year, period.week)
              // Переводим в милисекунды.
              const dateStartTime = new Date(dateStart).getTime()
              const dateEndTime = new Date(dateEnd).getTime()
              
              return state.workouts.filter((item) => {
                const itemTime = new Date(item.dateStart).getTime()
                // Возвращаем даты в диапазоне.
                return ((dateStartTime < itemTime) && (itemTime < dateEndTime))
              })
            } else console.error(`Неверное значение недели: ${period.week}`)
          } else if (period.month) {
            if (typeof period.month === 'number' && period.month > 0) {
              // Фильтруем по подстроке "ГГГГ-ММ".
              return state.workouts.filter((item) => item.dateStart.includes(`${period.year}-${prettyNumberForDateAndTime(period.month!)}`))
            } else console.error(`Неверное значение месяца: ${period.month}`)
          } else {
            // Фильтруем по подстроке "ГГГГ".
            return state.workouts.filter((item) => item.dateStart.includes(`${period.year}`))
          }
        } else console.error(`Неверное значение года: ${period.year}`)

        return []
      }
    }
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
            const workoutIndex = this.workouts.findIndex((workout) => workout.id === idWorkout)
            const { id, ...workoutData } = workout

            await updateDoc(docRef, workoutData)
            this.workouts[workoutIndex] = { id: idWorkout, ...workoutData }
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
    },
    /**
     * Добавление данных о новой тренировке в БД.
     * @param workout Данные о тренировке.
     * @returns Результат добавления.
     */
    async addWorkoutInDB(workout: Workout): Promise<AddWorkoutResult> {
      const goalStore = useGoalStore()
      const collectionRef = collection(useFirestore(), 'workout')
      const { id, ...workoutData } = workout
      let addResult: AddWorkoutResult = {
        result: false,
        idWorkout: '',
      }

      await addDoc(collectionRef, workoutData)
      .then((docRef) => {
        workout.id = docRef.id
        // Добавляем в хранилище.
        this.workouts.push(workout)
        // Обновляем дистанцию у целей.
        goalStore.changeDistanceForGoals(prettyDate(workout.dateStart).date, workout.distance)
        // Завершаем выполнение.
        addResult.result = true
        addResult.idWorkout = docRef.id
      })
      .catch((err) => {
        console.error(`Произошла ошибка при добавлении данных в БД: ${err}`)
      })

      return addResult
    }
  }
})
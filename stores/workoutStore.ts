import { defineStore } from 'pinia'
import { useFirestore, useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import type { Workout } from '@/types/workout'
import type { Activity } from '@/types/activity'
import type { ErrorData } from '@/types/errorData'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [] as Workout[],
    activities: [] as Activity[],
    /**
     * Флаг загрузки данных.
     */
    isLoadingData: false as Boolean,
    /**
     * Данные об ошибке.
     */
    error: {
      flag: false,
      text: ''
    } as ErrorData
  }),
  getters: {
    /**
     * Возвращает наименование активности по идентификатору.
     * В случае ошибки возвращает пустую строку и выводит в консоль её описание.
     * @param idActivity Идентификатор активности.
     * @returns Наименование активности или, в случае ошибки, пустая строка.
     */
    getActivityTitleByID: (state) => {
      return (idActivity :string): string => {
        const activity: Activity | undefined = state.activities.find((activity) => activity.id === idActivity)

        if (activity) {
          if ('title' in activity) {
            return activity.title
          } else {
            console.error(`Отсутствует свойство <title> у типа активности с идентификатором '${idActivity}'.`)
            return ''
          }
        } else {
          console.error(`Не найден тип активности по идентификатору '${idActivity}'.`)
          return ''
        }
      }
    },
    /**
     * Возвращает информацию о тренировке по идентификатору.
     * @param idWorkout Идентификатор трениовки. 
     * @returns Информация о тренировке или false.
     */
    getWorkoutByID: (state) => {
      return (idWorkout: string): Workout | Boolean => {
        return state.workouts.find((workout) => workout.id === idWorkout) || false
      }
    }
  },
  actions: {
    /**
     * Меняет значение флага загрузки данных.
     * @param newValue Новое значение флага.
     */
    setLoadingDataFlag(newValue: boolean) {
      this.isLoadingData = newValue
    },
    /**
     * Обновляет данные об ошибке. Если передана пустая строка - флаг опускается.
     * @param text Текст ошибки.
     */
    setErrorFlag(text: string) {
      if (text) {
        this.error.flag = true
        this.error.text = text
      } else {
        this.error.flag = false
        this.error.text = ''
      }
    },
    // Обновление данных о тренировках из БД.
    updateWorkoutsFromDB() {
      // Загружаем данные из Firestore.
      const workoutsRef = useCollection(collection(useFirestore(), 'workout'));
      // Если получен пустой массив, то выбрасывается ошибка. Здесь всегда должны приходить данные.
      if (!workoutsRef.value.length) {
        this.setErrorFlag('Что-то пошло не так. Обновите, пожалуйста, страницу.')
        console.error('Получен пустой массив <workout>.')
      } else {
        // Извлекаем данные, попутно добавляя идентификатор документа.
        this.workouts = workoutsRef.value.map((doc) => ({ id: doc.id, ...doc })) as Workout[];
      }
    },
    /**
     * Обновление списка активностей из БД.
     * В случае, если будет получен пустой массив с данными,
     * произойдёт рекурсивный вызов функции с флагом повторного запуска.
     * Если и второй раз будет получен пустой массив, значит требуется вмешательство техножрецов.
     * @param isRestart Флаг повторного запуска.
     */
    updateActivitiesFromDB(isRestart: boolean = false) {
      // Загружаем данные из Firestore.
      const activitiesRef = useCollection(collection(useFirestore(), 'activities'));
      // Если получен пустой массив, то выбрасывается ошибка. Здесь всегда должны приходить данные.
      if (!activitiesRef.value.length) {
        // Проверяем флаг повторного запуска.
        if (isRestart) {
          // Если установлен - выводим сообщение об ошибке.
          this.setErrorFlag('Что-то пошло не так. Обновите, пожалуйста, страницу.')
          console.error('Получен пустой массив <activities>.')
        } else {
          // Если нет - перезапускаем функцию с флагом.
          this.updateActivitiesFromDB(true)
        }
      } else {
        // Извлекаем данные, попутно добавляя идентификатор документа.
        this.activities = activitiesRef.value.map((doc) => ({ id: doc.id, ...doc })) as Activity[];
      }
    },
  }
})
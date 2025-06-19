import { defineStore } from 'pinia'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, updateDoc } from 'firebase/firestore'
import type { Workout } from '@/types/workout'
import type { Activity } from '@/types/activity'
import type { ErrorData } from '@/types/errorData'
import type { Weather } from '@/types/weather'
import type { WeekData } from '@/types/weekData'
import type { MonthData } from '@/types/monthData'
import type { YearData } from '@/types/yearData'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [] as Workout[],
    activities: [] as Activity[],
    weather: [] as Weather[],
    statistic: {
      weeks: [] as WeekData[],
      months: [] as MonthData[],
      years: [] as YearData[],
    },
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
     * Возвращает Информацию об активности по идентификатору.
     * @param idActivity Идентификатор активности.
     * @returns Наименование активности или, в случае ошибки, пустая строка.
     */
    getActivityByID: (state) => {
      return (idActivity: string): Activity => {
        let activityData = state.activities.find((activity) => activity.id === idActivity)

        if (typeof activityData !== 'undefined') {
          // Проверяем наличие наименования активности.
          if (activityData.hasOwnProperty('title')) {
            if (!activityData.title) {
              console.error(`Не указано наименование активности с идентификатором ${idActivity}`)
            }
          } else {
            activityData.title = ''
            console.error(`Отсутствует свойство <title> у активности с идентификатором ${idActivity}`)
          }
          // Проверяем наличие информации об иконке.
          if (activityData.hasOwnProperty('icon')) {
            if (!activityData.icon) {
              console.error(`Не указана иконка активности с идентификатором ${idActivity}`)
            }
          } else {
            activityData.icon = ''
            console.error(`Отсутствует свойство <icon> у активности с идентификатором ${idActivity}`)
          }
        } else {
          console.error(`Не найдена активность с идентификатором ${idActivity}`)
          activityData = {
            id: '',
            title: '',
            icon: '',
          }
        }

        return activityData
      }
    },
    /**
     * Информация о погоде по идентификатору.
     * @param idWeather Идентификатор объекта с описанием погоды.
     * @returns Данные о погоде.
     */
    getWeatherInfoByID: (state) => {
      return (idWeather: string): Weather | undefined => {
        if (idWeather && typeof idWeather === 'string') {
          const findResult = state.weather.find((item) => item.id === idWeather)

          if (typeof findResult !== 'undefined') {
            return findResult
          } else console.error(`Не найдена информация о погоде с идентификатором: ${idWeather}`)
        } else console.error(`Неверный идентификатор: ${idWeather}. Ожидалась строка.`)

        return undefined
      }
    },
    /**
     * Проверяет наличие иконки в массиве активностей.
     * @param iconName Наименование иконки.
     * @returns False - такой иконки нет ни у одной из активностей / True - можно использовать.
     */
    isValidActivityIcon: (state) => {
      return (iconName: string): Boolean => {
        return state.activities.some((activity) => activity.icon === iconName)
      }
    },
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
     * Данные о тренировках за указанную неделю.
     * @param weekNumber Номер недели.
     * @param year Год.
     * @returns Статистика за указанную неделю или undefined.
     */
    getWeekStatisticByWeekNumber: (state) => {
      return (year: number, weekNumber: number): WeekData | undefined => {
        return state.statistic.weeks.find((weekData) => (weekData.year === year && weekData.weekNumber === weekNumber))
      }
    },
    /**
     * Данные о тренировках за указанный месяц.
     * @param month Месяц.
     * @param year Год.
     * @returns Статистика за указанный месяц или undefined.
     */
    getMonthStatisticByMonth: (state) => {
      return (year: number, month: number): MonthData | undefined => {
        return state.statistic.months.find((monthData) => (monthData.year === year && monthData.month === month))
      }
    },
    /**
     * Данные о тренировках за указанный год.
     * @param year Год.
     * @returns Статистика за указанный год или undefined.
     */
    getYearStatistic: (state) => {
      return (year: number): YearData | undefined => {
        return state.statistic.years.find((yearData) => yearData.year === year)
      }
    },
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
    /**
     * Обновление данных в хранилище.
     */
    updateDataInStoreFromDB(): void {
      // Тренировки.
      this.workouts = this.getDataFromDB<Workout>('workout')
      // Активности.
      this.activities = this.getDataFromDB<Activity>('activities')
      // Погода.
      this.weather = this.getDataFromDB<Weather>('weatherDescriptions')
      // Статистика за годы, месяцы, недели.
      this.statistic.weeks = this.getDataFromDB<WeekData>('weeksData').sort((a, b) => a.weekNumber - b.weekNumber)
      this.statistic.months = this.getDataFromDB<MonthData>('monthsData')
      this.statistic.years = this.getDataFromDB<YearData>('yearsData')
    },
    /**
     * Возвращает из БД данные по наименованию коллекции.
     * @param storeCollection Наименование коллекции.
     * @returns Данные из БД или пустой массив.
     */
    getDataFromDB<T>(storeCollection: string): T[] {
      // Загружаем данные из Firestore.
      const storeRef = useCollection(collection(useFirestore(), storeCollection))
      // Если получен пустой массив, то выбрасывается ошибка. Здесь всегда должны приходить данные.
      if (!storeRef.value.length) {
        this.setErrorFlag('Что-то пошло не так. Обновите, пожалуйста, страницу.')
        console.error(`Получен пустой массив <${storeCollection}>.`)
        return []
      } else {
        // Извлекаем данные, попутно добавляя идентификатор документа.
        return storeRef.value.map((doc) => ({ id: doc.id, ...doc })) as T[];
      }
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
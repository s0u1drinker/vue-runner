import { defineStore } from 'pinia'
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { getDataFromDB } from './utils/dataFromDB'
import type { GoalWeek } from '@/types/goalWeek'
import type { GoalMonth } from '@/types/goalMonth'
import type { GoalYear } from '@/types/goalYear'
import type { GoalCollections } from '@/types/goalCollections'

type GoalTypes = GoalYear | GoalMonth | GoalWeek
type CollectionType = keyof typeof collectionTitles

const collectionTitles: GoalCollections = {
  years: 'goalsForYears',
  months: 'goalsForMonths',
  weeks: 'goalsForWeeks',
} as const

export const useGoalStore = defineStore('goals', {
  state: () => ({
    goals: {
      weeks: [] as GoalWeek[],
      months: [] as GoalMonth[],
      years: [] as GoalYear[],
    },
  }),
  getters: {
    /**
     * Возвращает данные о цели на указанную неделю.
     * @param weekNumber Номер недели.
     * @param year Год.
     * @returns Цель на неделю или undefined.
     */
    getGoalForWeek: (state) => {
      return (year: number, weekNumber: number): GoalWeek | undefined => {
        return state.goals.weeks.find((weekData) => (weekData.year === year && weekData.weekNumber === weekNumber))
      }
    },
    /**
     * Возвращает данные о цели на указанный месяц.
     * @param month Месяц.
     * @param year Год.
     * @returns Цель на месяц или undefined.
     */
    getGoalForMonth: (state) => {
      return (year: number, month: number): GoalMonth | undefined => {
        return state.goals.months.find((monthData) => (monthData.year === year && monthData.month === month))
      }
    },
    /**
     * Возвращает данные о цели на указанный год.
     * @param year Год.
     * @returns Цель на год или undefined.
     */
    getGoalForYear: (state) => {
      return (year: number): GoalYear | undefined => {
        return state.goals.years.find((yearData) => yearData.year === year)
      }
    },
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateGoalsFromDB(): Promise<void> {
      this.goals.years = await getDataFromDB<GoalYear>(collectionTitles.years, { field: 'year', direction: 'asc' })
      this.goals.months = await getDataFromDB<GoalMonth>(collectionTitles.months, { field: 'month', direction: 'asc' })
      this.goals.weeks = await getDataFromDB<GoalWeek>(collectionTitles.weeks, { field: 'weekNumber', direction: 'asc' })
    },
    /**
     * Добавляет новую цель в БД.
     * @param collectionType Тип коллекции: год (years), месяц (months), неделя (weeks).
     * @param goalData Данные о цели.
     * @returns Результат добавления.
     */
    async addGoal(collectionType: CollectionType, goalData: GoalTypes): Promise<boolean> {
      let result = false
      // Проверяем правильно ли передано имя коллекции (её наличие).
      if (this.goals[collectionType]) {
        // Проверяем количество элементов в объекте.
        if (Object.keys(goalData).length) {
          // Коллекция.
          const collectionRef = collection(useFirestore(), collectionTitles[collectionType])
          // Создаём новый объект без id для отправки в БД.
          const { id, ...dataToDb } = goalData
          // Пробуем обновить данные в БД.
          await addDoc(collectionRef, dataToDb)
          .then((docRef) => {
            goalData.id = docRef.id
            // Добавляем в хранилище с учётом типов.
            if (collectionType === 'years') this.goals.years.push(goalData as GoalYear)
            if (collectionType === 'months') this.goals.months.push(goalData as GoalMonth)
            if (collectionType === 'weeks') this.goals.weeks.push(goalData as GoalWeek)
            // Завершаем выполнение.
            result = true
          })
          .catch((error) => {
            // Ошибку поймал!
            console.error(`Ошибка при добавлении данных в БД: ${error}`)
          })
        } else console.error(`Переданы пустые данные: ${goalData}`)
      } else console.error(`Коллекции с наименованием <${collectionType}> не существует.`)

      return result
    },
    /**
     * Обновление данных о цели (дистанции) за определённый период.
     * @param collection Наименование коллекции: год (years), месяц (months), неделя (weeks).
     * @param goalData Изменённые данные.
     * @returns Результат выполнения (true/false) с выводом ошибки в консоль.
     */
    async updateGoal(collection: CollectionType, goalData: GoalTypes): Promise<boolean> {
      // Проверяем правильно ли передано имя коллекции (её наличие).
      if (this.goals[collection]) {
        const {id, ...dataToDB} = goalData
        // Проверяем идентификатор.
        if (id && typeof id === 'string') {
          // Вычисляем индекс записи, которую нужно обновить.
          const goalIndex = this.goals[collection].findIndex((item) => item.id === id)
          // Если элемент найден.
          if (goalIndex !== -1) {
            // Ссылка на документ для обновления.
            const docRef = doc(useFirestore(), collectionTitles[collection], id)
            // Обновляем данные в БД.
            try {
              await updateDoc(docRef, dataToDB)
              // Обновляем данные в хранилище.
              this.goals[collection][goalIndex] = { ...goalData }
              // Завершаем выполнение.
              return true
            } catch(error) {
              // Хм-м, ошибка...
              console.error(`Ошибка при обновлении данных в БД: ${error}`)
            }
          } else console.error(`Не найден элемент с идентификатором: ${id}`)
        } else console.error(`Неверный тип идентификатора/пустой идентификатор: ${id}`)
      } else console.error(`Коллекции с наименованием <${collection}> не существует.`)
      // Какая-то из проверок не пройдена =(
      return false
    },
    /**
     * Изменяет пройденную дистанцию у целей.
     * @param workoutData Дата тренировки в формате ДД.ММ.ГГГГ.
     * @param distance Дистанция.
     */
    async changeDistanceForGoals(workoutData: string, distance: number): Promise<void> {
      if (isValidDateString(workoutData)) {
        const [ day, month, year ] = workoutData.split('.').map(Number)
        const weekNumber = new Date(year, month - 1, day).getWeekNumber()
        const yearGoal = this.getGoalForYear(year)
        const monthGoal = this.getGoalForMonth(year, month)
        const weekGoal = this.getGoalForWeek(year, weekNumber)
        const plusDistance = (value: number) => value + distance
        const addYearData: GoalYear = {
          id: '',
          year,
          workoutCounter: 1,
          goalDistance: distance,
          completedDistance: distance,
        }
        // Обновление/добавление цели на год.
        if (yearGoal && typeof yearGoal.completedDistance !== 'undefined') {
          await this.updateGoal('years', {
            ...yearGoal,
            completedDistance: plusDistance(yearGoal.completedDistance),
          })
        } else {
          await this.addGoal('years', addYearData)
        }
        // Обновление/добавление цели на месяц.
        if (monthGoal && typeof monthGoal.completedDistance !== 'undefined') {
          await this.updateGoal('months', {
            ...monthGoal,
            completedDistance: plusDistance(monthGoal.completedDistance),
          })
        } else {
          await this.addGoal('months', {
            ...addYearData,
            month,
          })
        }
        // Обновление/добавление цели на неделю.
        if (weekGoal && typeof weekGoal.completedDistance !== 'undefined') {
          await this.updateGoal('weeks', {
            ...weekGoal,
            completedDistance: plusDistance(weekGoal.completedDistance),
          })
        } else {
          const { dateStart, dateEnd } = getWeekDatesByWeekNumber(year, weekNumber)

          await this.addGoal('weeks', {
            ...addYearData,
            weekNumber,
            dateEnd,
            dateStart,
          })
        }
      } else console.error(`Дата не соответствует формату ДД.ММ.ГГГГ: ${workoutData}`)
    },
  },
})
import { defineStore } from 'pinia'
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore'
import { getDataFromDB } from './utils/dataFromDB'
import type { GoalWeek } from '@/types/goalWeek'
import type { GoalMonth } from '@/types/goalMonth'
import type { GoalYear } from '@/types/goalYear'
import type { GoalCollections } from '@/types/goalCollections'

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
    async addGoalInDB(collectionType: CollectionType, goalData: GoalYear | GoalMonth | GoalWeek): Promise<boolean> {
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
            // Добавляем в хранилище с учётом типов (TS жутко ругается на запись this.goals[collectionType].push(goalData)).
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
     * @param idGoal Идентификатор записи.
     * @param newValue Новое значение.
     * @returns Результат выполнения (true/false) с выводом ошибки в консоль.
     */
    async updateGoalDistanceInDB(collection: CollectionType, idGoal: string, newValue: number): Promise<boolean> {
      // Проверяем правильно ли передано имя коллекции (её наличие).
      if (this.goals[collection]) {
        // Проверяем идентификатор.
        if (idGoal && typeof idGoal === 'string') {
          // Вычисляем индекс записи, которую нужно обновить.
          const goalIndex = this.goals[collection].findIndex((item) => item.id === idGoal)
          // Если элемент найден,
          if (goalIndex !== -1) {
            // преобразуем значение в число.
            const newValueNumber = Number(newValue)
            // Проверяем на NaN.
            if (!Number.isNaN(newValueNumber)) {
              // Ссылка на документ для обновления.
              const docRef = doc(useFirestore(), collectionTitles[collection], idGoal)
              // Обновляем данные в хранилище.
              this.goals[collection][goalIndex].goalDistance = newValueNumber
              // И в БД.
              try {
                await updateDoc(docRef, { goalDistance: newValueNumber })
                // Завершаем выполнение.
                return true
              } catch(error) {
                // Хм-м, ошибка...
                console.error(`Ошибка при обновлении данных в БД: ${error}`)
              }
            } else console.error(`Значение не является числом: ${newValueNumber}`)
          } else console.error(`Не найден элемент с идентификатором: ${idGoal}`)
        } else console.error(`Неверный тип идентификатора/пустой идентификатор: ${idGoal}`)
      } else console.error(`Коллекции с наименованием <${collection}> не существует.`)
      // Какая-то из проверок не пройдена =(
      return false
    }
  },
})
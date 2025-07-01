import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { GoalWeek } from '@/types/goalWeek'
import type { GoalMonth } from '@/types/goalMonth'
import type { GoalYear } from '@/types/goalYear'

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
      this.goals.years = await getDataFromDB<GoalYear>('goalsForYears', { field: 'year', direction: 'asc' })
      this.goals.months = await getDataFromDB<GoalMonth>('goalsForMonths', { field: 'month', direction: 'asc' })
      this.goals.weeks = await getDataFromDB<GoalWeek>('goalsForWeeks', { field: 'weekNumber', direction: 'asc' })
    }
  },
})
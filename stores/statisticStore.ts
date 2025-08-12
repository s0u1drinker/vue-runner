import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { TotalStatistic } from '@/types/totalStatistic'

export const useStatisticStore = defineStore('statistic', {
  state: () => ({
    total: {} as TotalStatistic,
  }),
  getters: {},
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateTotalStatisticFromDB(): Promise<void> {
      this.total = (await getDataFromDB<TotalStatistic>('totalStatistic'))[0]
    }
  },
})
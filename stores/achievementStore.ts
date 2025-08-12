import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Achievement } from '@/types/achievement'

export const useAchievementStore = defineStore('achievement', {
  state: () => ({
    achievements: [] as Achievement[],
  }),
  getters: {},
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateAchievementsFromDB(): Promise<void> {
      this.achievements = (await getDataFromDB<Achievement>('achievements')).sort((a, b) => a.order - b.order)
    }
  },
})
import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Badge } from '@/types/badge'

export const useBadgeStore = defineStore('badge', {
  state: () => ({
    badge: {
      comments: [] as Badge[]
    },
  }),
  getters: {
    /**
     * @param state Хранилище.
     * @returns Список меток для комментария.
     */
    getBadgeComments(state): Badge[] {
      return state.badge.comments
    }
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateBadgeCommentsFromDB(): Promise<void> {
      this.badge.comments = await getDataFromDB<Badge>('badgeComments')
    }
  },
})
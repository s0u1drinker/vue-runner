import { defineStore } from 'pinia'
import type { Notification } from '@/types/notification'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
  }),
  getters: {
    /**
     * Возвращает индекс по идентификатору.
     * @param id Идентификатор.
     * @returns Индекс или -1.
     */
    getNotificationIndexByID: (state) => {
      return (id: string): number => {
        return state.notifications.findIndex((item) => item.id === id)
      }
    },
  },
  actions: {
    /**
     * Добавляет информацию об уведомлении.
     * @param notificationData 
     */
    addNotification(notificationData: Omit<Notification, 'id'>) {
      const id: string = `${notificationData.type}-${String(Date.now()).substring(8)}`

      this.notifications.unshift({
        id,
        ...notificationData,
        idTimer: setTimeout(() => {
          this.deleteNotification(id)
        }, 5000)
      })
    },
    /**
     * Удаляет информацию об уведомлении.
     * @param id Идентификатор.
     */
    deleteNotification(id: string) {
      const index = this.getNotificationIndexByID(id)

      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    /**
     * Клик по кнопке "Закрыть" в уведомлении.
     * @param id Идентификатор.
     */
    closeNotification(id: string) {
      const index = this.getNotificationIndexByID(id)

      if (index !== -1) {
        const idTimer = this.notifications[index].idTimer

        if (idTimer) clearTimeout(idTimer)

        this.deleteNotification(id)
      }
    },
  },
})
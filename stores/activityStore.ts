import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Activity } from '@/types/activity'

export const useActivityStore = defineStore('activity', {
  state: () => ({
    activities: [] as Activity[],
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
     * Проверяет наличие иконки в массиве активностей.
     * @param iconName Наименование иконки.
     * @returns False - такой иконки нет ни у одной из активностей / True - можно использовать.
     */
    isValidActivityIcon: (state) => {
      return (iconName: string): Boolean => {
        return state.activities.some((activity) => activity.icon === iconName)
      }
    },
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateActivitiesFromDB(): Promise<void> {
      this.activities = await getDataFromDB<Activity>('activities')
    }
  },
})
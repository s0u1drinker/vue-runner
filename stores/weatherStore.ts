import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Weather } from '@/types/weather'
import type { SelectCustomOptions } from '@/types/selectCustomOptions'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    weather: [] as Weather[],
  }),
  getters: {
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
     * @returns Список погодных явлений для использования в компоненте <CustomSelect>.
     */
    getWeatherListForSelect(state): SelectCustomOptions[] {
      return state.weather.map((weather) => {
        return { value: weather.id, label: weather.description, icon: weather.icon }
      })
    },
    /**
     * Возвращает идентификатор погоды по описанию.
     * @param description Описание (Ясно, Дождь и т.д.)
     * @returns Идентификатор.
     */
    getWeatherIdByDescription(state) {
      return (description: string): string | undefined => {
        if (typeof description !== 'string') return undefined

        return state.weather.filter((item) => item.description.toLowerCase() === description.toLowerCase())[0]?.id
      }
    }
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateWeatherFromDB(): Promise<void> {
      this.weather = await getDataFromDB<Weather>('weatherDescriptions')
    }
  },
})
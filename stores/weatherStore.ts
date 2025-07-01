import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Weather } from '@/types/weather'

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
import type { WeatherByAPI } from '@/types/weatherByAPI'
/**
 * Запрос данных о погоде с сервера.
 * @returns функция для запроса.
 */
export function useWeather() {
  const fetchWeather = async (city?: string): Promise<WeatherByAPI> => {
    try {
      const data: WeatherByAPI = await $fetch<any>('/api/weather', { method: 'POST', body: { city } })

      return data
    } catch (error: any) {
      return {
        error: true,
        description: (error instanceof Error) ? error.message : error
      }
    }
  }

  return { fetchWeather }
}
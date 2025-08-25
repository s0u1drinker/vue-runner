import type { WeatherByAPI } from '@/types/weatherByAPI'

export default defineEventHandler(async (event): Promise<WeatherByAPI> => {
  const config = useRuntimeConfig()
  const url = config.public.weatherApiUrl
  const { city } = getQuery(event)
  const runningPlace = city ? `q=${city}` : 'lon=44.474296&lat=48.673309'

  let returnData: WeatherByAPI = {
    error: true,
    description: '',
  }

  try {
    const response = await fetch(`${url}?${runningPlace}&units=metric&lang=ru&appid=${config.weatherApiKey}`)
    const data = await response.json()

    if (data.cod !== 200) {
      throw `Код ответа <${data.cod}>: ${data?.message}`
    }

    if (typeof data?.main?.temp !== 'number') {
      throw `Не удалось получить значение температуры: <${data?.main?.temp}>`
    }

    if (typeof data?.weather[0]?.description !== 'string') {
      throw `Не удалось получить описание погоды: <${data?.weather[0]?.description}>`
    }

    returnData = {
      error: false,
      description: data.weather[0].description,
      temperature: Math.round(data.main.temp),
    }
  } catch (error: any) {
    returnData.description = (error instanceof Error) ? error.message : error
  }

  return returnData
})
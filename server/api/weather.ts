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
    const temperature = data?.main?.temp
    let description = data?.weather[0]?.description

    if (data.cod !== 200) {
      throw `Код ответа <${data.cod}>: ${data?.message}`
    }

    if (typeof temperature !== 'number') {
      throw `Не удалось получить значение температуры: <${temperature}>`
    }

    if (typeof description !== 'string') {
      throw `Не удалось получить описание погоды: <${description}>`
    }

    if (description.includes('дожд')) description = 'Дождь'

    returnData = {
      error: false,
      description: description,
      temperature: Math.round(temperature),
    }
  } catch (error: any) {
    returnData.description = (error instanceof Error) ? error.message : error
  }

  return returnData
})
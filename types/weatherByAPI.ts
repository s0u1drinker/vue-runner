type ApiResultError = {
  error: true,
  description: string,
}

type ApiResultSuccess = {
  error: false,
  temperature: number,
  description: string,
}

export type WeatherByAPI = ApiResultError | ApiResultSuccess
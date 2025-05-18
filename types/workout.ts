import type { Lap } from "./lap"

export type Workout = {
  id: string,
  cadence: number,
  averagePace: string,
  weightAfter: number,
  weightBefore: number,
  trainingTime: string,
  laps: Lap[],
  dateStart: string,
  distance: number,
  idActivity: string,
  heartrate: number,
  lapDistance: number,
  idWeather: string,
  temperature: number,
  comment: string,
}
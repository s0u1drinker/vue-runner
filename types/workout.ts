import type { Lap } from "./lap"
import type { Weather } from "./weather"

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
  weather: Weather,
  comment: string,
}
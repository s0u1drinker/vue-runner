import type { FilterWorkouts } from "./filterWorkouts"

export type FilterPeriod = FilterWorkouts & {
  data?: {
    year: string,
    month?: string,
    week?: string,
  }
}
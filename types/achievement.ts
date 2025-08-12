import type { AchievementRating } from "./achievementRating"

export type Achievement = {
  id: string,
  title: string,
  order: number,
  rating: AchievementRating[]
}
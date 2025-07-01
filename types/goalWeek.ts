import type { GoalYear } from "./goalYear";

export type GoalWeek = GoalYear & {
  weekNumber: number,
  dateEnd: string,
  dateStart: string,
}
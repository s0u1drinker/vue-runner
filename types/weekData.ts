import type { YearData } from "./yearData";

export type WeekData = YearData & {
  weekNumber: number,
  dateEnd: string,
  dateStart: string,
}
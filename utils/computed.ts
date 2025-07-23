import type { SelectOptions } from "@/types/selectOptions"

/**
 * Данные о текущем дне.
 */
export const TODAY_DATE = {
  DATE: new Date(),
  getFullYear() { return this.DATE.getFullYear() },
  getMonth() { return this.DATE.getMonth() + 1 },
  /**
   * @returns Номер недели.
   */
  getWeekNumber() { return this.DATE.getWeekNumber() },
  /**
   * @returns День месяца.
   */
  getDay() { return this.DATE.getDate() },
  /**
   * @returns Текстовый формат даты вида ДД.ММ.ГГГГ.
   */
  getDateString() { return this.DATE.toLocaleDateString() },
  /**
   * @returns Текстовый формат времени вида ЧЧ:ММ:СС
   */
  getTimeString() { return this.DATE.toLocaleTimeString() }
}
/**
 * Список для выпадающего меню <Год>.
 */
export const YEARS_FOR_SELECT: SelectOptions[] = (() => {
  const years: SelectOptions[] = []
  const currentYear = new Date().getFullYear()

  for (let i = 2023; i <= currentYear; i++) {
    years.push({ value: String(i), label: String(i) })
  }

  return years
})()
/**
 * Список для выпадающего меню <Месяц>.
 */
export const MONTHS_FOR_SELECT: SelectOptions[] = MONTHS.map((month, index): SelectOptions => {
  return { value: `${index}`, label: month }
}).slice(1)
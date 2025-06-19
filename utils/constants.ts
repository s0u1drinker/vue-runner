/**
 * Дни недели.
 */
export const DAYS_OF_WEEK: string[] = [ 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье' ]
/**
 * Месяцы.
 */
export const MONTHS: string[] = [ '', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ]
/**
 * Данные о текущем дне.
 */
export const TODAY_DATE = {
  DATE: new Date(),
  getFullYear() { return this.DATE.getFullYear() },
  getMonth() { return this.DATE.getMonth() + 1 },
  getWeekNumber() { return this.DATE.getWeekNumber() },
}
/**
 * Опции для Intl.DateTimeFormat.
 */
export const DATE_TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}
/**
 * Список возможных ошибок в приложении.
 */
export const APP_ERRORS: Map<string, string> = new Map([
  // VV - variable value - значение переменной
  [ 'VV01', 'Переменная <workout> не содержит данных, т.к. функция <getWorkoutByID> вернула <undefined>.']
])
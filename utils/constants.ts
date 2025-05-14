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
import type { DateFormat } from "@/types/dateFormat"

/**
 * Возвращает температуру со знаками +/- и °.
 * @param temperature Значение температуры.
 * @returns Температура вида: +8°, 0° или -3°.
 */
export function prettyTemperature(temperature: number): string {
  if(typeof temperature === 'number') {
    return (temperature > 0) ? `+${temperature}°` : `${temperature}°`
  } else {
    console.error(`Передано неверное значение температуры: '${temperature}'. Ожидалось число.`)
    return '-'
  }
}
/**
 * Преобразует переданную строку с датой в объект со свойствами: дата, время, день недели.
 * В случае ошибки заполняет свойства знаком "-" и выводит в консоль её причину.
 * @param dateString Дата события.
 * @returns Объект со свойствами: date, time, weekday.
 */
export function prettyDate(dateString: string): DateFormat {
  const errorResponse: DateFormat = { date: '-', time: '-', weekday: '-' }

  if(typeof dateString === 'string') {
    try {
      const newDate = new Date(dateString)
      const formatter = new Intl.DateTimeFormat('ru', DATE_TIME_FORMAT_OPTIONS).format(newDate).split(', ')

      return {
        date: formatter[1].slice(0, 10),
        time: formatter[2].slice(0, 5),
        weekday: formatter[0]
      }
    } catch (error) {
      console.error(`Не удалось преобразовать строку '${dateString}' в дату.`)
      return errorResponse
    }
  } else {
    console.error(`Передано неверное значение даты: '${dateString}'. Ожидалась строка.`)
    return errorResponse
  }
}
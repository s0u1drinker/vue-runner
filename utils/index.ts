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
/**
 * Возвращает дистанцию в красивом формате: добавляет в конце строки "км" и, при необходимости, дополняет нулями.
 * @param distance Дистанция.
 * @returns Дистанция вида: 12.00 км.
 */
export function prettyDistance(distance: number): string {
  let distanceString: string = '0'
  let distanceSplit: string[]

  if (distance !== 0) {
    if (Number.isInteger(distance)) {
      distanceString = `${distance}.00`
    } else {
      distanceSplit = String(distance).split('.')
      distanceSplit[1] = distanceSplit[1].padEnd(2, '0')
      distanceString = distanceSplit.join('.')
    }
  }

  return `${distanceString} км`
}
/**
 * Возвращает дистанцию одного круга в метрах/километрах.
 * @param lapDistance Длина круга.
 * @returns Длина круга вида: 800 м или 1.5 км
 */
export function prettyLapDistance(lapDistance: number): string {
  return (lapDistance >= 1000) ? `${lapDistance / 1000} км` : `${lapDistance} м`
}
/**
 * Индикатор потери веса (разность + процент).
 * @param weightBefore Вес до тренировки.
 * @param weightAfter Вес после тренировки.
 * @returns Абсолютное значение + процент.
 */
export function weightLoss(weightBefore: number, weightAfter: number): string {
  const weightDifference = (weightBefore - weightAfter).toFixed(1)
  const weightLossPercent = getPercent(weightBefore, weightAfter)

  return `${weightDifference} кг (${(100 - weightLossPercent).toFixed(1)}%)`
}
/**
 * Переводит время в количесвто секунд.
 * @param time Время.
 * @returns Количество секунд.
 */
export function timeToSeconds(time: string): number {
  let secondsToReturn = 0

  if (typeof time === 'string') {
    const splitTime = time.split(':')

    if (splitTime.length > 3 || splitTime.length < 2) {
      console.error(`Некорректное количество элементов после разделения ${time}.`)
    } else {
      const [ seconds, minutes, hours ] = splitTime.reverse()

      if (!Number.isNaN(+seconds)) {
        if (!Number.isNaN(+minutes)) {
          secondsToReturn = Number(seconds) + Number(minutes) * 60

          if (hours) {
            if (!Number.isNaN(+hours)) {
              secondsToReturn += Number(hours) * 60 * 60
            } else {
              console.error(`Некорректное значение часов (${hours}) в ${time}`)
              secondsToReturn = 0
            }
          }
        } else {
          console.error(`Некорректное значение минут (${minutes}) в ${time}`)
        }
      } else {
        console.error(`Некорректное значение секунд (${seconds}) в ${time}`)
      }
    }
  } else {
    console.error(`Передано неверное значение времени: '${time}'. Ожидалась строка.`)
  }

  return secondsToReturn
}
/**
 * Считает процент с указанной точностью.
 * @param currentValue Текущее значение.
 * @param maxValue Максимальное значение.
 * @param precision Точность вычисления.
 * @returns Процент.
 */
export function getPercent(currentValue: number, maxValue: number, precision: number = 1): number {
  let percent = 0

  if (typeof currentValue === 'number' && typeof maxValue === 'number') {
    percent = Number((currentValue * 100 / maxValue).toFixed(precision))
  } else {
    console.error(`Неверный тип переданных данных: ${currentValue} и ${maxValue}. Ожидались числа.`)
  }

  return percent
}

/**
 * Возвращает случайное число в диапазоне.
 * @param min Минимальное значение.
 * @param max Максимальное значение.
 * @returns Случайное число.
 */
export function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

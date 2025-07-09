import type { DateFormat } from "@/types/dateFormat"
import type { SelectOptions } from "@/types/selectOptions"

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
 * Возвращает красивое значение числа (если число < 10) для даты или времени.
 * @param value Значение.
 * @returns Строка вида "01", "02" и т.д.
 */
export function prettyNumberForDateAndTime(value: number | string): string {
  switch (typeof value) {
    case 'string':
      if (value.length < 2) value = value.padStart(2, '0')
      break
    case 'number':
      if (value < 10) value = String(value).padStart(2, '0')
      break
    default:
      console.error(`Неверный тип переменной: ${typeof value}. Ожидалась строка или число. Возвращаю значение "00".`)
      value = '00'
      break;
  }

  return value as string
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

/**
 * Среднее значение.
 * @param all Массив чисел или их сумма.
 * @param count Количество элементов.
 * @param precision Точность.
 * @returns Среднее арифметическое.
 */
export function getAverage(all: number | number[], count: number, precision: 0 | 1 | 2 = 1): number {
  let sum

  if (typeof all === 'object') {
    sum = all.reduce((a, b) => a + b, 0)
  } else sum = all

  return Number((sum / count).toFixed(precision)) || 0
}

/**
 * Возвращает список недель для элемента <CustomSelect> за указанный период.
 * @param year Год.
 * @param month Месяц.
 * @returns Список недель.
 */
export function getListOfWeeksForMonthToSelect(year: number | string, month: number | string): SelectOptions[] {
  // Если пришли строки - переводим их в числа.
  if (typeof year === 'string') year = +year
  if (typeof month === 'string') month = +month
  // Если перевод оказался удачным - работаем.
  if (year && month) {
    // Первый день месяца.
    const date = new Date(year, month - 1, 1)
    // Набор для хранения информации о неделях.
    const uniqueWeekNumbers = new Map<number, SelectOptions>()
    // Теперь перебираем все дни месяца.
    while (date.getMonth() === (month - 1)) {
      // Номер недели.
      const weekNumber: number = date.getWeekNumber()
      // Если в наборе нет элемента с таким ключом - вычисляем значение и добавляем.
      if (!uniqueWeekNumbers.has(weekNumber)) {
        // День недели. Воскресенье - 7-й.
        const day: number = date.getDay() || 7
        // Понедельник.
        const dateStart = new Date(year, month - 1, date.getDate() - day + 1)
        // Воскресенье.
        const dateEnd = new Date(year, month - 1, date.getDate() + (7 - day))
        // Добавляем данные в набор.
        uniqueWeekNumbers.set(weekNumber, {
          value: `${weekNumber}`,
          label: `#${weekNumber}: ${prettyDate(dateStart.toISOString()).date} - ${prettyDate(dateEnd.toISOString()).date}`
        })
      }
      // Переходим к следующему дню.
      date.setDate(date.getDate() + 1)
    }
    // Из значений набора Map формируем массив и возвращаем. 
    return Array.from(uniqueWeekNumbers.values())
  } else {
    console.error(`Переданное значение не является числом: ${year} или ${month}.`)
    return []
  }
}
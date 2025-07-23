declare global {
  interface Date {
    getWeekNumber(): number,
    toLocaleISOString(): string,
  }
}

export default defineNuxtPlugin(() => {
  /**
   * Возвращает порядковый номер недели в году.
   * Отдельное спасибо ИИ Qwen за помощь.
   */
  Date.prototype.getWeekNumber = function(): number {
    // Первый день в году.
    const startOfYear = new Date(this.getFullYear(), 0, 1)
    // Разность в милисекундах между текущей датой и первым днём в году.
    const diff = this.getTime() - startOfYear.getTime()
    // Количество милисекунд в одном дне.
    const oneDay = 1000 * 60 * 60 * 24
    // Количество дней, прошедших с начала года до текущей даты.
    const dayOfYear = Math.floor(diff / oneDay)
    // Магия вычисления номера недели.
    const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7)
    // Корректируем номер недели, если неделя начинается с понедельника.
    return (this.getDay() === 0) ? weekNumber - 1 : weekNumber
  },
  /**
   * Возвращает дату в формате ISO 8601 с корректировкой по локальному часовому поясу: yyyy-mm-ddThh:mm:ss+offset
   */
  Date.prototype.toLocaleISOString = function(): string {
    // Смещение текущего часового пояса в минутах.
    const timezoneOffset = this.getTimezoneOffset()
    // Смещение в текстовом виде.
    let localeOffset = '+0000'

    if (timezoneOffset !== 0) {
      // Определяем знак.
      const sign = (timezoneOffset < 0) ? '+' : '-'
      // Вычисляем количество часов.
      const hours = String(Math.trunc(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
      // Вычисляем количество минут.
      const minutes = String(Math.abs(timezoneOffset) % 60).padEnd(2, '0')
      // Собираем.
      localeOffset = `${sign}${hours}${minutes}`
    }

    return `${this.toLocaleDateString().split('.').reverse().join('-')}T${this.toLocaleTimeString()}${localeOffset}`
  }
})
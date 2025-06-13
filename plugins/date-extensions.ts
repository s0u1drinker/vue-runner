declare global {
  interface Date {
    getWeekNumber(): number,
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
    // Номер первого в году дня недели для корректировки. 
    const firstDayOfWeek = startOfYear.getDay()

    // Корректируем номер недели, если неделя начинается с понедельника.
    return (firstDayOfWeek === 0) ? weekNumber - 1 : weekNumber
  }
})
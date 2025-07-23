<script setup lang="ts">

// TODO: Возможно, логику работы компонента можно упростить. Подумай.

type CalendarDay = {
  // День месяца.
  day: number,
  // Дата формата ДД.ММ.ГГГГ.
  date: string,
  // Флаг даты предыдущего месяца.
  prevMonth?: boolean,
  // Флаг даты следующего месяца.
  nextMonth?: boolean,
}

const { startDate, endDate, restricted = true } = defineProps<{
  /**
   * Дата начала - дата, начиная с которой можно выбирать.
   */
  startDate?: Date,
  /**
   * Дата окончания - дата (включительно), до которой можно выбирать.
   */
  endDate?: Date,
  /**
   * Ограниченность календаря: если указан "false" и не указаны даты начала и окончания, то календарь будет "бесконечным".
   * По умолчанию "true" и имеет диапазон: 01.01.2010 - 31.12.2039. 
   */
  restricted?: boolean,
}>()

const modelDate = defineModel('date', {
  type: String,
  validator: (value: string) => {
    // Проверка на соответствие шаблону "ДД.ММ.ГГГГ" или пустая строка.
    return ((value === '') || isValidDateString(value))
  }
})

const emit = defineEmits(['update:date'])

// Сегодняшний день.
const today = new Date()
// Дата начала календаря.
const calendarStart = startDate ? startDate : restricted ? new Date(2010, 0, 1) : null
// Дата окончания календаря.
const calendarEnd = endDate ? endDate : restricted ? new Date(2039, 11, 31) : null
// Значения года, месяца и дня.
const year = ref<number>(today.getFullYear())
const month = ref<number>(today.getMonth() + 1)
const day = ref<number>(today.getDate())
// Disabled-флаги для кнопок переклчения года и месяца.
const disabledFlags = reactive({
  prevYear: false,
  nextYear: false,
  prevMonth: false,
  nextMonth: false,
})
// Вычисляемый массив с днями в календаре.
const calendarDays = computed<CalendarDay[]>(() => {
  // Массив с днями.
  const days: CalendarDay[] = []
  // Количество дней в текущем месяце.
  const daysInMonth: number = 33 - new Date(year.value, month.value - 1, 33).getDate()
  // Переменная с датой для вычислений.
  let date: Date
  // Вносим дни предыдущего месяца.
  // Устанавливаем дату первого дня текущего месяца.
  date = new Date(year.value, month.value - 1, 1)
  // Добавляем в массив дни предыдущего месяца, пока не "дойдём" до понедельника.
  // Или не добавляем ничего, если значение в date уже является понедельником.
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() - 1)
    days.unshift({
      day: date.getDate(),
      date: `${prettyNumberForDateAndTime(date.getDate())}.${prettyNumberForDateAndTime(date.getMonth() + 1)}.${date.getFullYear()}`,
      prevMonth: true
    })
  }
  // Вносим дни выбранного месяца.
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      date: `${prettyNumberForDateAndTime(i)}.${prettyNumberForDateAndTime(month.value)}.${year.value}`,
    })
  }
  // Вносим дни следующего месяца.
  // Устанавливаем дату первого дня следующего месяца.
  date = new Date(year.value, month.value, 1)
  // В календаре отображается 6 недель (42 дня).
  while (days.length < 42) {
    days.push({
      day: date.getDate(),
      date: `${prettyNumberForDateAndTime(date.getDate())}.${prettyNumberForDateAndTime(date.getMonth() + 1)}.${date.getFullYear()}`,
      nextMonth: true
    })
    date.setDate(date.getDate() + 1)
  }

  return days
})

onMounted(() => {
  // Установка disabled-флагов.
  if (calendarStart) {
    disabledFlags.prevYear = (year.value <= calendarStart.getFullYear())
    disabledFlags.prevMonth = (disabledFlags.prevYear && (month.value <= (calendarStart.getMonth() + 1)))
  }
  if (calendarEnd) {
    disabledFlags.nextYear = (year.value >= calendarEnd.getFullYear())
    disabledFlags.nextMonth = (disabledFlags.nextYear && (month.value >= (calendarEnd.getMonth() + 1)))
  }
  // Проверяем значение переданной даты.
  if (typeof modelDate.value === 'string') {
    // Если передана пустая строка, то дата в календаре остаётся не выбранной.
    if (modelDate.value !== '') {
      // В противном случае, начинаем "препарировать" строку и выясняем, что же там за дату передали.
      const splitDate = modelDate.value.split('.')
      
      if (splitDate.length === 3) {
        // Проверяем на NaN.
        Number.isNaN(splitDate[0]) ? console.error(`Ошибка конвертации: день <${splitDate[0]}> не число.`) : day.value = Number(splitDate[0])
        Number.isNaN(splitDate[1]) ? console.error(`Ошибка конвертации: месяц <${splitDate[1]}> не число.`) : month.value = Number(splitDate[1])
        Number.isNaN(splitDate[2]) ? console.error(`Ошибка конвертации: год <${splitDate[2]}> не число.`) : year.value = Number(splitDate[2])
      } else {
        // Количество элементов после разделения по символу "." не равно 3 - ошибка.
        console.error(`Дата не соответствует шаблону ДД.ММ.ГГГГ: ${modelDate.value}. Выбрана текущая дата.`)
        // Возвращаем текущую дату.
        updateModelDate(`${prettyNumberForDateAndTime(day.value)}.${prettyNumberForDateAndTime(month.value)}.${year.value}`)
      }
    }
  } else {
    // Значение не является строкой - ошибка.
    console.error(`Неверный тип даты: ${modelDate.value}. Ожидалась строка.`)
  }
})
// Клик по дню в календаре.
function selectDay(day: CalendarDay): void {
  // Если выбрана дата из предыдущего месяца - показываем его.
  if (day.prevMonth) prevMonth()
  // Если выбрана дата следующего месяца - показываем его.
  else if (day.nextMonth) nextMonth()
  // Обновляем дату.
  updateModelDate(day.date)
}
// Обновление выбранной даты.
function updateModelDate(newDate: string): void {
  if (isValidDateString(newDate)) {
    emit('update:date', newDate)
  } else {
    console.error(`Невозможно обновить дату, т.к. переданное значение не соответствует шаблону ДД.ММ.ГГГГ: ${newDate}.`)
  }
}
// Предыдущий год.
function prevYear() {
  // Если указана дата начала календаря.
  if (calendarStart) {
    // И если не поднят disabled-флаг.
    if (!disabledFlags.prevYear) {
      // Уменьшаем год.
      year.value--
      // Проверяем флаги.
      disabledFlags.prevYear = (year.value <= calendarStart.getFullYear())
      disabledFlags.prevMonth = (disabledFlags.prevYear && (month.value <= (calendarStart.getMonth() + 1)))
      if (disabledFlags.nextYear) disabledFlags.nextYear = false
      if (disabledFlags.nextMonth) disabledFlags.nextMonth = false
    }
  } else {
    year.value--
  }
}
// Следующий год.
function nextYear() {
  // Если указана дата окончания календаря.
  if (calendarEnd) {
    // И если не поднят disabled-флаг.
    if (!disabledFlags.nextYear) {
      // Увеличиваем год.
      year.value++
      // Проверяем флаги.
      disabledFlags.nextYear = (year.value >= calendarEnd.getFullYear())
      disabledFlags.nextMonth = (disabledFlags.nextYear && (month.value >= (calendarEnd.getMonth() + 1)))
      if (disabledFlags.prevYear) disabledFlags.prevYear = false
      if (disabledFlags.prevMonth) disabledFlags.prevMonth = false
    }
  } else {
    year.value++
  }
}
// Предыдущий месяц.
function prevMonth() {
  // Если указана дата начала календаря.
  if (calendarStart) {
    // И если не поднят disabled-флаг.
    if (!disabledFlags.prevMonth) {
      // Магия уменьшения месяца.
      if (month.value <= 1) {
        month.value = 12
        // Уменьшаем год.
        prevYear()
      } else month.value--
      // Проверяем флаги.
      disabledFlags.prevMonth = (disabledFlags.prevYear && (month.value <= (calendarStart.getMonth() + 1)))
      if (disabledFlags.nextMonth) disabledFlags.nextMonth = false
    }
  } else {
    if (month.value <= 1) {
      month.value = 12
      prevYear()
    } else month.value--
  }
}
// Следующий месяц.
function nextMonth() {
  // Если указана дата окончания календаря.
  if (calendarEnd) {
    // И если не поднят disabled-флаг.
    if (!disabledFlags.nextMonth) {
      // Магия увеличения месяца.
      if (month.value >= 12) {
        month.value = 1
        // Увеличиваем год.
        nextYear()
      } else month.value++
      // Проверяем флаги.
      disabledFlags.nextMonth = (disabledFlags.nextYear && (month.value >= (calendarEnd.getMonth() + 1)))
      if (disabledFlags.prevMonth) disabledFlags.prevMonth = false
    }
  } else {
    if (month.value >= 12) {
      month.value = 1
      nextYear()
    } else month.value++
  }
}
</script>

<template>
  <div class="calendar">
    <CalendarSelector
      :disable-prev="disabledFlags.prevYear"
      :disable-next="disabledFlags.nextYear"
      :text="year"
      @click-prev="prevYear"
      @click-next="nextYear"
    />
    <CalendarSelector
      :disable-prev="disabledFlags.prevMonth"
      :disable-next="disabledFlags.nextMonth"
      :text="MONTHS[month]"
      @click-prev="prevMonth"
      @click-next="nextMonth"
    />
    <div class="calendar__days">
      <div
        class="calendar__day"
        :class="{
          'color_gray': day.prevMonth || day.nextMonth,
          'calendar__day_today': day.date === today.toLocaleDateString(),
          'calendar__day_selected': day.date === modelDate
        }"
        v-for="day in calendarDays"
        :key="day.date"
        @click="selectDay(day)"
        @keydown.enter="selectDay(day)"
        @keyup.space="selectDay(day)"
        role="button"
        tabindex="0"
        aria-label="Выбрать день"
      >{{ day.day }}</div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  gap: var(--indent-half);
  padding: var(--indent-half);

  &__days {
    display: grid;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(6, auto);
  }

  &__day {
    border: 1px solid transparent;
    padding: .25rem;
    text-align: center;
    transition: border-color var(--animation);
    user-select: none;

    &:hover {
      border-color: var(--gray);
      cursor: default;
    }

    &_today {
      color: var(--red);
    }

    &_selected {
      background-color: var(--light-red);
      border-color: var(--light-red);
      pointer-events: none;

      &:hover {
        border-color: var(--light-red);
      }
    }
  }
}
</style>
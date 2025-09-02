<script setup lang="ts">
import type { SelectNativeOptions } from '@/types/selectNativeOptions'
import type { GoalWeek } from '@/types/goalWeek'
import type { GoalMonth } from '@/types/goalMonth'
import type { GoalYear } from '@/types/goalYear'
import type { GoalCollections } from '@/types/goalCollections'
import type { Workout } from '@/types/workout'

// TODO: Ещё раз внимательно посмотреть на логику.

const goalsStore = useGoalStore()
const workoutStore = useWorkoutStore()
const { goals } = storeToRefs(goalsStore)
const { getWorkoutsForThePeriod } = workoutStore

const year = ref<string>(String(TODAY_DATE.getFullYear()))
const month = ref<string>(String(TODAY_DATE.getMonth()))
const week = ref<string>(String(TODAY_DATE.getWeekNumber()))
// Флаги для определения периода.
const showYear = ref<boolean>(false)
const showMonth = ref<boolean>(false)
const showWeek = ref<boolean>(false)
// Флаг прогресса обновления данных в БД.
const updInProgress = ref<boolean>(false)
// Текст для отображения периода.
const textPeriod = ref<string>('-')
// Значение цели.
const goal = ref<number>(-1)
// Результат её выполнения.
const completed = ref<number>(-1)
// Текст для отображения результата выполнения цели.
const textCompleted = computed<string>(() => {
  if (completed.value === -1) return '-'
  else if (goal.value && completed.value) return `${completed.value} км (${getPercent(completed.value, goal.value, 0)}%)`
  else return `${completed.value} км`
})
// Список недель.
const weekItems = computed<SelectNativeOptions[]>(() => {
  return getListOfWeeksForMonthToSelect(year.value, month.value)
})
// Наименование коллекции, в которую будут внесены изменения.
const collectionName = computed<keyof GoalCollections | null>(() => {
  return (showWeek.value) ? 'weeks' : (showMonth.value) ? 'months' : (showYear.value) ? 'years' : null
})
// Наболюдаем за флагом флагом показа года.
watch(showYear, (newValue) => {
  // Если стал отключен.
  if (!newValue) {
    // Отключаем флаги недели и месяца, если они, еонечно же, включены.
    if (showWeek.value) showWeek.value = false
    if (showMonth.value) showMonth.value = false
    // Убираем текстовые значения.
    textPeriod.value = '-'
    goal.value = -1
    completed.value = -1
  }
})
// Наблюдаем за значением месяца.
watch(month, () => {
  // Обновляем значение недели: если выбран текущий месяц, то ставим текущую неделю, иначе - первую неделю месяца.
  week.value = (month.value === String(TODAY_DATE.getMonth())) ? String(TODAY_DATE.getWeekNumber()) : weekItems.value[0].value
})
// Наблюдаем.
watchEffect(() => {
  // Если флаг показа года поднят.
  if (showYear.value) {
    // Выбираем цель указанного в компоненте года.
    const currentYear: GoalYear | undefined = goals.value.years.find((y) => y.year === +year.value)
    // Обновляем значения.
    textPeriod.value = `${year.value} г.`
    goal.value = (currentYear && Object.hasOwn(currentYear, 'goalDistance')) ? currentYear.goalDistance : -1
    completed.value = (currentYear && Object.hasOwn(currentYear, 'completedDistance')) ? currentYear.completedDistance : -1
    // Если поднят флаг показа месяца.
    if (showMonth.value) {
      // Выбираем цель на месяц и год, указанные в компонентах.
      const currentMonth: GoalMonth | undefined = goals.value.months.find((m) => (m.year === +year.value && m.month === +month.value))
      // Обновляем текстовые значения.
      textPeriod.value = `${MONTHS[+month.value]} ${textPeriod.value}`
      goal.value = (currentMonth && Object.hasOwn(currentMonth, 'goalDistance')) ? currentMonth.goalDistance : -1
      completed.value = (currentMonth && Object.hasOwn(currentMonth, 'completedDistance')) ? currentMonth.completedDistance : -1
      // Если поднят флаг показа недели.
      if (showWeek.value) {
        // Выбираем цель на неделю.
        const curretnWeek: GoalWeek | undefined = goals.value.weeks.find((w) => w.weekNumber === +week.value)
        // Выбираем указанную неделю из списка недель (для отображения периода).
        // P.S.: Можно взять даты из цели и путём нехитрых манипуляций привести в красивый вид, но мне показалось, что так будет проще.
        const currentWeekItemLabel: string | undefined = weekItems.value.find((item) => item.value === week.value)?.label
        // Обновляем текстовые значения.
        textPeriod.value = currentWeekItemLabel ? currentWeekItemLabel.split(':')[1].trim() : '-'
        goal.value = (curretnWeek && Object.hasOwn(curretnWeek, 'goalDistance')) ? curretnWeek.goalDistance : -1
        completed.value = (curretnWeek && Object.hasOwn(curretnWeek, 'completedDistance')) ? curretnWeek.completedDistance : -1
      }
    }
  }
})
// Определяет состояние цели (пользователь изменил/добавил) и вызывает соответствующую функцию.
async function goalChanged(oldValue: number) {
  let changeOperation: boolean
  
  updInProgress.value = true
  changeOperation = (oldValue === -1) ? await addGoal() : await updateGoal()
  updInProgress.value = false

  // Если функция вернула ошибку - уведомляем пользователя и возвращаем старое значение.
  if (!changeOperation) {
    goal.value = oldValue
    alert('Ошибка при обновлении данных! Попробуйте ещё раз.')
  }
}
// Добавление цели.
async function addGoal(): Promise<boolean> {
  let addResult: boolean = false
  let goalData: GoalYear | GoalMonth | GoalWeek
  // Если имя коллекции определено.
  if (collectionName.value) {
    // Заполняем базовые данные о цели.
    goalData = {
      id: '',
      year: Number(year.value),
      goalDistance: goal.value,
      completedDistance: 0,
      workoutCounter: 0,
    }
    // Если цель устанавливается на неделю.
    if (showWeek.value) {
      const { dateStart, dateEnd } = getWeekDatesByWeekNumber(Number(year.value), Number(week.value))
      // Добавляем данными на неделю.
      goalData = {
        ...goalData,
        weekNumber: Number(week.value),
        dateStart,
        dateEnd,
      }
    } else if (showMonth.value) {
      // Или на месяц, если, конечно, установлен соответствующий флаг.
      goalData = {
        ...goalData,
        month: Number(month.value),
      }
    }
    // Добавляем данные в хранилище и БД.
    addResult = await goalsStore.addGoal(collectionName.value, goalData)
  } else console.error(`Странная ситуация: функция добавления цели была вызвана при отключенных флагах (${showYear.value}, ${showMonth.value}, ${showWeek.value}).`)
  // Результат.
  return addResult
}
// Обновление цели.
async function updateGoal(): Promise<boolean> {
  let updateResult: boolean = false
  // Если имя коллекции определено.
  if (collectionName.value) {
    let goalData: GoalYear | GoalMonth | GoalWeek | undefined
    // Вычисление идентификатора записи.
    if (showWeek.value) {
      goalData = goals.value.weeks.find((item) => item.weekNumber === Number(week.value))
    } else if (showMonth.value) {
      goalData = goals.value.months.find((item) => (item.year === Number(year.value)) && (item.month === Number(month.value)))
    } else if (showYear.value) {
      goalData = goals.value.years.find((item) => (item.year === Number(year.value)))
    }

    if (goalData) {
      // Обновляем данные в хранилище и БД.
      updateResult = await goalsStore.updateGoal(collectionName.value, goalData)
    } else console.error('По заданным параметрам цель не найдена.')
  } else console.error(`Странная ситуация: функция обновления цели была вызвана при отключенных флагах (${showYear.value}, ${showMonth.value}, ${showWeek.value}).`)
  // Результат работы.
  return updateResult
}
// Функция принудительного пересчёта результата выполнения цели.
// TODO: Ответить на вопрос: а она нужна? Ведь значение цели пересчитывается при внесении данных о новой тренировке.
function recalculateCompletedDistance(): void {
  const period: { year: number, month?: number, week?: number } = { year: +year.value }

  if (showMonth.value) {
    period.month = +month.value

    if (showWeek.value) period.week = +week.value
  }
  
  const workouts: Workout[] = getWorkoutsForThePeriod(period)

  if (workouts.length) {
    const newCompletedDistance: number = workouts.reduce((sum, workout) => sum + workout.distance, 0)

    if (newCompletedDistance !== completed.value) {
      // Обновить данные о цели в БД и хранилище.
    }
  }
}
</script>

<template>
  <FieldsetWrapper class="goals" legend="Цели">
    <div class="goals__options goals__box">
      <div class="goals__item">
        <label class="goals__item-name">
          <input
            class="goals__item-check"
            type="checkbox"
            v-model="showYear"
          >
          Год
        </label>
        <CarouselSimple
          :items="YEARS_FOR_SELECT"
          :disabled="!showYear"
          v-model="year"
        />
      </div>
      <div class="goals__item">
        <label class="goals__item-name">
          <input
            class="goals__item-check"
            type="checkbox"
            v-model="showMonth"
            :disabled="!showYear"
          >
          Месяц
        </label>
        <CarouselSimple
          :items="MONTHS_FOR_SELECT"
          :disabled="!showMonth"
          v-model="month"
        />
      </div>
      <div class="goals__item">
        <label class="goals__item-name">
          <input
            class="goals__item-check"
            type="checkbox"
            v-model="showWeek"
            :disabled="!(showYear && showMonth)"
          >
          Неделя
        </label>
        <SelectCustom
          :list="weekItems"
          :disabled="!showWeek"
          :numberItemsToDisplay="3"
          v-model="week"
        />
      </div>
    </div>
    <div class="goals__data goals__box">
      <div class="goals__item">
        <span class="goals__item-name bold">Период:</span>
        {{ textPeriod }}
      </div>
      <div class="goals__item">
        <span class="goals__item-name bold">Цель:</span>
        <GoalForm
          :showEditButton="showYear"
          :inProgress="updInProgress"
          @valueChanged="goalChanged"
          v-model="goal"
        />
      </div>
      <div class="goals__item">
        <span class="goals__item-name bold">Выполнено:</span>
        <Icon name="svg-spinners:clock" v-if="updInProgress" />
        <div class="flex flex_ai-center flex_gap" v-else>
          {{ textCompleted }}
          <button
            class="button button_blue goals__button"
            aria-label="Пересчитать"
            @click="recalculateCompletedDistance"
            v-if="false"
          >
            <Icon name="material-symbols-light:refresh-rounded" size="1.5rem" />
          </button>
        </div>
      </div>
    </div>
  </FieldsetWrapper>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.goals {
  margin-top: var(--indent-double);
  display: flex;
  flex-direction: column;
  gap: var(--indent);
  padding: var(--indent) var(--indent-half);

  @media (--viewport-sm) {
    flex-direction: row;
  }

  &__box {
    display: flex;
    flex-direction: column;
    gap: var(--indent);
    flex: 1;
  }

  &__options {
    padding-bottom: var(--indent);
    border-image: linear-gradient(to right, transparent 0%, var(--dark-gray) 25%, var(--dark-gray) 75%, transparent 100%) 1;
    border-width: 0;
    border-bottom-width: 1px;
    border-style: solid;

    @media (--viewport-sm) {
      border-right-width: 1px;
      border-image: linear-gradient(to bottom, transparent 0%, var(--dark-gray) 25%, var(--dark-gray) 75%, transparent 100%) 1;
      padding-right: var(--indent);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--indent);

    @media (--viewport-lg) {
      flex-direction: row;
      gap: var(--indent-half);
    }
  }

  &__item-check {
    width: 1rem;
    height: 1rem;
    accent-color: var(--sky-blue);
  }

  &__item-name {
    display: flex;
    align-items: center;
    gap: var(--indent-half);
    width: 6rem;
    flex: none;
    justify-content: center;

    @media (--viewport-lg) {
      justify-content: flex-start;
    }
  }

  &__data {

    & .goals__item-name {
      width: 6rem;
    }
  }

  &__button {
    padding: .325rem;
  }
}
</style>
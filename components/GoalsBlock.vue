<script setup lang="ts">
import type { SelectNativeOptions } from '@/types/selectNativeOptions'

const { goals } = storeToRefs(useGoalStore())

const year = ref<string>(String(TODAY_DATE.getFullYear()))
const month = ref<string>(String(TODAY_DATE.getMonth()))
const week = ref<string>(String(TODAY_DATE.getWeekNumber()))
const showYear = ref<boolean>(false)
const showMonth = ref<boolean>(false)
const showWeek = ref<boolean>(false)
const textPeriod = ref<string>('-')
const textGoal = ref<string>('-')
const textCompleted = ref<string>('-')

const weekItems = computed<SelectNativeOptions[]>(() => {
  return getListOfWeeksForMonthToSelect(year.value, month.value)
})

watch(showYear, (newValue) => {
  if (!newValue) {
    if (showWeek.value) showWeek.value = false
    if (showMonth.value) showMonth.value = false

    textCompleted.value = '-'
    textGoal.value = '-'
    textPeriod.value = '-'
  }
})

watch(month, () => {
  week.value = (month.value === String(TODAY_DATE.getMonth())) ? String(TODAY_DATE.getWeekNumber()) : weekItems.value[0].value
})

watchEffect(() => {
  if (showYear.value) {
    const currentYear = goals.value.years.find((y) => y.year === +year.value)

    textPeriod.value = `${year.value} г.`
    textGoal.value = currentYear ? `${currentYear.goalDistance} км` : '-'
    textCompleted.value = currentYear ? `${currentYear.completedDistance} км (${getPercent(currentYear.completedDistance, currentYear.goalDistance, 0)}%)` : '-'

    if (showMonth.value) {
      const currentMonth = goals.value.months.find((m) => (m.year === +year.value && m.month === +month.value))

      textPeriod.value = `${MONTHS[+month.value]} ${textPeriod.value}`
      textGoal.value = currentMonth ? `${currentMonth.goalDistance} км` : '-'
      textCompleted.value = currentMonth ? `${currentMonth.completedDistance} км (${getPercent(currentMonth.completedDistance, currentMonth.goalDistance, 0)}%)` : '-'

      if (showWeek.value) {
        const curretnWeek = goals.value.weeks.find((w) => w.weekNumber === +week.value)
        const currentWeekItem = weekItems.value.find((item) => item.value === week.value)

        textPeriod.value = currentWeekItem ? currentWeekItem.label.split(':')[1].trim() : '-'
        textGoal.value = curretnWeek ? `${curretnWeek.goalDistance} км` : '-'
        textCompleted.value = curretnWeek ? `${curretnWeek.completedDistance} км (${getPercent(curretnWeek.completedDistance, curretnWeek.goalDistance, 0)}%)` : '-'
      }
    }

  }
})
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
          :disabled="showMonth"
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
          :disabled="showWeek"
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
        {{ textGoal }}
      </div>
      <div class="goals__item">
        <span class="goals__item-name bold">Выполнено:</span>
        {{ textCompleted }}
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
}
</style>
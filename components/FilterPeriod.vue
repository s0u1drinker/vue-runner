<script setup lang="ts">
import type { RadioGroupValues } from '@/types/radioGroupValues'
import type { SelectOptions } from '@/types/selectOptions'
import type { FilterPeriod } from '@/types/filterPeriod'

// FIXME: Необходимо ещё раз продумать оформление компоннета.

const emit = defineEmits<{
  setFilter: [ value: FilterPeriod ]
}>()

const periods: RadioGroupValues[] = [
  { radioValue: 'year', label: 'Год', },
  { radioValue: 'month', label: 'Месяц', },
  { radioValue: 'week', label: 'Неделя', },
]
// Флаг для отображения содержимого блока с управляющими элементами.
const showOptions = ref<boolean>(false)
// Значение выбранного периода.
const period = ref<string | null>(null)
// Список недель.
const listOfWeeks = ref<SelectOptions[]>([])
// Выбранный год.
const targetYear = ref<string>(String(TODAY_DATE.getFullYear()))
// Выбранный месяц.
const targetMonth = ref<string>(String(TODAY_DATE.getMonth()))
// Выбранная неделя.
const targetWeek = ref<string>('')
// Класс для кнопки добавить/удалить фильтр.
const controlButtonClass = computed<string>(() => {
  return showOptions.value ? 'button_red' : 'button_blue'
})
// Значение фильтра.
const filterBy = computed<FilterPeriod>(() => {
  const returnValue: FilterPeriod = {
    type: 'period',
    value: period.value
  }

  if (returnValue.value) {
    returnValue.data = { year: targetYear.value }

    switch (returnValue.value) {
      case 'week':
        returnValue.data.week = targetWeek.value
        // break не используется, т.к. значение месяца нужно в обоих случаях.
      case 'month':
        returnValue.data.month = targetMonth.value
        break
    }
  }

  return returnValue
})
// При изменении значения выбранного года или месяца обновляет список недель и выбирает первую в списке.
watchEffect(() => {
  listOfWeeks.value = getListOfWeeksForMonthToSelect(targetYear.value, targetMonth.value)
  targetWeek.value = listOfWeeks.value[0].value
})
// Собираем данные фильтра и отдаём родителю.
watch(filterBy, () => {
  emit('setFilter', filterBy.value)
})
// При выборе периода показывает блок с CustomSelect, иначе сбрасывает фильтр.
function toggleOptions(): void {
  showOptions.value = !showOptions.value
  
  if (!showOptions.value) {
    period.value = null
    targetYear.value = String(TODAY_DATE.getFullYear())
    targetMonth.value = String(TODAY_DATE.getMonth())
    targetWeek.value = String(TODAY_DATE.getWeekNumber())
  }
}
</script>

<template>
  <div class="f-period">
    <div class="f-period__header">
      <span class="f-period__title">Период</span>
      <div class="f-period__control">
        <button class="button" :class="controlButtonClass" @click="toggleOptions">
          <span class="f-period__button-text" :class="{ 'f-period__button-text_rotate': showOptions }">+</span>
        </button>
      </div>
    </div>
    <div class="f-period__inner" :class="{ 'f-period__inner_show': showOptions }">
      <RadioGroupButtons
        name="period"
        :items="periods"
        v-model="period"
      />
      <div class="f-period__values" v-if="period">
        <CustomSelect
          :options="YEARS_FOR_SELECT"
          placeholder=""
          name="years"
          v-model="targetYear"
        />
        <CustomSelect
          :options="MONTHS_FOR_SELECT"
          placeholder=""
          name="months"
          v-model="targetMonth"
          v-if="period === 'month' || period === 'week'"
        />
        <CustomSelect
          :options="listOfWeeks"
          placeholder=""
          name="weeks"
          v-model="targetWeek"
          v-if="period === 'week'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.f-period {
  --button-size: 1.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    gap: var(--indent);
    align-items: center;
  }

  &__title {
    font-weight: bold;
  }

  &__control {

    button {
      width: var(--button-size);
      height: var(--button-size);
      font-size: 1.25rem;
      padding: 0;
    }
  }

  &__button-text {
    transition: rotate var(--animation);
    width: var(--button-size);
    height: var(--button-size);

    &_rotate {
      rotate: 45deg;
    }
  }

  &__inner {
    height: 0;
    opacity: 0;
    overflow: hidden;
    margin-top: var(--indent-half);
    transition: opacity var(--animation), height var(--animation);

    &_show {
      height: auto;
      opacity: 1;
    }
  }

  &__values {
    display: flex;
    gap: var(--indent-half);
    flex-wrap: wrap;
    margin-top: var(--indent-half);
  }
}
</style>
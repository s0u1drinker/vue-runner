<script setup lang="ts">
import type { RadioGroupValues } from '@/types/radioGroupValues'
import type { SelectData } from '@/types/selectData'
import type { FilterPeriod } from '@/types/filterPeriod'

// FIXME: Есть претензии к стилевому оформлению компонента (костыль с шириной select`а для выбора недели).
// FIXME: Необходимо ещё раз продумать оформление компоннета.

const workoutStore = useWorkoutStore()
const { statistic } = storeToRefs(workoutStore)

const emit = defineEmits<{
  setFilter: [ value: FilterPeriod ]
}>()

const periods: RadioGroupValues[] = [
  { radioValue: '', label: 'Все', },
  { radioValue: 'year', label: 'Год', },
  { radioValue: 'month', label: 'Месяц', },
  { radioValue: 'week', label: 'Неделя', },
]
// Текущее значение и элементы списка "Год".
const years = ref<SelectData>({
  list: statistic.value.years.map((item) => {
    return { value: String(item.year), label: String(item.year) }
  }),
  current: String(TODAY_DATE.getFullYear()),
})
// Текущее значение и элементы списка "Месяц".
const months = ref<SelectData>({
  list: statistic.value.months.map((item) => {
    return { value: String(item.month), label: MONTHS[item.month] }
  }),
  current: String(TODAY_DATE.getMonth()),
})
// Текущее значение и элементы списка "Неделя".
const weeks = ref<SelectData>({
  list: statistic.value.weeks.map((item) => {
    return { value: String(item.weekNumber), label: `#${item.weekNumber}: ${prettyDate(item.dateStart).date} - ${prettyDate(item.dateEnd).date}` }
  }),
  current: String(TODAY_DATE.getWeekNumber()),
})
// Значение выбранного периода.
const period = ref('')
// Изменение периода при нажатии на кнопку.
const changePeriodFromButton = (newPeriod: string) => period.value = newPeriod
// Собираем данные фильтра и отдаём родителю.
watchEffect(() => {
  const filter: FilterPeriod = {
    type: 'period',
    value: period.value
  }

  if (filter.value) {
    filter.data = { year: years.value.current }

    switch (filter.value) {
      case 'month':
        filter.data.month = months.value.current
        break
      case 'week':
        filter.data.week = weeks.value.current
        break
    }
  }

  emit('setFilter', filter)
})

onMounted(() => {
  period.value = periods[0].radioValue
})
</script>

<template>
  <div class="f-period">
    <span class="f-period__title">Период:</span>
    <div class="f-period__inner">
      <RadioGroupButtons name="period" :items="periods" @change-value="changePeriodFromButton" />
      <div class="f-period__values">
        <template v-if="period">
          <CustomSelect
            :options="years.list"
            placeholder=""
            v-model="years.current"
          />
          <CustomSelect
            :options="months.list"
            placeholder=""
            v-model="months.current"
            v-if="period === 'month'"
          />
          <CustomSelect
            class="f-period__fix-select"
            :options="weeks.list"
            placeholder=""
            v-model="weeks.current"
            v-if="period === 'week'"
          />
        </template>
        <span class="f-period__all-span" v-else>Отображаются все тренировки.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.f-period {
  display: flex;
  flex-direction: column;
  gap: var(--indent-half);

  &__title {
    font-weight: bold;
  }

  &__values {
    padding-top: var(--indent-half);
    display: flex;
    gap: var(--indent-half);
    height: 2rem;
    align-items: center;
  }

  &__all-span {
    color: var(--gray);
    font-style: italic;
  }

  &__fix-select {
    width: 162px;

    @media (--viewport-sm) {
      width: auto;
    }
  }
}
</style>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Workout } from '@/types/workout'
import type { FilterPeriod } from '@/types/filterPeriod'

type PeriodGroup = string | null

const workoutStore = useWorkoutStore()
const { workouts, statistic } = storeToRefs(workoutStore)
// Массив с тренировками, который будет отображаться. К нему будут применяться фильтры и сортировки.
const workoutsToShow = ref<Workout[]>([...workouts.value])
// Период для группировки информации.
const periodGroup = ref<PeriodGroup>(null)
// Фильтрация данных по периоду.
// FIXME: Необходимо унифицировать функцию фильтрации, т.к. фильтров будет много и у всех будут разные типы.
// TODO: Да и, в целом, не мешало бы продумать вариант с переносом фильтров и <workoutsToShow> в хранилище.
const filterDataByPeriod = (filter: FilterPeriod): void => {
  switch (filter.value) {
    case null:
    case '':
      // Здесь достаточно поверхностного клонирования.
      workoutsToShow.value = [ ...workouts.value ]
      break
    case 'year':
      workoutsToShow.value = workouts.value.filter((item) => new Date(item.dateStart).getFullYear() === Number(filter.data?.year))
      break
    case 'month':
      workoutsToShow.value = workouts.value.filter((item) => {
        const dateStart = new Date(item.dateStart)

        return (dateStart.getFullYear() === Number(filter.data?.year)) && ((dateStart.getMonth() + 1) === Number(filter.data?.month))
      })
      break
    case 'week':
      workoutsToShow.value = workouts.value.filter((item) => {
        const dateStart = new Date(item.dateStart)

        return (dateStart.getFullYear() === Number(filter.data?.year)) && (dateStart.getWeekNumber() === Number(filter.data?.week))
      })
      break
    default:
      console.warn(`Неизвестный тип фильтра по периоду: ${filter.value}`)
      break
  }
}

function groupDataByPeriod(period: PeriodGroup): void {
  periodGroup.value = period
}
</script>

<template>
  <div class="workouts">
    <h2>Список тренировок</h2>
    <div class="workouts__options flex flex_wrap flex_ai-start">
      <BlockOption title="Фильтры">
        <FilterPeriod @set-filter="filterDataByPeriod" />
      </BlockOption>
      <BlockOption title="Группировать">
        <GroupPeriod @group-by="groupDataByPeriod" />
      </BlockOption>
    </div>
    <div class="workouts__info">
      <span class="workouts__info-item">Количество тренировок: {{ workoutsToShow.length }}</span>
    </div>
    <WorkoutsGroupYearTable :rows="statistic.years" v-if="periodGroup === 'year'" />
    <WorkoutsGroupMonthTable :rows="statistic.months" v-else-if="periodGroup === 'month'" />
    <WorkoutsGroupWeekTable :rows="statistic.weeks" v-else-if="periodGroup === 'week'" />
    <WorkoutsDayTable :rows="workoutsToShow" v-else />
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.workouts {
  display: flex;
  flex-direction: column;
  gap: var(--indent);
  margin-top: var(--indent-double);

  &__info {
    margin-top: var(--indent);
  }

  &__options {
    gap: var(--indent);

    @media (--viewport-md) {
      gap: var(--indent-double);
    }
  }
}
</style>
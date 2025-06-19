<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Workout } from '@/types/workout'
import type { FilterPeriod } from '@/types/filterPeriod'

const workoutStore = useWorkoutStore()
const { workouts } = storeToRefs(workoutStore)
// Массив с тренировками, который будет отображаться. К нему будут применяться фильтры и сортировки.
const workoutsToShow = ref<Workout[]>([])
// Фильтрация данных по периоду.
// FIXME: Необходимо унифицировать функцию фильтрации, т.к. фильтров будет много и у всех будут разные типы.
// TODO: Да и, в целом, не мешало бы продумать вариант с переносом фильтров и <workoutsToShow> в хранилище.
// TODO: P.S.: Возможно, "Hydration node mismatch" можно исправить манипуляциями, описанными выше.
const filterDataByPeriod = (filter: FilterPeriod) => {
  switch (filter.value) {
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
</script>

<template>
  <div class="workouts">
    <h2>Список тренировок</h2>
    <div class="workouts__filters-wrapper block">
      <FilterPeriod @set-filter="filterDataByPeriod" />
    </div>
    <div class="workouts__info">
      <span class="workouts__info-item">Количество тренировок: {{ workoutsToShow.length }}</span>
    </div>
    <table class="workouts__table">
      <thead class="workouts__table-thead">
        <tr>
          <th></th>
          <th>Дата</th>
          <th>Дистанция</th>
          <th>Время</th>
          <th class="extra-column">Темп</th>
          <th class="extra-column">Пульс</th>
          <th class="extra-column">Температура</th>
        </tr>
      </thead>
      <tbody class="workouts__table-tbody" v-if="workoutsToShow.length">
        <tr
          v-for="(workout, index) in workoutsToShow"
          :key="workout.id"
          @click="navigateTo(`/workout/${workout.id}`)"
          role="button"
          :tabindex="index"
        >
          <td class="workouts__td">
            <Icon :name="workoutStore.getActivityByID(workout.idActivity).icon" />
            <span class="workouts__span_toggle">{{ workoutStore.getActivityByID(workout.idActivity).title }}</span>
          </td>
          <td>{{ prettyDate(workout.dateStart).date }}</td>
          <td>{{ `${workout.distance} км` }}</td>
          <td>{{ workout.trainingTime }}</td>
          <td class="extra-column">{{ workout.averagePace || '-' }}</td>
          <td class="extra-column">{{ workout.heartrate }}</td>
          <td class="extra-column">{{ prettyTemperature(workout.temperature) }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="!workoutsToShow.length" class="workouts__no-data">Нет данных. Возможно, последний фильтр был лишний.</div>
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
    margin-top: var(--indent-double);
  }

  &__table {
    font-size: 0.825rem;

    @media (--viewport-sm) {
      font-size: inherit;
    }

    th, td {
      padding: var(--indent-quarter) var(--indent-half);
      text-align: center;

      @media (--viewport-md) {
        padding: var(--indent-half) var(--indent);
      }
    }

    &-thead {
      background-color: var(--light-gray);
      border-bottom: 1px solid var(--black);
    }

    &-tbody {
      border-top: var(--border);
      border-bottom: var(--border);

      tr {
        transition: background-color var(--animation);

        &:hover {
          background-color: var(--powder-blue);
          cursor: pointer;
        }

        & + & {
          border-top: var(--border);
        }
      }
    }
  }

  &__td {
    display: flex;
    align-items: center;
    gap: var(--indent-half);
  }

  &__span {

    &_toggle {
      display: none;

      @media (--viewport-lg) {
        display: inline;
      }
    }
  }

  &__filters-wrapper {
    display: flex;
  }

  &__no-data {
    text-align: center;
    color: var(--gray);
  }
}
</style>
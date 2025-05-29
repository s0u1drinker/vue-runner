<script setup>
import { storeToRefs } from 'pinia'

const workoutStore = useWorkoutStore()
const { workouts } = storeToRefs(workoutStore)
</script>

<template>
  <div class="workouts">
    <div class="block">
      Какие-нибудь фильтры...
    </div>
    <table class="workouts__table">
      <thead class="workouts__table-thead">
        <tr>
          <th></th>
          <th>Дата</th>
          <th>Дистанция</th>
          <th>Время</th>
          <th class="extra-column">Пульс</th>
          <th class="extra-column">Время круга</th>
          <th class="extra-column">Температура</th>
        </tr>
      </thead>
      <tbody class="workouts__table-tbody">
        <tr v-for="workout in workouts" :key="workout.id" @click="navigateTo(`/workout/${workout.id}`)">
          <td class="workouts__td">
            <Icon :name="workoutStore.getActivityByID(workout.idActivity).icon" />
            <span class="workouts__span_toggle">{{ workoutStore.getActivityByID(workout.idActivity).title }}</span>
          </td>
          <td>{{ prettyDate(workout.dateStart).date }}</td>
          <td>{{ `${workout.distance} км` }}</td>
          <td>{{ workout.trainingTime }}</td>
          <td class="extra-column">{{ workout.heartrate }}</td>
          <td class="extra-column">{{ workout.averagePace }}</td>
          <td class="extra-column">{{ prettyTemperature(workout.temperature) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.workouts {
  display: flex;
  flex-direction: column;
  gap: var(--indent-double);

  &__table {
    font-size: 0.825rem;

    @media (--viewport-sm) {
      font-size: inherit;
    }

    th, td {
      padding: var(--indent-quarter) var(--indent-half);
      text-align: center;
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
}
</style>
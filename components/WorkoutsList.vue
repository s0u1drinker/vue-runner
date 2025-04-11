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
      <thead>
        <tr>
          <th>Дата</th>
          <th>Тип тренировки</th>
          <th>Дистанция</th>
          <th>Время</th>
          <th>Пульс</th>
          <th>Время круга</th>
          <th>Температура</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="workout in workouts" :key="workout.id">
          <td>{{ prettyDate(workout.dateStart).date }}</td>
          <td>{{ workoutStore.getActivityTitleByID(workout.idActivity) }}</td>
          <td>{{ `${workout.distance} км` }}</td>
          <td>{{ workout.trainingTime }}</td>
          <td>{{ workout.heartrate }}</td>
          <td>{{ workout.averagePace }}</td>
          <td>{{ prettyTemperature(workout.weather.temperature) }}</td>
          <td>
            <NuxtLink class="link" :to="`/workout/${workout.id}`">Посмотреть</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.workouts {
  display: flex;
  flex-direction: column;
  gap: var(--indent-double);

  &__table {

    th, td {
      padding: var(--list-item-padding);
      text-align: center;
    }

    thead {
      background-color: var(--light-gray);
      border-bottom: 1px solid var(--black);
    }

    tbody {

      tr {
        transition: background-color var(--animation);

        &:hover {
          background-color: var(--powder-blue);
        }

        & + & {
          border-top: 1px solid var(--light-gray);
        }
      }
    }
  }
}
</style>
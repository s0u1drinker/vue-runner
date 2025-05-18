<script setup lang="ts">
import type { Lap } from '@/types/lap'
import type { LapComputed } from '@/types/lapComputed';

const props = defineProps<{
  laps: Lap[],
  lapDistance: number
}>()

/**
 * Вычисление медленного и быстрого кругов.
 */
const computedLaps = computed(() => {
  let lapSlow: LapComputed = { time: '', seconds: 0 }
  let lapFast: LapComputed = { time: '', seconds: Infinity }
  let lapBar: number = -Infinity

  for(let lap of props.laps) {
    const lapTimeSeconds = timeToSeconds(lap.pace)

    // Вычисляем медленный круг.
    if (lapTimeSeconds > lapBar) {
      lapBar = lapTimeSeconds

      if (lap.distance === props.lapDistance) {
        lapSlow.time = lap.pace
        lapSlow.seconds = lapTimeSeconds
      }
    }

    // Вычисляем быстрый круг.
    if (lapTimeSeconds < lapFast.seconds) {
      lapFast.time = lap.pace
      lapFast.seconds = lapTimeSeconds
    }
  }

  return {
    lapSlow,
    lapFast,
    lapBar
  }
})

/**
 * Возвращает соответствующий класс для медленного и быстрого кругов.
 * @param pace Темп.
 */
function checkClass(pace: string): string | null {
  return pace === computedLaps.value.lapFast.time ? 't-laps__lap_fast' : pace === computedLaps.value.lapSlow.time ? 't-laps__lap_slow' : null
}
</script>

<template>
  <div class="t-laps">
    <table class="t-laps__table">
      <thead class="t-laps__thead">
        <tr>
          <th>Круг</th>
          <th class="t-laps__extra-column">Время круга</th>
          <th>Темп</th>
          <th class="t-laps__extra-column"></th>
          <th>Пульс</th>
          <th>Общее время</th>
        </tr>
      </thead>
      <tbody class="t-laps__tbody">
        <tr v-for="(lap, index) in props.laps" :key="index">
          <td :class="checkClass(lap.pace)">
            {{ `${lap.distance < props.lapDistance ? '<' : ''}${lap.idLap}` }}
          </td>
          <td class="t-laps__extra-column">{{ lap.lapTime }}</td>
          <td :class="checkClass(lap.pace)">{{ lap.pace }}</td>
          <td class="t-laps__extra-column">
            <div class="t-laps__lap-ground">
              <div class="t-laps__lap-bar" :style="{ width: `${getPercent(timeToSeconds(lap.pace), computedLaps.lapBar)}%` }"></div>
            </div>
          </td>
          <td>{{ lap.heartRate }}</td>
          <td>{{ lap.totalTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.t-laps {

  &__tbody {

    & > tr {
      transition: background-color var(--animation);

      &:hover {
        background-color: var(--light-gray);
        cursor: default;
      }
    }
  }

  &__lap {

    &_slow {
      color: var(--dark-red);
      background-color: var(--light-red);
    }

    &_fast {
      color: var(--dark-green);
      background-color: var(--light-green);
    }

    &-ground {
      background-color: var(--powder-blue);
      height: 1em;
      width: 4em;
    }
    
    &-bar {
      background-color: var(--blue);
      height: inherit;
      transition: width var(--animation);
      width: 0;
    }
  }

  &__extra-column {
    display: none;

    @media (--viewport-sm) {
      display: table-cell;
    }
  }
}
</style>
<script setup lang="ts">
import type { Lap } from '@/types/lap'
import type { LapComputed } from '@/types/lapComputed';
import type { TableTHead } from '@/types/tableThead';

const { laps, lapDistance, showControls = false } = defineProps<{
  laps: Lap[],
  lapDistance: number,
  showControls?: boolean,
}>()

const emit = defineEmits<{
  edit: [id: number],
  delete: [id: number]
}>()

/**
 * Заголовки столбцов для таблицы.
 */
const theadList: TableTHead[] = [
  { title: 'Круг', },
  { title: 'Время круга', extraColumn: true, },
  { title: 'Темп', },
  { title: '', extraColumn: true, },
  { title: 'Пульс', },
  { title: 'Общее время', },
]

/**
 * Вычисление медленного и быстрого кругов.
 */
const computedLaps = computed(() => {
  let lapSlow: LapComputed = { time: '', seconds: 0 }
  let lapFast: LapComputed = { time: '', seconds: Infinity }
  let lapBar: number = -Infinity

  for(let lap of laps) {
    const lapTimeSeconds = timeToSeconds(lap.pace)

    // Вычисляем медленный круг.
    if (lapTimeSeconds > lapBar) {
      lapBar = lapTimeSeconds

      if (lap.distance === lapDistance) {
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
          <th
            v-for="(th, index) in theadList"
            :class="{ 'extra-column': th?.extraColumn }"
            :key="`${th.title}-${index}`"
          >{{ th.title }}</th>
          <th v-if="showControls"></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="laps.length > 0">
          <tr class="t-laps__tr" v-for="(lap, index) in laps" :key="index">
            <td :class="checkClass(lap.pace)">
              {{ `${lap.distance < lapDistance ? '<' : ''}${lap.idLap}` }}
            </td>
            <td class="extra-column">{{ lap.lapTime }}</td>
            <td :class="checkClass(lap.pace)">{{ lap.pace }}</td>
            <td class="extra-column">
              <div class="t-laps__lap-ground">
                <div class="t-laps__lap-bar" :style="{ width: `${getPercent(timeToSeconds(lap.pace), computedLaps.lapBar)}%` }"></div>
              </div>
            </td>
            <td>{{ lap.heartRate }}</td>
            <td>{{ lap.totalTime }}</td>
            <td class="t-laps__controls" v-if="showControls">
              <button class="button t-laps__control-button" @click="emit('edit', lap.idLap)">
                <Icon name="material-symbols:edit-square-outline-rounded" />
              </button>
              <button class="button t-laps__control-button" @click="emit('delete', lap.idLap)">
                <Icon name="material-symbols:delete-forever-outline" />
              </button>
            </td>
          </tr>
        </template>
        <tr class="t-laps__tr_no-data" v-else>
          <td :colspan="theadList.length">
            <div class="t-laps__box_no-data">
              <p>Нет данных.</p>
              <button class="button button_blue">Добавить</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.t-laps {

  &__tr {
    transition: background-color var(--animation);

    &:hover {
      background-color: var(--light-gray);
      cursor: default;
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

  &__box {

    &_no-data {
      display: flex;
      flex-direction: column;
      gap: var(--indent-half);
      align-items: center;
      margin-top: var(--indent);
    }
  }

  &__controls {
    display: flex;
    gap: var(--indent-half);
  }

  &__control-button {
    padding: var(--indent-quarter);
    border: 0 none;

    &:hover {
      color: var(--red);
    }
  }
}
</style>
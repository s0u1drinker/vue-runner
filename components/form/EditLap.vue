<script setup lang="ts">
import type { Lap } from '@/types/lap'

// TODO: Объединить с компонентом <FormAddWorkout>.
// TODO: Проверки при сохранении.

const { lap, lapDistance } = defineProps<{
  lap: Lap,
  lapDistance: number,
}>()

const emit = defineEmits<{
  cancel: [],
  save: [lap: Lap]
}>()
// Данные о круге, которые вводит пользователь.
const currentLapValue = reactive<Lap>({ ...lap })
// Сообщение об ошибке.
const errMessage = ref<string>('')
// Количество секунд общего времени.
const totalTimeSeconds = computed(() => {
  return timeToSeconds(lap.totalTime)
})
// Наблюдаем за изменением времени круга, чтобы пересчитать темп и общее время.
watch(() => currentLapValue.lapTime, (newValue) => {
  // Вычисляем темп. Для этого сначала необходимо сравнить дистанцию текущего круга с дистанцией круга, установленной в рамках тренировки.
  if (currentLapValue.distance !== lapDistance) {
    // Не равны. Что ж... необходимо понять как именно они не равны!
    if (currentLapValue.distance < lapDistance) {
      // Если текущее значение меньше - вычисляем темп с помощтю специальной функции.
      currentLapValue.pace = calculatePace(currentLapValue.distance, currentLapValue.lapTime)
    } else if (currentLapValue.distance > lapDistance) {
      // Если больше - громко ругаемся в консоль, ибо при стандартном поведении такое невозможно.
      console.error(`Алгоритм зашёл "не в ту дверь": текущее значение длины круга оказалось больше установленного в рамках тренировки. Необходима помощь техножрецов.`)
    } else {
      // Следствие ведут Колобки...
      console.error('Ничего не понимаю!')
    }
  } else {
    // Всё совпадает, а значит и темп с временем круга тоже совпадают.
    currentLapValue.pace = newValue
  }
  // Вычисляем общее время.
  currentLapValue.totalTime = secondsToTime(totalTimeSeconds.value + timeToSeconds(newValue))
})
// Сохранение формы.
function saveForm() {
  // Проверки...
  emit('save', currentLapValue)
}
</script>

<template>
  <div class="fe-lap">
    <div class="fe-lap__id">{{ `#${currentLapValue.idLap}` }}</div>
    <div class="fe-lap__form">
      <div class="fe-lap__item">
        <span class="fe-lap__title">Круг</span>
        <InputNumber :min="100" :max="lap.distance" :step="100" v-model="currentLapValue.distance" />
      </div>
      <div class="fe-lap__item">
        <span class="fe-lap__title">Пульс</span>
        <InputNumber :min="0" v-model="currentLapValue.heartRate" />
      </div>
      <div class="fe-lap__item">
        <span class="fe-lap__title">Время круга</span>
        <InputTime :showHours="false" v-model:time="currentLapValue.lapTime" />
      </div>
      <div class="fe-lap__item">
        <span class="fe-lap__title">Темп</span>
        <span>{{ currentLapValue.pace }}</span>
      </div>
      <div class="fe-lap__item">
        <span class="fe-lap__title">Общее время</span>
        <span>{{ currentLapValue.totalTime }}</span>
      </div>
      <div class="fe-lap__item">
        <p class="fe-lap__message">{{ errMessage }}</p>
      </div>
      <div class="fe-lap__item fe-lap__buttons">
        <button class="button button_outline_gray" @click="emit('cancel')">Отменить</button>
        <button class="button button_blue" @click="saveForm">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.fe-lap {
  display: flex;
  flex-direction: column;
  gap: var(--indent);
  padding: var(--indent);
  border: var(--border);
  border-radius: .25rem;
  position: relative;
  width: 15rem;

  @media (--viewport-sm) {
    width: auto;
  }

  &::before {
    --size: 5rem;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: var(--size);
    height: var(--size);
    background: radial-gradient(at top left, var(--dark-gray) 0%, var(--white) 75%);
  }

  &__id {
    font-size: 1.5rem;
    font-weight: bold;
    position: relative;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--indent-half);
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--indent-half);
    align-items: center;
    min-height: 1.5rem;

    @media (--viewport-sm) {
      flex-direction: row;
    }
  }

  &__title {
    text-align: center;
    width: 7rem;

    &::after {
      content: ':';
    }

    @media (--viewport-sm) {
      text-align: right;
    }
  }

  &__message {}

  &__buttons {
    justify-content: center;
    flex-direction: row;
    gap: var(--indent);
  }
}
</style>
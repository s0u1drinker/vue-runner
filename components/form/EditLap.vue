<script setup lang="ts">
import type { Lap } from '@/types/lap'

// TODO: Объединить с компонентом <FormAddWorkout>.

const { addModalDialog, openModal, closeModal } = useModalStore()

const { lap, lapDistance } = defineProps<{
  lap: Lap,
  lapDistance: number,
}>()

const emit = defineEmits<{
  cancel: [],
  save: [lap: Lap]
}>()

const idModal = addModalDialog(
  'Не указан пульс',
  'Значение пульса равно "0". Пульсомер сломался или кто-то забыл указать самый важный параметр?',
  {
    confirm: {
      title: 'Всё верно',
      action: emitSave,
    },
    close: {
      title: 'Да, забыл!',
    },
  }
)

const modalStore = useModalStore()
// Количество секунд общего времени при инициализации.
const totalTimeSecondsDefault: number = timeToSeconds(lap.totalTime)
// Количество секунд круга при инициализации.
const lapTimeSecondsDefault: number = timeToSeconds(lap.lapTime)
// Данные о круге, которые вводит пользователь.
const currentLapValue = reactive<Lap>({ ...lap })
// Сообщение об ошибке.
const errMessage = ref<string>('')
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
    currentLapValue.pace = prettyTime(newValue)
  }
  // Вычисляем общее время.
  currentLapValue.totalTime = secondsToTime(timeToSeconds(newValue) - lapTimeSecondsDefault + totalTimeSecondsDefault)
})
// Сохранение формы.
function saveForm() {
  // Проверки...
  if (currentLapValue.distance > 0) {
    if (timeToSeconds(currentLapValue.lapTime) > 0) {
      if (currentLapValue.heartRate > 0) {
        // Отправляем родителю радостную весть об изменениях.
        emitSave()
      } else {
        errMessage.value = 'Не указан пульс.'
        openModal(idModal)
      }
    } else errMessage.value = 'Укажите время круга.'
  } else errMessage.value = 'Укажите дистанцию круга.'
}
// Генерирует событие сохранения данных о круге.
function emitSave() {
  closeModal(idModal)
  emit('save', currentLapValue)
}
</script>

<template>
  <div class="fe-lap">
    <div class="fe-lap__id">{{ `#${currentLapValue.idLap}` }}</div>
    <div class="fe-lap__form">
      <div class="fe-lap__item">
        <span class="fe-lap__title">Круг</span>
        <InputNumber :min="100" :max="lapDistance" :step="100" v-model="currentLapValue.distance" />
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

  &__message {
    text-align: center;
    color: var(--red);
    flex: 1;
    margin: var(--indent-half) 0;
    min-height: 1.5rem;
  }

  &__buttons {
    justify-content: center;
    flex-direction: row;
    gap: var(--indent);
  }
}
</style>
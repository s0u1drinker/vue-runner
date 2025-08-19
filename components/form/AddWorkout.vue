<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { Lap } from '@/types/lap'

// TODO: Объединить с компонентом <FormEditLap>.

const activityList = storeToRefs(useActivityStore()).getActivitiesForSelect
const weatherList = storeToRefs(useWeatherStore()).getActivitiesForSelect

const formData = reactive<Workout>({
  id: '',
  trainingTime: '',
  distance: 0,
  dateStart: '',
  idActivity: '',
  idWeather: '',
  lapDistance: 1000,
  averagePace: '',
  heartrate: 0,
  temperature: 0,
  cadence: 0,
  climb: 0,
  weightBefore: 0,
  weightAfter: 0,
  comment: '',
  laps: [],
})
// Синхронизируем дату между клиентом и сервером.
const today = useState('today', () => new Date())
// Сообщение об ошибке/успешной отправке.
const message = ref<string>('')
// Флаг расчёта данных на основе информации о кругах:
// если пользователь добавил данные о кругах, то некоторые показатели расчитываются автоматически.
const calculationByLaps = computed<boolean>(():boolean => formData.laps.length ? true : false)
// Следим за количествои кругов и пересчитываем некоторые параметры.
watch(formData.laps, () => {
  formData.distance = (calculationByLaps.value) ? getAverageValueOfParameter<number>('distance') : 0
  formData.trainingTime = (calculationByLaps.value) ? getAverageValueOfParameter<string>('totalTime') : ''
  formData.heartrate = (calculationByLaps.value) ? getAverageValueOfParameter<number>('heartRate') : 0
  formData.averagePace = (calculationByLaps.value) ? getAverageValueOfParameter<string>('pace') : ''
})
// Среднее значение параметра из массива "formData.laps".
function getAverageValueOfParameter<T>(parameter: keyof Lap): T {
  console.log(parameter)
  console.log(formData.laps[0][parameter])
  
  return formData.laps[0][parameter] as T
}
// Отправка формы.
function sendForm(): void {
  message.value = 'Форма будет отправлена... не сейчас.'
}
// Очистка формы.
function clearForm(): void {
  message.value = 'Форма будет очищена... скоро.'
}
</script>

<template>
  <form class="form-add" @submit.prevent @keydown.enter.prevent>
    <p class="form-add__temp-message">Извините, данная форма ещё в разработке.</p>
    <div class="form-add__item">
      <div class="form-add__item-title">Активность:</div>
      <SelectCustom
        :list="activityList"
        v-model="formData.idActivity"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Начало:</div>
      <DateTimePicker
        :date="today.toLocaleDateString()"
        :time="today.toLocaleTimeString()"
        v-model="formData.dateStart"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Длина круга (м):</div>
      <InputNumber :min="0" :step="100" v-model="formData.lapDistance" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Круги:</div>
      <LapsAdd :lapDistance="formData.lapDistance" v-model="formData.laps" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Дистанция (км):</div>
      <InputNumber
        :float="2"
        :min="0"
        :disabled="calculationByLaps"
        v-model="formData.distance"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime
        :disabled="calculationByLaps"
        v-model:time="formData.trainingTime"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Средний темп:</div>
      <InputTime
        :showSeconds="false"
        :disabled="calculationByLaps"
        v-model:time="formData.averagePace"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Пульс:</div>
      <InputNumber
        :min="0"
        :disabled="calculationByLaps"
        v-model="formData.heartrate"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Температура:</div>
      <InputNumber :min="-40" :max="60" v-model="formData.temperature" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Погода:</div>
      <CarouselSimple :items="weatherList" v-model="formData.idWeather" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Каденс:</div>
      <InputNumber :min="0" v-model="formData.cadence" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Набор высоты (м):</div>
      <InputNumber :min="0" v-model="formData.climb" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес до:</div>
      <InputNumber :float="1" :min="0" :step="0.1" v-model="formData.weightBefore" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес после:</div>
      <InputNumber :float="1" :min="0" :step="0.1" v-model="formData.weightAfter" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Комментарий:</div>
      <TextareaNative
        :rows="4"
        :placeholder="'Самочувствие / негативные или положительные моменты / обстановка вокруг и т.д. и т.п.'"
        :maxLength="120"
        v-model="formData.comment"
      />
    </div>
    <div class="form-add__item">
      <p class="form-add__message">{{ message }}</p>
    </div>
    <div class="form-add__item form-add__buttons">
      <button class="button button_outline_gray" @click="clearForm">Очистить</button>
      <button type="submit" class="button button_blue" @click="sendForm">Сохранить</button>
    </div>
  </form>
  <pre>{{ formData }}</pre>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.form-add {
  margin-top: var(--indent-double);

  &__temp-message {
    color: var(--red);
    margin-bottom: var(--indent-double);
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--indent-half);
    align-items: flex-start;

    @media (--viewport-sm) {
      flex-direction: row;
      gap: 0;
    }

    & + & {
      margin-top: var(--indent);
    }
  }

  &__item-title {

    @media (--viewport-sm) {
      transform: translateY(50%);
      width: 10rem;
    }
  }

  &__message {
    min-height: 1rem;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    gap: var(--indent);
  }
}
</style>
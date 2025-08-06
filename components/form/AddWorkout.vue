<script setup lang="ts">
import type { Workout } from '@/types/workout'

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
  heartrate: 155,
  temperature: 0,
  cadence: 150,
  climb: 0,
  weightBefore: 85,
  weightAfter: 85,
  comment: '',
  laps: [],
})
// Синхронизируем дату между клиентом и сервером.
const today = useState('today', () => new Date())
// Сообщение об ошибке/успешной отправке.
const message = ref<string>('')
// Отправка формы.
function sendForm(): void {
  message.value = 'Send this form fast!'
}
// Очистка формы.
function clearForm(): void {
  message.value = 'Clear this form fast!'
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
      <InputNumber :float="2" :min="0" v-model="formData.distance" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime v-model:time="formData.trainingTime" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Средний темп:</div>
      <InputTime :showSeconds="false" v-model:time="formData.averagePace" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Пульс:</div>
      <InputNumber :min="0" v-model="formData.heartrate" />
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
      align-items: center;
      gap: 0;
    }

    & + & {
      margin-top: var(--indent);
    }
  }

  &__item-title {

    @media (--viewport-sm) {
      width: 10rem;
    }
  }

  &__message {
    min-height: 1rem;
  }

  &__buttons {
    display: flex;
    gap: var(--indent);
  }
}
</style>
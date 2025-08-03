<script setup lang="ts">
import type { Workout } from '@/types/workout'

const activityList = storeToRefs(useActivityStore()).getActivitiesForSelect
const weatherList = storeToRefs(useWeatherStore()).getActivitiesForSelect

// const formData = reactive<Workout>({
const formData = reactive({
  trainingTime: '',
  distance: 0,
  dateStart: '',
  idActivity: '',
  idWeather: '',
})
// Синхронизируем дату между клиентом и сервером.
const today = useState('today', () => new Date())
// Отправка формы.
function sendForm() {
  console.log('Send this form fast!')
}
// Очистка формы.
function clearForm() {
  console.log('Clear this form fast!')
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
      <div class="form-add__item-title">Дистанция (км):</div>
      <InputNumber :float="2" :min="0" v-model="formData.distance" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime v-model:time="formData.trainingTime" />
    </div>

    <div class="form-add__item">
      <div class="form-add__item-title">Длина круга:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Круги:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Средний темп:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Пульс:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Температура:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Погода:</div>
      <CarouselSimple :items="weatherList" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Каденс:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Набор высоты:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес до:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес после:</div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Комментарий:</div>
    </div>
    <div class="form-add__item form-add__buttons">
      <button class="button button_outline_gray" @click="clearForm">Очистить</button>
      <button type="submit" class="button button_blue" @click="sendForm">Сохранить</button>
    </div>
  </form>
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

  &__buttons {
    display: flex;
    gap: var(--indent);
  }
}
</style>
<script setup lang="ts">
import type { Workout } from '@/types/workout'
import DateTimePicker from './DateTimePicker.vue';
/*
const formData = reactive<Workout>({

})
*/
const formData = reactive({
  trainingTime: '',
  distance: 0,
  dateStart: ''
})
// Синхронизируем дату между клиентом и сервером.
const today = useState('today', () => new Date())
</script>

<template>
  <form class="form-add" @submit.prevent>
    <p class="form-add__temp-message">The form is still under construction. Sorry.</p>
    <div class="form-add__item">
      <div class="form-add__item-title">Активность:</div>
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
}
</style>
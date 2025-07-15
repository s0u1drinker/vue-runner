<script setup lang="ts">
import type { Workout } from '@/types/workout'
import DateTimePicker from './DateTimePicker.vue';
/*
const formData = reactive<Workout>({

})
*/
const time = ref('')
const distance = ref(0)
</script>

<template>
  <form class="form-add">
    <p class="form-add__temp-message">The form is still under construction. Sorry.</p>
    <div class="form-add__item">
      <div class="form-add__item-title">Начало:</div>
      <DateTimePicker />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Дистанция (км):</div>
      <InputNumber :float="2" :min="0" v-model="distance" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime v-model:time="time" />
    </div>
  </form>
</template>

<style scoped>
.form-add {
  margin-top: var(--indent-double);

  &__temp-message {
    color: var(--red);
    margin-bottom: var(--indent-double);
  }

  &__item {
    display: flex;
    align-items: center;

    & + & {
      margin-top: var(--indent);
    }
  }

  &__item-title {
    width: 10rem;
  }
}
</style>
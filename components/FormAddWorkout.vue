<script setup lang="ts">
import type { Workout } from '@/types/workout'
/*
const formData = reactive<Workout>({

})
*/

const distance = ref(0)
</script>

<template>
  <form class="form-add">
    <p class="color_red">The form is still under construction. Sorry.</p>
    <div class="form-add__item">
      <div class="form-add__item-title">Дата:</div>
      <TheDatepicker />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Дистанция (км):</div>
      <InputNumber :float="2" v-model="distance" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime />
    </div>
  </form>
</template>

<style scoped>
.form-add {
  margin-top: var(--indent-double);

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
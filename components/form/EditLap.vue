<script setup lang="ts">
import type { Lap } from '@/types/lap'

// TODO: Объединить с компонентом <FormAddWorkout>.

const { lap } = defineProps<{
  lap: Lap,
}>()

const emit = defineEmits<{
  cancel: [],
  save: [lap: Lap]
}>()
// Данные о круге, которые вводит пользователь.
const currentLapValue = reactive<Lap>({ ...lap })
// Сообщение об ошибке.
const errMessage = ref<string>('')
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
        <InputTime :showHours="false" v-model:time="currentLapValue.pace" />
      </div>
      <div class="fe-lap__item">
        <span class="fe-lap__title">Общее время</span>
        <InputTime v-model:time="currentLapValue.totalTime" />
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
.fe-lap {
  display: flex;
  gap: var(--indent);
  padding: var(--indent);
  border: var(--border);
  border-radius: .25rem;
  position: relative;

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
    gap: var(--indent-half);
    align-items: center;
  }

  &__title {
    text-align: right;
    width: 8rem;

    &::after {
      content: ':';
    }
  }

  &__message {
    min-height: 1rem;
  }

  &__buttons {
    justify-content: center;
    gap: var(--indent);
  }
}
</style>
<script setup lang="ts">
import { onMounted, ref } from 'vue'

const timerTick: number = 1
// Время до редиректа.
let timer: Ref<number> = ref(7)

const textEnding = computed(() => {
  return (timer.value === 1) ? 'у' : (timer.value >= 5) ? '' : 'ы'
})
const timerText = computed(() => {
  return `${timer.value} секунд${textEnding.value}`
})

onMounted(() => {
  const timerId = setInterval(async () => {
    if (timer.value <= 1) {
      clearInterval(timerId);
      await navigateTo('/')
    } else {
      timer.value -= timerTick
    }
  }, timerTick * 1000)
})
</script>

<template>
  <h1>Ошибка!</h1>
  <p>Неверный идентификтаор тренировки.<br />Вы будете перенаправлены на страницу с тренировками через {{ timerText }}...</p>
</template>

<style scoped></style>
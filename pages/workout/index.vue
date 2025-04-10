<script setup lang="ts">
import { onMounted, ref } from 'vue'

const timerTick: number = 1000
// Время до редиректа.
let timer: Ref<number> = ref(5000)

const textEnding = computed(() => {
  return (timer.value === 1000) ? 'у' : (timer.value === 5000) ? '' : 'ы'
})
const timerText = computed(() => {
  return `${timer.value / 1000} секунд${textEnding.value}`
})

onMounted(() => {
  const timerId = setInterval(async () => {
    if (timer.value === 1000) {
      clearInterval(timerId);
      await navigateTo('/')
    } else {
      timer.value -= timerTick
    }
  }, timerTick)
})
</script>

<template>
  <h1>Ошибка!</h1>
  <p>Отсутствует идентификтаор тренировки. Вы будете перенаправлены на главную страницу через {{ timerText }}...</p>
</template>

<style scoped></style>
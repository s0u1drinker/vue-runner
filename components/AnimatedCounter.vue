<script setup lang="ts">
const props = defineProps<{
  start: number,
  end: number,
  duration: number,
  measure?: string,
}>()
// Шаг смены числа.
const step = Math.ceil(props.duration / Math.abs(props.end - props.start))
// Идентификатор таймера.
const intervalId = ref<ReturnType<typeof setTimeout> | null>(null)
// Начальное значение.
const startCount = ref<number>(0)
// Текущее значение.
const currentCount = ref<number>(0)
// Значение для отображения.
const countToDisplay = computed(() => {
  return (props.measure) ? `${currentCount.value}${props.measure}` : currentCount.value
})
/**
 * Магия анимации счетчика.
 */
const animateCounter = () => {
  intervalId.value = setInterval(() => {
    if (currentCount.value < props.end) {
      currentCount.value++
    } else {
      clearInterval(intervalId.value || 0)
    }
  }, step)
}
/**
 * Подготовка и запуск анимации.
 */
const startAnimation = () => {
  // Сбрасываем значения переменных.
  if (intervalId.value) clearInterval(intervalId.value)
  startCount.value = props.start
  currentCount.value = startCount.value
  // Запускаем анимацию.
  animateCounter()
}

onMounted(() => {
  if (typeof props.start === 'number' && typeof props.end === 'number' && typeof props.duration === 'number') {
    startAnimation()
  } else {
    console.error('Один из параметров передан с неверным типом. Ожидались числа.')
  }
})

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value)
})
</script>

<template>
  <div>{{ countToDisplay }}</div>
</template>

<style scoped></style>
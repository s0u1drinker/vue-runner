<script setup lang="ts">
const { showSeconds = true } = defineProps<{
  showSeconds?: boolean
}>()

const time = defineModel('time', {
  type: String,
  default: '00:00:00'
})

const emit = defineEmits(['update:time'])
// Часы.
const hours = ref('00')
// Минуты.
const minutes = ref('00')
// Секунды.
const seconds = ref('00')
// Собираем время.
const computedTime = computed(() => {
  return `${hours.value}:${minutes.value}${showSeconds ? `:${seconds.value}` : ''}`
})
// Обновляем модель при изменении времени.
watch(computedTime, () => {
  emit('update:time', computedTime.value)
})

onMounted(() => {
  // Разбиваем время по символу ":".
  const splitTime = time.value.split(':')
  // Если массив состоит из 2-х или 3-х элементов,
  if ([2, 3].includes(splitTime.length)) {
    // присваиваем значения соответствующим переменным.
    hours.value = splitTime[0]
    minutes.value = splitTime[1]
    if (showSeconds) seconds.value = splitTime[2]
  }
})
</script>

<template>
  <div class="i-time">
    <InputTimeInput
      class="input i-time__input"
      :max="23"
      v-model="hours"
    />
    <span class="i-time__colon">:</span>
    <InputTimeInput
      class="input i-time__input"
      v-model="minutes"
    />
    <template v-if="showSeconds">
      <span class="i-time__colon">:</span>
      <InputTimeInput
      class="input i-time__input"
      v-model="seconds"
    />
    </template>
  </div>
</template>

<style scoped>
.i-time {
  display: flex;
  gap: var(--indent-quarter);
  align-items: center;

  &__input {
    width: 2.25rem;
  }
}
</style>
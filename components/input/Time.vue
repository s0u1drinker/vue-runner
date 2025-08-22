<script setup lang="ts">
const { showSeconds = true, showHours = true, disabled = false } = defineProps<{
  /**
   * Показывать сегмент "СС" (секунды).
   */
  showSeconds?: boolean,
  /**
   * Показывать сегмент "ЧЧ" (часы).
   */
  showHours?: boolean,
  /**
   * Состояние "disabled".
   */
  disabled?: boolean,
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
  return `${showHours ? `${hours.value}:` : ''}${minutes.value}${showSeconds ? `:${seconds.value}` : ''}`
})
// Обновляем модель при изменении времени.
watch(computedTime, () => {
  emit('update:time', computedTime.value)
})

watch(time, () => splitTimeToSegments())

onMounted(() => {
  if (time.value && timeToSeconds(time.value) !== 0 ) splitTimeToSegments()
})
// Разбивает переданное в компонент значение на сегменты и сохраняет в соответствующие переменные.
function splitTimeToSegments(): void {
  // Разбиваем время по символу ":".
  const splitTime = time.value.split(':')
  
  // Если массив состоит из 2-х или 3-х элементов,
  if ([2, 3].includes(splitTime.length)) {
    // присваиваем значения соответствующим переменным.
    if (showHours) {
      hours.value = splitTime[0]
      minutes.value = splitTime[1]
      if (showSeconds) seconds.value = splitTime[2]
    } else {
      const index = splitTime.length === 2 ? 0 : 1

      minutes.value = splitTime[index]
      if (showSeconds) seconds.value = splitTime[index + 1]
    }
  }
}
</script>

<template>
  <div
    class="i-time"
    :class="{ 'i-time_disabled': disabled }"
  >
    <template v-if="showHours">
      <InputTimeSegment
        class="input i-time__input"
        :max="23"
        :disabled
        v-model="hours"
      />
      <span class="i-time__colon">:</span>
    </template>
    <InputTimeSegment
      class="input i-time__input"
      :disabled
      v-model="minutes"
    />
    <template v-if="showSeconds">
      <span class="i-time__colon">:</span>
      <InputTimeSegment
        class="input i-time__input"
        :disabled
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

  &_disabled {
    color: var(--dark-gray);

    & > .i-time__input {
      border-color: var(--light-gray);
      color: var(--dark-gray);
    }
  }

  &__input {
    width: 2.25rem;
  }
}
</style>
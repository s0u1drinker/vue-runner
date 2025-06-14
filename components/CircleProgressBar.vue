<script setup lang="ts">
const { title = '', progress = 0 } = defineProps<{
  title?: string,
  progress: number,
}>()

const radius = 70
// Длина окружности.
const circumference = Math.ceil(2 * 3.14 * radius)
// Вычисление отступа на основании переданного значения props.progress.
const offset = circumference * ((100 - progress) / 100)
// Флаг анимации до зеленого цвета.
const flagGreen = ref(false)
// Флаг анимации до желтого цвета.
const flagYellow = ref(false)
// Смещение обводки. Если 0 - круг заполнен.
const progressOffset = ref(circumference)

onMounted(() => {
  // Установка цвета и смещения.
  if (progress >= 100) {
    flagGreen.value = true
    progressOffset.value = 0
  } else if (progress >= 0) {
    flagYellow.value = (progress >= 50)
    progressOffset.value = offset
  } else {
    console.error(`Передано некорректное значение для отображения: ${progress}. Ожидалось число от 0 до 100.`)
  }
})
</script>

<template>
  <div class="c-prog-bar">
    <div class="c-prog-bar__title">
      <slot name="title" v-if="$slots.title"></slot>
      <template v-else>{{ title }}</template>
    </div>
    <div class="c-prog-bar__progress">
      <svg viewBox="0 0 160 160">
        <circle
          class="c-prog-bar__circle"
          :r="radius"
          cx="80"
          cy="80"
          stroke="var(--light-gray)"
        ></circle>
        <circle
          class="c-prog-bar__circle c-prog-bar__circle_progress"
          :class="{ 'c-prog-bar__circle_progress_yellow': flagYellow, 'c-prog-bar__circle_progress_green': flagGreen }"
          :r="radius"
          cx="80"
          cy="80"
          :stroke-dashoffset="progressOffset"
          :stroke-dasharray="circumference"
        ></circle>
      </svg>
      <AnimatedCounter class="c-prog-bar__counter" :start="0" :end="progress" :duration="2000" measure="%" />
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

@keyframes greenProgress {
  50% { stroke: yellow; }
  100% { stroke: var(--green); }
}

@keyframes yellowProgress {
  100% { stroke: yellow; }
}

.c-prog-bar {

  &__title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: pre-wrap;
    gap: var(--indent-quarter);
  }

  &__progress {
    width: 7rem;
    height: 7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: var(--indent);

    @media (--viewport-md) {
      width: 8rem;
      height: 8rem;
    }
  }

  &__circle {
    fill: transparent;
    stroke-width: var(--indent);

    &_progress {
      transform-origin: center;
      transform: rotate(-90deg);
      transition: stroke-dashoffset 2s linear;
      stroke: var(--red);

      &_yellow {
        animation: yellowProgress 2s linear forwards;
      }

      &_green {
        animation: greenProgress 2s linear forwards;
      }
    }
  }

  &__counter {
    position: absolute;
    font-size: var(--indent-and-half);
  }
}
</style>
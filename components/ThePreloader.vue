<script setup lang="ts">
const { type = 'dots' } = defineProps<{
  type?: string
}>()
</script>

<template>
  <div
    class="preloader"
    :class="[ `preloader_${type}` ]"
  >
    <template v-if="type === 'dots'">
      <span class="preloader__dot preloader__dot_1">.</span>
      <span class="preloader__dot preloader__dot_2">.</span>
      <span class="preloader__dot preloader__dot_3">.</span>
    </template>
  </div>
</template>

<style scoped>
@keyframes dot-bounce {
  0% { top: 0; }
  25% { top: -.5rem; }
  50% { top: -1rem; }
  75% { top: -.5rem; }
  100% { top: 0; }
}

@keyframes blink {
  0%   { opacity: 1; }
  50%  { opacity: 0.25; }
  100% { opacity: 1; }
}

.preloader {
  --animation-time: 1.5s;

  &__dot {
    position: relative;
    transition: top .5s linear;

    &_1 {
      animation: dot-bounce var(--animation-time) linear alternate infinite;
    }

    &_2 {
      animation: dot-bounce var(--animation-time) linear alternate infinite .25s;
    }

    &_3 {
      animation: dot-bounce var(--animation-time) linear alternate infinite .5s;
    }
  }

  &_blink {
    background-color: var(--dark-gray);
    animation: blink 2s ease-out infinite;
  }
}
</style>
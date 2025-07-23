<script setup lang="ts">
const { disablePrev = false, disableNext = false, text } = defineProps<{
  disablePrev?: boolean,
  disableNext?: boolean,
  text: string | number,
}>()

const emit = defineEmits(['clickPrev', 'clickNext'])
// Размер иконки.
const size = '1rem'
</script>

<template>
  <div class="c-selector">
    <button
      class="c-selector__button button button_outline_gray"
      @click="emit('clickPrev')"
      :disabled="disablePrev"
    >
      <Icon name="material-symbols:chevron-left" :size />
    </button>
    <span class="c-selector__text">{{ text }}</span>
    <button
      class="c-selector__button button button_outline_gray"
      @click="emit('clickNext')"
      :disabled="disableNext"
    >
      <Icon name="material-symbols:chevron-right" :size />
    </button>
  </div>
</template>

<style scoped>
.c-selector {
  display: flex;

  &__text {
    flex: 1;
    align-content: center;
    text-align: center;
    border: var(--border);
    user-select: none;
  }

  &__button {

    &:first-child {
      border-radius: .25rem 0 0 .25rem;
      border-right: 0 none;
    }

    &:last-child {
      border-radius: 0 .25rem .25rem 0;
      border-left: 0 none;
    }
  }
}
</style>
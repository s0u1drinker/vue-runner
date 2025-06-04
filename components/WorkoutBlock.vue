<script setup lang="ts">
import type { Indicator } from '@/types/indicator';

const props = defineProps<Indicator>()
</script>

<template>
  <div class="block w-block" v-if="props.indicator">
    <div class="w-block__title">
      <Icon v-if="props.icon" class="w-block__icon" :name="props.icon" size="1.25rem" />
      {{ props.title }}
    </div>
    <div class="w-block__indicator">{{ props.indicator }}</div>
  </div>
</template>

<style lang="postcss" scoped>
@import '@/assets/css/media.postcss';

.w-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--indent-quarter);
  min-width: 6rem;

  @media (--viewport-sm) {
    min-width: 7rem;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--indent-quarter);
    color: var(--gray);
  }

  &__icon {
    fill: var(--gray);
  }
}
</style>
<script setup lang="ts">
import type { Indicator } from '@/types/indicator';

const props = defineProps<Indicator>()
</script>

<template>
  <div class="block-indicator" v-if="props.indicator">
    <div class="block-indicator__title">
      <Icon v-if="props.icon" class="block-indicator__icon" :name="props.icon" size="1.25rem" />
      {{ props.title }}
    </div>
    <div class="block-indicator__indicator">{{ props.indicator }}</div>
  </div>
</template>

<style lang="postcss" scoped>
@import '@/assets/css/media.postcss';

.block-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--indent-quarter);
  min-width: 6rem;
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--indent-three-quarters);

  @media (--viewport-sm) {
    padding: var(--indent);
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
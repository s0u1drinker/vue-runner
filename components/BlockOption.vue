<script setup lang="ts">
const { title } = defineProps<{
  title: string,
}>()
</script>

<template>
  <div class="block-option">
    <h3>{{ title }}</h3>
    <div class="block-option__inner">
      <slot>
        <span class="block-option__empty-slot">Список пуст</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.block-option {
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--indent-three-quarters);

  @media (--viewport-sm) {
    padding: var(--indent);
  }

  &__inner {
    margin-top: var(--indent);
    display: flex;
    flex-direction: column;
    gap: var(--indent);

    @media (--viewport-sm) {
      margin-top: var(--indent-double);
      flex-direction: row;
    }

    & > * + * {
      border-top: var(--border);
      padding: var(--indent-three-quarters) 0 0 0;

      @media (--viewport-sm) {
        border-top: 0 none;
        border-left: var(--border);
        padding: 0 0 0 var(--indent-three-quarters);
      }
    }
  }

  &__empty-slot {
    color: var(--gray);
    font-style: italic;
  }
}
</style>
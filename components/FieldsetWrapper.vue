<script setup lang="ts">
const { legend } = defineProps<{
  legend: string
}>()
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset__legend">{{ legend }}</legend>
    <slot></slot>
  </fieldset>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.fieldset {
  border-radius: .25rem;
  padding: var(--indent);

  &__legend {
    font-weight: bold;
    text-align: center;
    font-size: 1rem;
    padding: 0 var(--indent-half);

    @media (--only-sm) {
      position: sticky;
      top: 0;
      width: 100%;
      background-color: var(--white);
      padding: var(--indent-half);
      z-index: 1;
    }

    @media (--viewport-md) {
      text-align: left;
    }
  }
}
</style>
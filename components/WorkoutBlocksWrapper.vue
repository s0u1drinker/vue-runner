<script setup lang="ts">
import type { Indicator } from '@/types/indicator'

const props = defineProps<{
  indicators: Array<Indicator>
}>()
</script>

<template>
  <WorkoutBlock
    v-for="(indicator, index) in props.indicators"
    :key="index"
    :icon="indicator.icon || ''"
    :title="indicator.title"
    :indicator="indicator.indicator"
  />
</template>

<style scoped></style>
<script setup lang="ts">
import type { Indicator } from '@/types/indicator';

const props = defineProps<Indicator>()
</script>

<template>
  <div class="w-block">
    <template v-if="props.icon">
      <Icon :name="`custom-icons:${props.icon}`" class="w-block__icon" />
    </template>
    <span class="w-block__title" v-else>{{ props.title }}</span>
    <span class="w-block__indicator">{{ props.indicator }}</span>
  </div>
</template>

<style scoped>
.w-block {}
</style>
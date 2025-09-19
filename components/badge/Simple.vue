<script setup lang="ts">
const { text } = defineProps<{ text: string }>()
</script>

<template>
  <div class="badge">{{ text }}</div>
</template>

<style scoped>
.badge {
  background-color: var(--light-gray);
  padding: var(--indent-quarter) var(--indent-half);
  border-radius: .25rem;
}
</style>
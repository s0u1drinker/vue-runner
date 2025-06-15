<script setup lang="ts">
  const { header, body, link = '/stat', linkText = 'Не задана цель.' } = defineProps<{
    header: string,
    body: string,
    link?: string,
    linkText?: string,
  }>()
</script>

<template>
  <span class="bold">{{ header }}</span>
  <span v-if="body">{{ body }}</span>
  <NuxtLink class="link" :to="link" v-else>{{ linkText }}</NuxtLink>
</template>

<style scoped></style>
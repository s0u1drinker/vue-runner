<script setup lang="ts">
const route = useRoute()

const idWorkout = route.params.id
</script>

<template>
  <h1>Тренировка #{{ idWorkout }}</h1>
</template>

<style scoped></style>
<script setup lang="ts">
const route = useRoute()
const workoutStore = useWorkoutStore()

const idWorkout = route.params.id as string
const workout = workoutStore.getWorkoutByID(idWorkout)

definePageMeta({
  middleware: ["route-workout"]
})
</script>

<template>
  <h1>Данные о тренировке</h1>
  {{ workout }}
</template>

<style scoped></style>
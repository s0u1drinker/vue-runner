<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from '@/stores/workoutStore'
// Components
import WorkoutsList from '@/components/WorkoutsList.vue'

const workoutStore = useWorkoutStore()
const { isLoadingData, error } = storeToRefs(workoutStore)
</script>

<template>
  <h1>Тренировки</h1>
  <span v-if="isLoadingData">Загрузка данных...</span>
  <span v-else-if="error.flag">{{ error.text }}</span>
  <WorkoutsList v-else />
</template>

<style scoped></style>
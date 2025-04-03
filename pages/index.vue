<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWorkoutStore } from '@/stores/workoutStore';

const workoutStore = useWorkoutStore();
const { workouts, isLoadingData } = storeToRefs(workoutStore);
</script>

<template>
  <h1>Статистика</h1>
  <span v-if="isLoadingData">Загрузка данных...</span>
  {{ workouts }}
</template>

<style scoped></style>
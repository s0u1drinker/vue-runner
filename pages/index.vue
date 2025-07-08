<script setup lang="ts">
const appStore = useAppStore()
const { isLoadingData, error } = storeToRefs(appStore)
</script>

<template>
  <h1>Тренировки</h1>
  <span v-if="isLoadingData">Загрузка данных...</span>
  <span v-else-if="error.flag">{{ error.text }}</span>
  <template v-else>
    <CurrentStatistic />
    <WorkoutsList />
  </template>
</template>

<style scoped></style>
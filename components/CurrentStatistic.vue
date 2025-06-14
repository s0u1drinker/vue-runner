<script setup lang="ts">
  const workoutStore = useWorkoutStore()
  // Текущая дата.
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const weekNumber = today.getWeekNumber()
  // Статистика.
  const yearStatistic = workoutStore.getYearStatistic(year)
  const monthStatistic = workoutStore.getMonthStatisticByMonth(year, month)
  const weekStatistic = workoutStore.getWeekStatisticByWeekNumber(year, weekNumber)
  // Заголовки.
  const yearTitle = ref('')
  const monthTitle = ref('')
  const weekTitle = ref('')
  // Прогресс.
  const yearProgress = ref(0)
  const monthProgress = ref(0)
  const weekProgress = ref(0)

  if (yearStatistic) {
    yearTitle.value = `${yearStatistic.completedDistance} км / ${yearStatistic.goalDistance} км`
    yearProgress.value = getPercent(yearStatistic.completedDistance, yearStatistic.goalDistance, 0)
  } else {
    console.error('Не получены данные о годовой статистике.')
  }
  if (monthStatistic) {
    monthTitle.value = `${monthStatistic.completedDistance} км / ${monthStatistic.goalDistance} км`
    monthProgress.value = getPercent(monthStatistic.completedDistance, monthStatistic.goalDistance, 0)
  } else {
    console.error('Не получены данные о статистике за месяц.')
  }
  if (weekStatistic) {
    weekTitle.value = `${weekStatistic.completedDistance} км / ${weekStatistic.goalDistance} км`
    weekProgress.value = getPercent(weekStatistic.completedDistance, weekStatistic.goalDistance, 0)
  } else {
    console.error('Не получены данные о статистике за неделю.')
  }
</script>

<template>
  <div class="current-stat">
    <CircleProgressBar :progress="weekProgress">
      <template #title>
        <span class="bold">На этой неделе:</span>
        <span v-if="weekTitle">{{ weekTitle }}</span>
      </template>
    </CircleProgressBar>
    <CircleProgressBar :progress="monthProgress">
      <template #title>
        <span class="bold">В этом месяце:</span>
        <span v-if="monthTitle">{{ monthTitle }}</span>
      </template>
    </CircleProgressBar>
    <CircleProgressBar :progress="yearProgress">
      <template #title>
        <span class="bold">В этом году:</span>
        <span v-if="yearTitle">{{ yearTitle }}</span>
      </template>
    </CircleProgressBar>
  </div>
</template>

<style scoped>
.current-stat {
  margin-top: var(--indent-double);
  display: flex;
  gap: var(--indent-double);
  flex-wrap: wrap;
}
</style>
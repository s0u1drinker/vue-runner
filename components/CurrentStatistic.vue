<script setup lang="ts">
  const goalStore = useGoalStore()
  // Текущая дата.
  const year = TODAY_DATE.getFullYear()
  const month = TODAY_DATE.getMonth()
  const weekNumber = TODAY_DATE.getWeekNumber()
  // Статистика.
  const goalYear = goalStore.getGoalForYear(year)
  const goalMonth = goalStore.getGoalForMonth(year, month)
  const goalWeek = goalStore.getGoalForWeek(year, weekNumber)
  // Заголовки.
  const yearTitle = ref('')
  const monthTitle = ref('')
  const weekTitle = ref('')
  // Прогресс.
  const yearProgress = ref(0)
  const monthProgress = ref(0)
  const weekProgress = ref(0)

  if (goalYear) {
    yearTitle.value = `${goalYear.completedDistance} км / ${goalYear.goalDistance} км`
    yearProgress.value = getPercent(goalYear.completedDistance, goalYear.goalDistance, 0)
  } else {
    console.error('Не получены данные о цели на год.')
  }
  if (goalMonth) {
    monthTitle.value = `${goalMonth.completedDistance} км / ${goalMonth.goalDistance} км`
    monthProgress.value = getPercent(goalMonth.completedDistance, goalMonth.goalDistance, 0)
  } else {
    console.error('Не получены данные о цели на месяц.')
  }
  if (goalWeek) {
    weekTitle.value = `${goalWeek.completedDistance} км / ${goalWeek.goalDistance} км`
    weekProgress.value = getPercent(goalWeek.completedDistance, goalWeek.goalDistance, 0)
  } else {
    console.error('Не получены данные о цели на неделю.')
  }
</script>

<template>
  <div class="current-stat">
    <CircleProgressBar :progress="weekProgress">
      <template #title>
        <ChartTitle header="На этой неделе:" :body="weekTitle" />
      </template>
    </CircleProgressBar>
    <CircleProgressBar :progress="monthProgress">
      <template #title>
        <ChartTitle header="В этом месяце:" :body="monthTitle" />
      </template>
    </CircleProgressBar>
    <CircleProgressBar :progress="yearProgress">
      <template #title>
        <ChartTitle header="В этом году:" :body="yearTitle" />
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
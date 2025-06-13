<script setup lang="ts">
  // Номер текущей недели.
  const currentWeekNumber: number = (new Date()).getWeekNumber()
</script>

<template>
  <div class="current-stat">
    <CircleProgressBar title="На этой неделе" :progress="25" />
    <CircleProgressBar title="В этом месяце" :progress="50" />
    <CircleProgressBar title="В этом году" :progress="100" />
  </div>
</template>

<style scoped>
.current-stat {
  margin-top: var(--indent-double);
}
</style>
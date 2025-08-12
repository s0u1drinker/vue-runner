<script setup></script>

<template>
  <h1>Статистика</h1>
  <div class="stat-box">
    <TotalStatisticBlock />
    <AchievementBlock />
  </div>
  <GoalsBlock />
  <CompareBlock />
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.stat-box {
  margin-top: var(--indent-double);
  display: flex;
  flex-direction: column;
  gap: var(--indent-double);
  align-items: center;

  @media (--viewport-sm) {
    justify-content: center;
  }

  @media (--viewport-lg) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
}
</style>
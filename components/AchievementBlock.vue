<script setup lang="ts">
const achievements = storeToRefs(useAchievementStore()).achievements
</script>

<template>
  <FieldsetWrapper class="achievements" legend="Достижения">
    <AchievementRating
      v-for="rating in achievements"
      :title="rating.title"
      :rating="rating.rating"
    />
  </FieldsetWrapper>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.achievements {
  display: flex;
  gap: var(--indent);
  flex-direction: column;
  align-items: center;
  max-width: 45rem;

  @media (--viewport-sm) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  & > legend {
    color: red;
  }
}
</style>
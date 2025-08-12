<script setup lang="ts">
const statistic = storeToRefs(useStatisticStore()).total
// Заголовки статистических параметров.
const titles = {
  workouts: 'Тренировки',
  time: 'Общее время',
  distance: 'Дистанция',
}
</script>

<template>
  <FieldsetWrapper class="t-stat" legend="За всё время">
    <ul class="t-stat__list">
      <li class="t-stat__item" v-for="(param, index) in titles" :key="`${statistic.id}-${index}`">
        <span class="t-stat__title">{{ `${titles[index]}:` }}</span>
        <span class="t-stat__value">{{ statistic[index] || '' }}{{ (index === 'distance') ? ' км' : '' }}</span>
      </li>
    </ul>
  </FieldsetWrapper>
</template>

<style scoped>
.t-stat {
  
  &__item {
    display: flex;
    gap: var(--indent-half);

    & + & {
      margin-top: var(--indent);
    }

    &:hover {

      .t-stat__value {
        color: var(--red);
      }
    }
  }

  &__title {
    font-weight: bold;
    width: 7rem;
  }

  &__value {
    transition: color var(--animation);
  }
}
</style>
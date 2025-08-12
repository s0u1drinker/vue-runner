<script setup lang="ts">
import type { AchievementRating } from '@/types/achievementRating'

const { title, rating } = defineProps<{
  title: string,
  rating: AchievementRating[]
}>()
</script>

<template>
  <div class="a-rating">
    <div class="a-rating__title">{{ title }}</div>
    <ul class="a-rating__rating">
      <li
        class="a-rating__position"
        v-for="i in 3"
        :key="i"
      >
        <div
          class="a-rating__place"
          :class="`a-rating__place_${i}`"
        >{{ i }}</div>
        <div class="a-rating__data">
          <template v-if="rating[i-1]">
            {{ rating[i-1].time }} (<NuxtLink class="link" :to="`/workout/${rating[i-1].idWorkout}`">{{ rating[i-1].workoutDate }}</NuxtLink>)
          </template>
          <template v-else>
            <span class="color_gray italic">Нет данных</span>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.a-rating {
  border: var(--border);
  border-radius: .25rem;
  overflow: hidden;
  width: 13rem;

  &__title {
    text-align: center;
    font-weight: bold;
    padding: var(--indent-half);
    background-color: var(--light-gray);
    border-bottom: var(--border);
  }

  &__position {
    display: flex;
    align-items: center;
    gap: var(--indent-half);
    padding: var(--indent-half);

    & + & {
      border-top: var(--border);
    }
  }

  &__place {
    background-color: var(--red);
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 50%;

    &_1 {
      background-color: var(--gold);
    }

    &_2 {
      background-color: var(--silver);
    }

    &_3 {
      background-color: var(--bronze);
    }
  }
}
</style>
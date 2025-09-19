<script setup lang="ts">

const badgeStore = useBadgeStore()
const badges = badgeStore.getBadgeComments
// Список выбранных элементов.
const checkedBadges = defineModel<string[]>({ default: [] })
</script>

<template>
  <div class="badges-wrapper">
    <BadgeCheckbox
    v-for="badge in badges"
    :id="badge.id"
    :text="badge.text"
    icon="material-symbols:check-rounded"
    :key="badge.id"
    v-model="checkedBadges"
    />
  </div>
</template>

<style scoped>
.badges-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--indent-half);
}
</style>
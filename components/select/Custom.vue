<script setup lang="ts">
import type { SelectCustomOptions } from '@/types/selectCustomOptions'

const { list } = defineProps<{
  list: SelectCustomOptions[]
}>()

// Выбранное значение.
const selectValue = defineModel()
</script>

<template>
  <div class="c-select">
    <div class="c-select__select">
      <div class="c-select__value"></div>
      <Icon name="material-symbols:arrow-drop-down-rounded" size="1.25rem" />
    </div>
    <div class="c-select__dropdown">
      <ul class="c-select__list">
        <li
          class="c-select__item"
          v-for="item in list"
          :key="item.value"
          @click="selectValue = item.value"
        >
          <Icon :name="item.icon" v-if="item.icon" />
          <span class="c-select__item-text">{{ item.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
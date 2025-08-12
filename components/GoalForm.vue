<script setup lang="ts">
import type { SelectCustomOptions } from '@/types/selectCustomOptions';

const { type } = defineProps<{
  type: 'year' | 'month' | 'week',
}>()

const iconSize = '1.25rem'
// Флаг редактирования данных.
const editFlag = ref<boolean>(false)
// Список элементов для карусели.
const items = ref<SelectCustomOptions[]>([ { value: '', label: '' } ])
// Текущий период.
const period = ref<string>('')
// Проверяем переданный "type" и присваеиваем новый список элементов для карусели.
switch (type) {
  case 'year':
    items.value = YEARS_FOR_SELECT
    break
  case 'month':
    items.value = MONTHS_FOR_SELECT
    break
  case 'week':
    break
  default:
    console.error(`Передан неверный тип для цели: ${type}`)
    break
}
</script>

<template>
  <div class="goal">
    <div class="goal__header">
      <span class="goal__title"></span>
      <CarouselSimple :items v-model="period" />
    </div>
    <div class="goal__value"></div>
    <div class="goal__buttons">
      <button class="button button_blue">Изменить</button>
      <button class="button button_blue">
        <Icon name="material-symbols:save-rounded" :size="iconSize" />
      </button>
      <button class="button color_red">
        <Icon name="material-symbols:cancel-rounded" :size="iconSize" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
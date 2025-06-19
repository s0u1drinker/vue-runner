<script setup lang="ts">
import type { RadioGroupValues } from '@/types/radioGroupValues'

const { name, items, checked = 0 } = defineProps<{
  name: string,
  items: RadioGroupValues[],
  checked?: number,
}>()

const emit = defineEmits<{
  changeValue: [ value: string ]
}>()
// Выбранное значение.
const elementValue = ref('')

watch(elementValue, () => {
  emit('changeValue', elementValue.value)
})

onMounted(() => {
  elementValue.value = items[checked].radioValue
})
</script>

<template>
  <div class="rg-buttons">
    <label
      class="rg-buttons__button"
      role="button"
      :tabindex="index"
      :aria-label="item.label"
      v-for="(item, index) in items"
      :key="item.radioValue"
    >
      <input
        type="radio"
        class="rg-buttons__radio"
        :name
        :value="item.radioValue"
        :checked="index === checked"
        v-model="elementValue"
      >
      <span class="rg-buttons__text">{{ item.label }}</span>
    </label>
  </div>
</template>

<style scoped>
.rg-buttons {
  display: flex;
  border: var(--border);
  border-radius: var(--indent-quarter);
  background-color: var(--white);
  width: fit-content;

  &__button {
    padding: var(--indent-half) var(--indent-three-quarters);
    transition:
      color var(--animation),
      background-color var(--animation);

    &:hover {
      background-color: var(--light-gray);
    }

    &:has(.rg-buttons__radio:checked) {
      background-color: var(--dark-gray);
      color: var(--white);
    }

    & + & {
      border-left: 1px solid var(--dark-gray);
    }
  }

  &__radio {
    display: none;
  }
}
</style>
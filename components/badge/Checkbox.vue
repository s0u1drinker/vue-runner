<script setup lang="ts">
import type { Badge } from '@/types/badge'

const { id, text, icon } = defineProps<Badge>()

const model = defineModel<string[]>({ default: [] })
// Флаг выбора checkbox.
const isChecked = computed({
  get: () => model.value.includes(text),
  set: (newValue) => {
    if (newValue) {
      // Если идентификатора выбранного checkbox нет в списке, то добавляем.
      if (!model.value.includes(text)) {
        model.value = [...model.value, text]
      }
    } else {
      // Убираем текущий идентификатор из списка.
      model.value = model.value.filter((item) => item !== text)
    }
  }
})
</script>

<template>
  <label class="badge-cb">
    <span class="badge-cb__text">{{ text }}</span>
    <Icon
      class="badge-cb__icon"
      :name="icon"
      :style="{ 'color': isChecked ? 'white' : 'transparent' }"
    />
    <input
      class="badge-cb__checkbox"
      type="checkbox"
      :value="id"
      v-model="isChecked"
    >
  </label>
</template>

<style scoped>
.badge-cb {
  display: flex;
  gap: var(--indent-half);
  align-items: center;
  border: 1px solid var(--light-gray);
  padding: var(--indent-quarter) var(--indent-half);
  border-radius: .25rem;
  background-color: transparent;
  transition: border-color .25s ease-out, background-color .25s ease-out;

  &:hover {
    border-color: var(--dark-gray);
  }

  &:has(.badge-cb__checkbox:checked) {
    background-color: var(--light-green);
    border-color: var(--green);

    &:hover {
      border-color: var(--dark-green);
    }

    .badge-cb__icon {
      background-color: var(--green);
    }
  }

  &__icon {
    background-color: var(--light-gray);
    padding: var(--indent-quarter);
    border-radius: 50%;
    transition: color .25s ease-out;
  }

  &__checkbox {
    display: none;
  }
}
</style>
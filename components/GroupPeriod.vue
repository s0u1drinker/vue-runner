<script setup lang="ts">
import type { RadioGroupValues } from '@/types/radioGroupValues'

// FIXME: Компоненты <FilterPeriod> и <GroupPeriod> очень похожи. Можно попытаться объединить.

const emit = defineEmits<{
  groupBy: [ value: string | null ]
}>()

const periods: RadioGroupValues[] = [
  { radioValue: 'year', label: 'Год', },
  { radioValue: 'month', label: 'Месяц', },
  { radioValue: 'week', label: 'Неделя', },
]
// Флаг отображения RadioGroupButtons.
const showOptions = ref<boolean>(false)
// Параметр, по которому осуществляется группировка.
const groupPeriod = ref(null)
// Класс кнопки добавить/удалить.
const controlButtonClass = computed<string>(() => {
  return showOptions.value ? 'button_red' : 'button_blue'
})
// При изменении параметра группировки генерируется событие.
watch(groupPeriod, () => {
  emit('groupBy', groupPeriod.value)
})
// Показать/скрыть настройки.
function toggleOptions(): void {
  showOptions.value = !showOptions.value
  
  if (!showOptions.value) {
    groupPeriod.value = null
  }
}
</script>

<template>
  <div class="g-period">
    <div class="g-period__header">
      <span class="g-period__title">Период</span>
      <div class="g-period__control">
        <button class="button" :class="controlButtonClass" @click="toggleOptions">
          <span class="g-period__button-text" :class="{ 'g-period__button-text_rotate': showOptions }">+</span>
        </button>
      </div>
    </div>
    <div class="g-period__inner" :class="{ 'g-period__inner_show': showOptions }">
      <RadioGroupButtons
        name="group-period"
        :items="periods"
        v-model="groupPeriod"
      />
    </div>
  </div>
</template>

<style scoped>
.g-period {
  --button-size: 1.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    gap: var(--indent);
    align-items: center;
  }

  &__title {
    font-weight: bold;
  }

  &__control {

    button {
      width: var(--button-size);
      height: var(--button-size);
      font-size: 1.25rem;
      padding: 0;
    }
  }

  &__button-text {
    transition: rotate var(--animation);
    width: var(--button-size);
    height: var(--button-size);

    &_rotate {
      rotate: 45deg;
    }
  }

  &__inner {
    margin-top: var(--indent-half);
    height: 0;
    opacity: 0;
    overflow: hidden;
    transition: opacity var(--animation), height var(--animation);

    &_show {
      height: auto;
      opacity: 1;
    }
  }
}
</style>
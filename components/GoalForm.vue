<script setup lang="ts">
const { showEditButton = false, inProgress = false } = defineProps<{
  showEditButton: boolean,
  inProgress: boolean,
}>()
const emit = defineEmits<{
  // Информация об изменении значения. Возвращаем старое значение на случай ошибки.
  valueChanged: [oldValue: number],
}>()
const goalValue = defineModel<number>({ default: 0 })
// Размер иконок.
const iconSize = '1.15rem'
// Флаг редактирования данных.
const editFlag = ref<boolean>(false)
// Новое значение цели.
const newGoalValue = ref<number>(0)
// Текстовое значение цели.
const textGoalValue = computed<string>(() => (goalValue.value === -1) ? '-' : `${goalValue.value} км`)
// Редактирование цели.
function editGoal(): void {
  // Присваиваем новое значение или 0.
  newGoalValue.value = (goalValue.value < 1) ? 0 : (isNaN(goalValue.value)) ? 0 : goalValue.value
  // Показываем форму редактрования.
  editFlag.value = true
}
// Сохранение цели.
function saveGoal(): void {
  const oldValue = goalValue.value
  // Присваиваем модели новое значение.
  goalValue.value = newGoalValue.value
  // Сообщаем родителю, что данные в БД нужно обновить.
  emit('valueChanged', oldValue)
  closeForm()
}
// Закрываем форму.
function closeForm(): void {
  editFlag.value = false
}
</script>

<template>
  <div class="g-form">
    <div class="g-form__show" v-if="!editFlag">
      {{ textGoalValue }}
      <button
        class="button button_blue g-form__button"
        aria-label="Изменить"
        @click="editGoal"
        v-show="showEditButton"
      >
        <Icon :name="inProgress ? 'svg-spinners:clock' : 'material-symbols:edit-outline-rounded'" :size="iconSize" />
      </button>
    </div>
    <div class="g-form__edit" v-else>
      <InputNumber :min="0" v-model="newGoalValue" />
      <div class="g-form__buttons-wrapper">
        <button
          class="button button_blue g-form__button"
          aria-label="Сохранить"
          @click="saveGoal"
        >
          <Icon name="material-symbols:save-rounded" :size="iconSize" />
        </button>
        <button
          class="button button_red g-form__button"
          aria-label="Отменить"
          @click="closeForm"
        >
          <Icon name="material-symbols:close-rounded" :size="iconSize" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.g-form {

  &__show {
    display: flex;
    align-items: center;
    gap: var(--indent);
  }

  &__edit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--indent);

    @media (--viewport-xl) {
      flex-direction: row;
      gap: var(--indent-double);
    }
  }

  &__button {
    padding: var(--indent-half);

    & + & {
      margin-left: var(--indent);
    }
  }
}
</style>
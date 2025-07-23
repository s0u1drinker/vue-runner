<script setup lang="ts">
const props = defineProps<{
  date?: string,
  time?: string,
}>()

const modelDateTime = defineModel<string>({ default: ''})
// Выбранная дата.
const selectedDate = ref<string>(props.date || '')
// Выбранное время.
const selectedTime = ref<string>(props.time || '')
// Выбранное значение даты и времени.
const textDateTime = ref<string>(`${selectedDate.value || '--.--.----'} в ${selectedTime.value || '--:--:--'}`)
// Флаг отображения формы выбора даты и времени.
const flagOpenForm = ref<boolean>(false)

onMounted(() => {
  // Если в компонент "пришли" дата и время,
  if (selectedDate.value && selectedTime.value) {
    // то обновляем данные у родителя (обновляем модель).
    selectDateTime()
  }
})

// Выбор даты и времени.
function selectDateTime(): void {
  // Разбиваем строку с датой.
  const [ day, month, year ] = selectedDate.value.split('.')
  // Разбиваем строку со временем.
  const [ hh, mm, ss ] = selectedTime.value.split(':')
  // Если все переменные существуют (да-да, секунды тоже обязательно),
  if (year && month && day && hh && mm && ss) {
    // Формируем строку для отображения.
    textDateTime.value = `${selectedDate.value} в ${selectedTime.value}`
    // Обновляем модель данных.
    modelDateTime.value = new Date(+year, +month - 1, +day, +hh, +mm, +ss).toLocaleISOString()
  } else console.error(`Что-то пошло не так при деструктуризация даты и времени. Позовите фиксиков и покажите им это: ${selectedDate.value} ${selectedTime.value}`)
  // Закрываем форму.
  closeForm()
}
// Закрывает форму.
function closeForm(): void {
  flagOpenForm.value = false
}
</script>

<template>
  <div class="datetimepicker">
    <div
      class="datetimepicker__input"
      :class="{ 'datetimepicker__input_selected': flagOpenForm }"
    >
      <div class="datetimepicker__text">
        <span class="datetimepicker__placeholder" v-if="flagOpenForm">Выберите дату и время</span>
        <template v-else>{{ textDateTime }}</template>
      </div>
      <button class="datetimepicker__button button" @click="flagOpenForm = !flagOpenForm">
        <Icon name="material-symbols:calendar-month" size="1.25rem" />
      </button>
    </div>
    <Transition name="fade">
      <div class="datetimepicker__form" v-show="flagOpenForm">
        <TheCalendar v-model:date="selectedDate" />
        <div class="datetimepicker__time">
          <span>Время:</span>
          <InputTime v-model:time="selectedTime" />
        </div>
        <div class="datetimepicker__buttons">
          <button class="button button_blue" @click="selectDateTime" :disabled="!(selectedDate && selectedTime)">Выбрать</button>
          <button class="button button_gray" @click="closeForm">Отмена</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

.datetimepicker {
  position: relative;
  width: 15rem;

  &__input {
    border: var(--border);
    border-radius: .25rem;
    display: flex;
    position: relative;
    z-index: 5;

    &_selected {
      border-radius: .25rem .25rem 0 0;

      & > .datetimepicker__button {
        background-color: var(--light-red);
        border-bottom-right-radius: 0;
      }
    }
  }

  &__text {
    flex: 1;
    align-content: center;
    border-right: var(--border);
    text-align: center;
  }

  &__placeholder {
    color: var(--gray);
    font-style: italic;
    font-size: .9rem;
  }

  &__button {
    border: 0 none;
    border-radius: 0 .25rem .25rem 0;
    background-color: transparent;

    &:hover {
      background-color: var(--light-gray);
    }
  }

  &__form {
    border: var(--border);
    border-top: 0 none;
    border-radius: 0 0 .25rem .25rem;
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--white);
  }
  
  &__time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--indent-half);
    border-top: var(--border);
    border-bottom: var(--border);
  }

  &__buttons {
    display: flex;
    justify-content: space-around;
    padding: var(--indent-half);
  }
}
</style>
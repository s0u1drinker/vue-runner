<script setup lang="ts">
const { min = 0, max = 59, placeholder = '--' } = defineProps<{
  min?: number,
  max?: number,
  placeholder?: string,
}>()
const inputValue = defineModel<string>({ default: '00' })
// Значение при создании компонента.
const defaultValue = inputValue.value
// Действие при фокусе на элементе.
function onFocus(e: FocusEvent) {
  // Выделяем текст.
  (e.target as HTMLInputElement).select()
}
// Действие при нажатии на клавишу.
function onKeyDown(e: KeyboardEvent) {
  // Проверка нажатой клавиши. Если нажатая клавиша не входит в список разрешённых.
  if (!CONTROL_KEYS_INPUT_NUMBER.includes(e.key)) {
    // Запрет на добавление любых символов, кроме чисел от 0 до 9.
    if (!/^[0-9]$/.test(e.key)) e.preventDefault()
  }
}
// Действие при вводе данных.
function onInput(e: InputEvent) {
  const currentValue = Number(inputValue.value)
  // Проверяем текущее значение на NaN.
  if (!isNaN(currentValue)) {
    // Если всё в порядке, то проверяем на минимальное значение.
    if (currentValue < min) inputValue.value = prettyNumberForDateAndTime(min)
    // И на максимальное.
    else if (currentValue > max) inputValue.value = prettyNumberForDateAndTime(max)
  } else {
    // Если, внезапно, "поймали" NaN, то ругаемся в консоль
    console.error(`Неожиданный NaN. Значение в input: ${inputValue.value}.`)
    // и присваиваем дефолтное значение.
    inputValue.value = defaultValue
  }
}
// Действие при потере фокуса.
function onBlur() {
  // Если количество знаков меньше 2, то записываем нули в начало строки.
  if (inputValue.value.length < 2) inputValue.value = prettyNumberForDateAndTime(inputValue.value)
}
</script>

<template>
  <input
    type="text"
    class="i-t-input"
    inputmode="numeric"
    :min
    :max
    :placeholder
    @focus.native="onFocus"
    @keydown="onKeyDown"
    @input="onInput($event as InputEvent)"
    @blur="onBlur"
    @paste.prevent
    @drop.prevent
    maxlength="2"
    autocomplete="off" 
    v-model="inputValue"
  />
</template>

<style scoped>
.i-t-input {
  text-align: center;

  &::placeholder {
    font-size: 1.25rem;
  }
}
</style>
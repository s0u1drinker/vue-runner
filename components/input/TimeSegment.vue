<script setup lang="ts">
// TODO: проблема с вводом символов на touchpad (onkeydown).
const { min = 0, max = 59, placeholder = '--', disabled = false } = defineProps<{
  min?: number,
  max?: number,
  placeholder?: string,
  disabled?: boolean,
}>()
const inputValue = defineModel<string>({ default: '00' })
// Значение при создании компонента.
const defaultValue = inputValue.value
// Действие при фокусе на элементе.
function onFocus(e: FocusEvent) {
  // Выделяем текст.
  (e.target as HTMLInputElement).select()
}
// Действие при вводе данных.
function onInput(e: InputEvent) {
  if (e.data && !/^[0-9]$/.test(e.data)) {
    inputValue.value = inputValue.value.replace(/[^0-9]/g, '')
  } else if (inputValue.value.length === 2) checkMinMax()
}
// Действие при потере фокуса.
function onBlur() {
  // Если количество знаков меньше 2, то записываем нули в начало строки.
  if (inputValue.value.length < 2) inputValue.value = prettyNumberForDateAndTime(inputValue.value)
  checkMinMax()
}
// Проверка на минимальное и максимальное значения.
function checkMinMax() {
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
</script>

<template>
  <input
    type="text"
    class="i-t-input"
    inputmode="numeric"
    :min
    :max
    :placeholder
    :disabled
    @focus.native="onFocus"
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
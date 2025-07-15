<script setup lang="ts">
const { step = 1, float = 0, min = -Infinity, max = Infinity } = defineProps<{
  /**
   * Шаг прибавления/вычитания.
   */
  step?: number,
  /**
   * Признак вещественного числа. 0 - целое, любая цифра - количество знаков после запятой.
   */
  float?: number,
  /**
   * Минимальное значение.
   */
  min?: number,
  /**
   * Максимальное значение.
   */
  max?: number,
}>()

const inputNumber = defineModel<number | string>({ default: 0})
// Значение "по умолчанию".
const defaultValue = inputNumber.value
// Тип экранной клавиатуры.
const inputMode = computed(() => float ? 'decimal' : 'numeric')
// Уменьшение значения.
const decrementValue = () => {
  // Конвертируем в число.
  const numberInputValue = Number(inputNumber.value)
  // Следующее значение = Текущее значение - шаг.
  const nextValue = Number((numberInputValue - step).toFixed(float))
  // Если следующее значение меньше минимального - отображаем минимальное.
  if (nextValue < min) inputNumber.value = min
  // Если текущее значение больше минимального - отображаем следующее значение.
  else if (numberInputValue > min) inputNumber.value = nextValue
}
// Увеличение значения.
const incrementValue = () => {
  // Конвертируем в число.
  const numberInputValue = Number(inputNumber.value)
  // Следующее значение = Текущее значение + шаг.
  const nextValue = Number((numberInputValue + step).toFixed(float))
  // Если следующее значение больше максимального - отображаем максимальное.
  if (nextValue > max) inputNumber.value = max
  // Если текущее значение меньше максимального - отображаем следующее значение.
  else if (numberInputValue < max) inputNumber.value = nextValue
}
// Проверка при изменении данных.
const checkOnInput = (e: InputEvent) => {
  if (e.data) {
    let stringInputNumber = String(inputNumber.value)
    // Строка начинается с "0".
    if (stringInputNumber.startsWith('0') && (stringInputNumber.length === 2)) {
      // Если следом идёт число, то убираем "0".
      if (/^[0-9]$/.test(e.data)) { stringInputNumber = stringInputNumber.slice(1) }
    }
    // Проверяем число.
    if (!float) {
      // Целое число.
      if (!/^[0-9\-]$/.test(e.data)) { stringInputNumber = stringInputNumber.replace(/[^0-9\-]/g, '') }
    } else {
      // Десятичная дробь.
      if (!/^[0-9.,\-]$/.test(e.data)) { stringInputNumber = stringInputNumber.replace(/[^0-9.,\-]/g, '') }
      // Работа с "," и ".".
      if (e.data === ',' || e.data === '.') {
        // Замена "," на ".".
        if (e.data === ',') { stringInputNumber = stringInputNumber.replace(',', '.'); }
        // Если строка состоит из одного символа ".", то дописываем в начало строки "0".
        if (stringInputNumber.length === 1) { stringInputNumber = stringInputNumber.padStart(2, '0') }
        // Если первый символ строки "-" и строка состоит из 2-х символов ("-."), то "." следует удалить. 
        if ((stringInputNumber[0] === '-') && (stringInputNumber.length === 2)) { stringInputNumber = stringInputNumber.slice(0, -1) }
        // Если в строке уже есть символ ".", то удаляем текущий символ ".".
        if ((stringInputNumber.split('.').length - 1) > 1) { stringInputNumber = stringInputNumber.slice(0, -1) }
      }
    }
    // Проверяем знак "-".
    if (e.data === '-') {
      // Запрет на добавление отрицательных чисел, если минимальное значение больше или равно 0.
      if (min >= 0) { stringInputNumber = stringInputNumber.replace('-', '') }
      else {
        // Если строка вида "0-", то убираем "0" в начале.
        if ((stringInputNumber.length === 2) && stringInputNumber.startsWith('0')) { stringInputNumber = stringInputNumber.slice(1) }
        // Запрет на добавление символа "-", если он уже присутствует в строке.
        if ((stringInputNumber.split('-').length - 1) > 1) { stringInputNumber = stringInputNumber.slice(0, -1) }
        // Запрет добавления "-", если он не находится в начале строки.
        if (stringInputNumber.length > 1) { stringInputNumber = stringInputNumber.slice(0, -1) }
      }
    }
    // Если после проверок строка стала пустой - записываем "0"
    inputNumber.value = stringInputNumber || '0'
  }
}
// Проверка при потере фокуса.
const checkOnBlur = () => {
  // Если при конвертации значения будет NaN - присваиваем значение "по умолчанию".
  inputNumber.value = Number(inputNumber.value) || defaultValue
}
</script>

<template>
  <div class="i-number">
    <button
      class="i-number__button button button_gray"
      type="button"
      @click="decrementValue"
    >-</button>
    <input
      type="text"
      class="i-number__input input"
      :inputmode="inputMode"
      @input="checkOnInput($event as InputEvent)"
      @blur="checkOnBlur"
      @paste.prevent
      @drop.prevent
      autocomplete="off" 
      v-model="inputNumber"
    />
    <button
      class="i-number__button button button_gray"
      type="button"
      @click="incrementValue"
    >+</button>
  </div>
</template>

<style scoped>
.i-number {
  display: flex;
  gap: var(--indent-half);

  &__button {
    --size: calc(2rem + var(--indent-quarter));

    height: var(--size);
    width: var(--size);
  }

  &__input {
    text-align: center;
    width: 5rem;
  }
}
</style>
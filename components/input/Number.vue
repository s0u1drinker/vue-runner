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
// Регулярное выражение для проверки вносимых пользователем символов при работе с дробными числами.
const regExpFloat = /^[0-9.,\-]$/
// Регулярное выражение для проверки вносимых пользователем символов при работе с целыми числами.
const regExpNoFloat = /^[0-9\-]$/
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
  const nextValue = numberInputValue + step
  // Если следующее значение больше максимального - отображаем максимальное.
  if (nextValue > max) inputNumber.value = max
  // Если текущее значение меньше максимального - отображаем следующее значение.
  else if (numberInputValue < max) inputNumber.value = nextValue
}
// Проверка вносимых пользователем данных.
const checkOnKeyDown = (e: KeyboardEvent) => {
  // Проверка нажатой клавиши. Если нажатая клавиша не входит в список разрешённых.
  if (!CONTROL_KEYS_INPUT_NUMBER.includes(e.key)) {
    // Проверка для целых чисел.
    if (!float && !regExpNoFloat.test(e.key)) e.preventDefault()
    // Проверка для дробных чисел.
    if (float && !regExpFloat.test(e.key)) e.preventDefault()
    // Запрет на добавление отрицательных чисел, если минимальное значение больше или равно 0.
    if ((min >= 0) && (e.key === '-')) e.preventDefault()
    // Запрет на добавление символов "." и ",", если в строке уже присутствует символ ".".
    if (float && (e.key === ',' || e.key === '.') && String(inputNumber.value).includes('.')) e.preventDefault()
    // Запрет на добавление символа "-", если он уже присутствует в строке.
    if ((min < 0) && (e.key === '-') && String(inputNumber.value).includes('-')) e.preventDefault()
  }
}
// Проверка при изменении данных.
const checkOnInput = (e: InputEvent) => {
  // Замена "," на ".".
  if (e.data === ',') inputNumber.value = String(inputNumber.value).replace(',', '.')
  // Если пользователь ввёл число, а в строке первый элемент 0, то убираем этот 0 путём конвертации в число.
  if (e.data && String(inputNumber.value)[0] === '0' && regExpNoFloat.test(e.data)) inputNumber.value = Number(inputNumber.value)
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
      @keydown="checkOnKeyDown($event as KeyboardEvent)"
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
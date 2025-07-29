<script setup lang="ts">
import type { SelectCustomOptions } from '@/types/selectCustomOptions'

const { items } = defineProps<{
  items: SelectCustomOptions[]
}>()
// Значение по умолчанию для свойства <transition> элемента <.carousel-s__track>
const transition: string = 'transform .25s ease-out'
// Ширина элемента <.carousel-s__container>.
const containerWidth = ref<number>(0)
// Минимальная ширина для элемента <.carousel-s__item>. 
const minWidthStyle = ref<string>('auto')
// Порядковый номер текущего элемента.
const currentItem = ref<number>(1)
// Текущее значение свойства <transition> элемента <.carousel-s__track>
const trackTransition = ref<string>(transition)
// Флаг отображения прелоадера.
const showPreloader = ref<boolean>(true)
// Массив HTML-элементов карусели для рабботы со стилями этих элементов.
const carouselItems = useTemplateRef<HTMLDivElement[]>('carouselItems')
// Список элементов карусели с дублированием первого и последнего.
const itemsWithDuplication = computed<SelectCustomOptions[]>((): SelectCustomOptions[] => {
  // Если количество переданных в props элементов не менее 2-х, то дуюлирование элементов не производится. 
  return (items.length > 1) ? [ items[items.length - 1], ...items, items[0] ] : items
})
// Вычисление сдвига элемента <.carousel-s__track> в зависимости от текущего элемента.
const trackTranslate = computed<string>((): string => {
  // Если количество переданных в props элементов не менее 2-х, то сдвигать ничего не нужно. 
  return (items.length > 1) ? `translateX(${-currentItem.value * 100}%)` : 'none'
})
// Флаг состояния <disabled> для кнопок.
const disabledButtonsFlag = computed<boolean>((): boolean => {
  // Кнопки необходимо отключить только в том случае, если количество переданных в props элементов не менее 2-х.
  return (items.length < 2)
})
// Предыдущий элемент с использованием throttle-функции.
const throttledPrevItem = throttle(() => { currentItem.value-- }, 250)
// Следующий элемент с использованием throttle-функции.
const throttledNextItem = throttle(() => { currentItem.value++ }, 250)
// Наболюдаем за изменением порядкового номера, чтобы сделать плавный переход между первым и последним элементами.
watch(currentItem, () => {
  // Вычисляем новое значение порядкового номера.
  const newValue = (currentItem.value === 0) ? items.length : (currentItem.value === itemsWithDuplication.value.length - 1) ? 1 : -1
  // Если новое значение является первым или последним, то начинаем творить "магию".
  if (newValue !== -1) {
    // Ждём, пока пройдет анимация перехода.
    setTimeout(() => {
      // Отключаем свойство <transition>, чтобы был "бесшовный" переход.
      trackTransition.value = 'none'
      // Присваиваем новое значение порядкового номера.
      currentItem.value = newValue
      // Небольшая "магия", чтобы избежать пролистывания всех элементов.
      setTimeout(() => {
        // Возвращаем свойство <transition> по умолчанию.
        trackTransition.value = transition
      }, 25);
    }, 250);
  }
})

onMounted(() => {
  // Если в карусели есть элементы.
  if (carouselItems.value) {
    // Вычисляем максимальную ширину.
    for(let item of carouselItems.value) {
      // И устанавливаем её элементу <.carousel-s__container>.
      if (item.offsetWidth > containerWidth.value) containerWidth.value = item.offsetWidth
    }
    // Выставляем для элементов карусели минимальную ширину 100%.
    minWidthStyle.value = '100%'
    // Убираем прелоадер.
    showPreloader.value = false
  } else console.error(`Непредвиденная ошибка: отсутствуют элементы в карусели (${carouselItems.value}).`)
})
/**
 * Ограничивает частоту вызова переданной функции. Используется, главынм образом, на кнопках переключения.
 * @param func Функция.
 * @param timeout Задержка в миллисекундах.
 */
function throttle<T extends (...args: any) => any>(func: T, timeout: number) {
  // Флаг блокировки функции.
  let isThrottled = false
  // Функция-обёртка.
  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    // Если функция заблокирована - выходим.
    if (isThrottled) return
    // Поднимаем флаг блокировки.
    isThrottled = true
    // Вызываем переданную функцию.
    func.apply(this, args)
    // Запускаем таймер, который опустит флаг блокировки через обозначенное выше время.
    setTimeout(() => isThrottled = false, timeout)
  }
}
</script>

<template>
  <div class="carousel-s">
    <button
      class="button button_outline_gray"
      @click="throttledPrevItem"
      :disabled="disabledButtonsFlag"
    >
      <Icon name="material-symbols:chevron-left" />
    </button>
    <ThePreloader
      class="carousel-s__preloader"
      type="blink"
      v-if="showPreloader"
    />
    <div
      class="carousel-s__container"
      :style="{ width: `${containerWidth}px` }"
    >
      <div
        class="carousel-s__track"
        :style="{ transform: trackTranslate, transition: trackTransition }"
      >
        <div
          class="carousel-s__item"
          v-for="item in itemsWithDuplication"
          :key="item.value"
          :style="{ minWidth: minWidthStyle }"
          ref="carouselItems"
        >
          <Icon :name="item.icon" v-if="item.icon" size="1.25rem" />
          <span class="">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <button
      class="button button_outline_gray"
      @click="throttledNextItem"
      :disabled="disabledButtonsFlag"
    >
      <Icon name="material-symbols:chevron-right"/>
    </button>
  </div>
</template>

<style scoped>
.carousel-s {
  display: flex;
  position: relative;

  &__preloader {
    border-radius: .25rem;
    width: 7rem;
  }

  &__container {
    overflow: hidden;
  }

  &__track {
    display: flex;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--indent-half);
    padding: .5rem;
    box-sizing: border-box;
  }
}
</style>
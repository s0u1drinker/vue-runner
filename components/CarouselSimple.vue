<script setup lang="ts">
import type { SelectCustomOptions } from '@/types/selectCustomOptions'

// TODO: Добавить Throttle-функцию на кнопки.
// FIXME: Унифицировать функцию переключения слайдов.

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
const itemsWithDuplication = computed(() => {
  // Если количество переданных в props элементов не менее 2-х, то дуюлирование элементов не производится. 
  return (items.length > 1) ? [ items[items.length - 1], ...items, items[0] ] : items
})
// Вычисление сдвига элемента <.carousel-s__track> в зависимости от текущего элемента.
const trackTranslate = computed(() => {
  // Если количество переданных в props элементов не менее 2-х, то сдвигать ничего не нужно. 
  return (items.length > 1) ? `translateX(${-currentItem.value * 100}%)` : 'none'
})
// Флаг состояния <disabled> для кнопок.
const disabledButtonsFlag = computed(() => {
  // Кнопки необходимо отключить только в том случае, если количество переданных в props элементов не менее 2-х.
  return (items.length < 2)
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
// Переключение на предыдущий элемент карусели.
function prevItem(): void {
  // Уменьшаем порядковый номер.
  currentItem.value--
  // Если показан 1-й элемент массива (дубликат последнего элемента).
  if (currentItem.value === 0) {
    // Ждём, пока пройдет анимация перехода.
    setTimeout(() => {
      // Отключаем свойство <transition>, чтобы был "бесшовный" переход.
      trackTransition.value = 'none'
      // Порядковый номер текущего элемента = последнему "реальному" элементу.
      currentItem.value = items.length
      // Небольшая "магия", чтобы избежать пролистывания всех элементов.
      setTimeout(() => {
        // Возвращаем свойство <transition> по умолчанию.
        trackTransition.value = transition
      }, 25);
    }, 250);
  }
}
// Переключение на следующий элемент карусели.
function nextItem(): void {
  // Увеличиваем порядковый номер.
  currentItem.value++
  // Если показан последний элемент массива (дубликат первого элемента).
  if (currentItem.value === itemsWithDuplication.value.length - 1) {
    // Ждём, пока пройдет анимация перехода.
    setTimeout(() => {
      // Отключаем свойство <transition>, чтобы был "бесшовный" переход.
      trackTransition.value = 'none'
      // Порядковый номер текущего элемента = первому "реальному" элементу (0-й элемент - это дубликат).
      currentItem.value = 1
      // Небольшая "магия", чтобы избежать пролистывания всех элементов.
      setTimeout(() => {
        // Возвращаем свойство <transition> по умолчанию.
        trackTransition.value = transition
      }, 25);
    }, 250);
  }
}
</script>

<template>
  <div class="carousel-s">
    <button
      class="button button_outline_gray"
      @click="prevItem"
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
      @click="nextItem"
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
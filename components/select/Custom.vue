<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { SelectCustomOptions } from '@/types/selectCustomOptions'

// TODO: Поиграться с дизайном компонента: выпадающий список на всю ширину, тень компонента, красивое оформление выделенного элемента.
// TODO: Добавить атрибут "disabled".
// FIXME: На этапе отображения прелоадера наблюдаются проблемы с шириной элемента (Статистика -> Цели -> Неделя).
// FIXME: Необходимо добавить анализ направления "выпадения" списка (вниз или вверх).

const { list } = defineProps<{
  list: SelectCustomOptions[]
}>()
// Выбранное значение.
const selectedValue = defineModel()
// Выпадающий список.
const dropdownRef = useTemplateRef<HTMLDivElement>('dropdown')
// Элементы выпадающего списка.
const itemsRef = useTemplateRef<HTMLElement[]>('listItems')
// Стили для выпадающего списка.
const dropdownStyle = reactive<CSSProperties>({
  visibility: 'hidden'
})
// Индекс выбранного элемента.
const selectedItemIndex = ref<number>(list.findIndex((item) => item.value === selectedValue.value))
// Индекс элемента, который выделен клавишами <ArrowUp>, <ArrowDown> в выпадающем списке.
const focusItemIndex = ref<number>(selectedItemIndex.value)
// Ширина элемента <.c-select__value>.
const valueWidth = ref<number>(0)
// Флаг отображения выпадающего списка.
// Поднят, т.к. необходимо вычислить ширину.
const showDropdown = ref<boolean>(true)
// Флаг отображения заглушки.
const showPreloader = ref<boolean>(true)
// Имя иконки. Зависит от видимости выпадающего списка.
const iconName = computed<string>((): string => {
  return showDropdown.value ? 'material-symbols:close-small-outline-rounded' : 'material-symbols:arrow-drop-down-rounded'
})

watch(selectedValue, () => {
  // Изменение индекса при изменении значения.
  selectedItemIndex.value = list.findIndex((item) => item.value === selectedValue.value)
  // И фокуса.
  focusItemIndex.value = selectedItemIndex.value
})

onMounted(() => {
  // Если есть элемент "Выпадающий список".
  if (dropdownRef.value) {
    // Устанавливаем ширину блоку, в котором будет отображаться выбранный элемент.
    valueWidth.value = dropdownRef.value.offsetWidth
    // Снимаем флаг показа выпадающего списка.
    showDropdown.value = false
    // Снимаем флаг показа заглушки.
    showPreloader.value = false
    // Делаем элемент видимым.
    dropdownStyle.visibility = 'visible'
  } else { console.error(`Что-то пошло не так: не найден выпадающий список ${dropdownRef.value}`) }
})
// Показывает/скрывает выпадающий список.
function toggleDropdown() {
  showDropdown.value = !showDropdown.value
  // При закрытии сбрасывает индекс элемента, который выделяется клавишами.
  if (!showDropdown.value) focusItemIndex.value = selectedItemIndex.value
}
// Функция выбора элемента.
function selectItem(newValue: string) {
  // Выбранное значение.
  selectedValue.value = newValue
  // Убираем выпадающий список.
  toggleDropdown()
}
// Обработчик нажатия клавиш.
function keyDownHandler(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      // Если список показан - закрываем.
      if (showDropdown.value) toggleDropdown()
      break
    case 'ArrowDown':
    case 'ArrowUp':
      // Если список показан и если элементы в выпадающем спсике.
      if (showDropdown.value && itemsRef.value) {
        // Индекс последнего элемента.
        const lastIndex = itemsRef.value.length - 1
        // Отменяем действие по умолчанию (прокрутка скролла).
        e.preventDefault()
        // Вычисляем индекс элемента, на который надо повесить "фокус".
        if (e.code === 'ArrowDown') {
          if (++focusItemIndex.value > lastIndex) focusItemIndex.value = 0
        }
        if (e.code === 'ArrowUp') {
          if (--focusItemIndex.value < 0) focusItemIndex.value = lastIndex
        }
        // Вешаем "фокус".
        itemsRef.value[focusItemIndex.value].focus()
      }
      break
    default:
      break
  }
}
// Обработчик клика.
function clickHandler(e: MouseEvent) {
  // Элемент, на котором было зарегистрировано событие "Клик".
  const target = e.target as HTMLElement
  // Если элемент есть и его родителем не является текущий компонент.
  if (target && !target.closest('.c-select')) {
    // Если список показан - закрываем.
    if (showDropdown.value) toggleDropdown()
  }
}
// Вешаем обработчик нажатия клавиш.
// Почему "keydown"? Потому, что при нажатии на стрелки, по дефолту, двигается скролл.
document?.body.addEventListener('keydown', keyDownHandler)
// Вешаем обработчик клика.
document?.body.addEventListener('click', clickHandler)

onBeforeUnmount(() => {
  // Чистим за собой: убираем обработчики.
  document?.body.removeEventListener('keydown', keyDownHandler)
  document?.body.removeEventListener('click', clickHandler)
})
</script>

<template>
  <div class="c-select">
    <ThePreloader
      class="c-select__preloader"
      type="blink"
      v-if="showPreloader"
    />
    <button
      class="c-select__button"
      :class="{ 'c-select__button_show-menu': showDropdown }"
      :style="dropdownStyle"
      @click="toggleDropdown"
      aria-haspopup="true"
      :aria-expanded="showDropdown"
    >
      <div class="c-select__value" :style="{ width: `${valueWidth}px` }">
        <template v-if="selectedItemIndex !== -1">
          <Icon :name="list[selectedItemIndex].icon" v-if="list[selectedItemIndex].icon" />
          <span class="c-select__item-text">{{ list[selectedItemIndex].label }}</span>
        </template>
      </div>
      <Icon
        class="c-select__arrow"
        :name="iconName"
        size="1.25rem"
      />
    </button>
    <ul
      class="c-select__list"
      :style="dropdownStyle"
      ref="dropdown"
      v-show="showDropdown"
      role="menu"
    >
      <li
        class="c-select__item"
        :class="{ 'c-select__item_selected': item.value === selectedValue }"
        v-for="(item, index) in list"
        :key="index"
        @click="selectItem(item.value)"
        @keyup.space="selectItem(item.value)"
        @keyup.enter="selectItem(item.value)"
        role="menuitem"
        tabindex="0"
        ref="listItems"
      >
        <Icon :name="item.icon" class="c-select__item-icon" v-if="item.icon" />
        <span class="c-select__item-text">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.c-select {
  --b-radius: .25rem;

  display: flex;
  position: relative;

  &__preloader {
    border-radius: var(--b-radius);
    width: 10rem;
  }

  &__button {
    border: 0 none;
    background-color: transparent;
    display: flex;
    padding: 0;

    &:hover {

      .c-select__arrow {
        background-color: var(--light-gray);
      }
    }

    &_show-menu {

      .c-select__value {
        border-bottom-left-radius: 0;
      }

      .c-select__arrow {
        background-color: var(--light-red);
      }
    }
  }

  &__value {
    align-items: center;
    display: flex;
    gap: var(--indent-half);
    padding: var(--indent-half);
    border: var(--border);
    border-radius: var(--b-radius) 0 0 var(--b-radius);
    box-sizing: border-box;
    min-width: 8rem;
  }

  &__arrow {
    border: var(--border);
    border-left: 0 none;
    padding: var(--indent-half);
    border-radius: 0 var(--b-radius) var(--b-radius) 0;
    transition: background-color var(--animation);
  }

  &__list {
    border: var(--border);
    border-top: 0 none;
    border-radius: 0 0 var(--b-radius) var(--b-radius);
    position: absolute;
    left: 0;
    top: 100%;
    background-color: var(--white);
    z-index: 10;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--indent-quarter);
    padding: .5rem .75rem;
    transition: background-color var(--animation);

    &:hover {
      background-color: var(--light-gray);
      cursor: default;
      user-select: none;
    }

    &_selected {
      background-color: var(--sky-blue);
      color: var(--white);
      pointer-events: none;

      & > .c-select__item-icon {
        fill: var(--white);
      }
    }
  }

  &__item-text {
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
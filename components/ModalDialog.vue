<script setup lang="ts">

// TODO: Создание модальных окон (МО) через Pinia.
// TODO: Компонент ModalContainer со всеми МО в #app.

const { header } = defineProps<{
  header?: string,
}>()

// Данные о модальном окне из store.
const modalStore = useModalStore()
// Элемент <dialog>.
const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')
// Наблюдаем за хранилищем.
watch(modalStore, () => {
  if (dialogRef.value) {
    // Если состояние флага изменилось - закрываем/открываем окно.
    modalStore.modalShow ? dialogRef.value.showModal() : dialogRef.value.close()
  }
})

onMounted(() => {
  if (dialogRef.value) {
    // Слушаем событие "Cancel", чтобы правильно закрыть окно при нажатии кнопки Esc.
    dialogRef.value.addEventListener('cancel', modalStore.closeModalDialog)
  }
})

onUnmounted(() => {
  if (dialogRef.value) {
    dialogRef.value.removeEventListener('cancel', modalStore.closeModalDialog)
  }
})
// Обрабатываем клик по модальному окну.
const handleClick = (event: MouseEvent) => {
  // Клик по оверлею закрывает модальное окно.
  if (event.target === dialogRef.value) {
    modalStore.closeModalDialog()
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="m-dialog" @click="handleClick">
      <div class="m-dialog__inner">
        <button class="button button_red m-dialog__close-button" aria-label="Закрыть" @click="modalStore.closeModalDialog()">
          <Icon name="material-symbols:close-small-outline-rounded" size="1.5rem" />
        </button>
        <h2 class="m-dialog__header" v-if="header">{{ header }}</h2>
        <div class="m-dialog__body" v-if="$slots.body">
          <slot name="body"></slot>
        </div>
        <div class="m-dialog__buttons" v-if="$slots.buttons">
          <slot name="buttons"></slot>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

@keyframes modalFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
    translate: 0 -100%;
  }
  100% {
    opacity: 1;
    transform: scale(1);
    translate: 0 0;
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

.m-dialog {
  --speed: .35s;

  transition: display var(--speed) allow-discrete, overlay var(--speed) allow-discrete;
  animation: modalFadeOut var(--speed) ease-out forwards;
  padding: 0;
  border: var(--border);
  overflow: visible;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 90%;

  @media (--viewport-sm) {
    width: 70%;
  }

  @media (--viewport-md) {
    width: 55%;
  }

  @media (--viewport-lg) {
    width: 40%;
  }

  &::backdrop {
    background: rgba(0, 0, 0, .5);
  }

  &[open] {
    animation: modalFadeIn var(--speed) ease-out forwards;
  }

  &__inner {
    padding: var(--indent);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: var(--indent);
  }
  
  &__close-button {
    position: absolute;
    right: 0;
    top: calc(var(--indent-half) * -1);
    display: flex;
    translate: 0 -100%;
    box-shadow: var(--shadow);
    padding: 0;
    border-color: var(--white);
  }

  &__buttons {
    display: flex;
    gap: var(--indent);
    justify-content: center;
  }
}

</style>
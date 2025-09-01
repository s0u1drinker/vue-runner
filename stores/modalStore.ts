import { defineStore } from 'pinia'
import type { ModalDialog, ModalInfo, ModalLoader, ModalButton } from '@/types/modal'

type Modals = ModalDialog | ModalInfo | ModalLoader

export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: [] as Modals[],
  }),
  getters: {
    /**
     * Возвращает индекс по идентификатору.
     * @param id Идентификатор.
     * @returns Индекс или -1.
     */
    getModalIndexByID: (state) => {
      return (id: string): number => {
        return state.modals.findIndex((item) => item.id === id)
      }
    },
    /**
     * Возвращает данные о модальном окне по идентификатору.
     * @param id Идентификатор.
     * @returns Данные о модальном окне или undefined.
     */
    getModalDataByID: (state) => {
      return (id: string): Modals | undefined => {
        return state.modals.find((modal) => modal.id === id)
      }
    }
  },
  actions: {
    /**
     * Открывает модальное окно.
     * @param idModal Идентификатор модального окна.
     */
    openModal(idModal: string) {
      const modalIndex = this.getModalIndexByID(idModal)

      if (modalIndex !== -1) {
        this.modals[modalIndex].show = true
      }
    },
    /**
     * Закрывает модальное окно.
     * @param idModal Идентификатор модального окна.
     */
    closeModal(idModal: string) {
      const modalIndex = this.getModalIndexByID(idModal)

      if (modalIndex !== -1) {
        if (this.modals[modalIndex].closable) {
          this.modals[modalIndex].show = false
        }
      }
    },
    /**
     * Удаляет модальное окно.
     * @param idModal Идентификатор модального окна.
     */
    deleteModal(idModal: string) {
      const modalIndex = this.getModalIndexByID(idModal)

      if (modalIndex !== -1) {
        if (this.modals[modalIndex].show) {
          this.modals[modalIndex].show = false
        }
        setTimeout(() => {
          this.modals.splice(modalIndex, 1)
        }, 500)
      }
    },
    /**
     * Добавляет модальное окно типа <loader> с анимацией.
     * @param loaderName Имя иконки с анимацией.
     * @param text Текст под анимацией, если нужно.
     * @returns Идентификатор модального окна.
     */
    addModalLoader(loaderName: string, text: string): string {
      const id: string = `modal-loader-${String(Date.now()).substring(8)}`
      const modalData: ModalLoader = {
        id,
        type: 'loader',
        show: false,
        closable: false,
        loaderName,
        text,
      }

      this.modals.push(modalData)

      return id
    },
    /**
     * Добавляет модальное окно типа <dialog>.
     * @param body Текст сообщения.
     * @param header Текст заголовка.
     * @param buttons Кнопки.
     * @returns Идентификатор модального окна.
     */
    addModalDialog(header: string, body: string, buttons: { confirm: ModalButton, close: { title: string } } ) {
      const id: string = `modal-dialog-${String(Date.now()).substring(8)}`
      const modalData: ModalDialog = {
        id,
        type: 'dialog',
        show: false,
        closable: true,
        body,
        header,
        buttons: {
          confirm: { ...buttons.confirm },
          close: {
            title: buttons.close.title,
            action: () => this.closeModal(id)
          }
        }
      }

      this.modals.push(modalData)

      return id
    }
  },
})
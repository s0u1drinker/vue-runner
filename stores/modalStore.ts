import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    modalShow: false as Boolean
  }),
  getters: {},
  actions: {
    /**
     * Открыть модальное окно.
     */
    openModalDialog() {
      this.modalShow = true
    },
    /**
     * Закрыть модальное окно.
     */
    closeModalDialog() {
      this.modalShow = false
    },
  },
})
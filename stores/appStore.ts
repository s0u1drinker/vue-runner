import { defineStore } from 'pinia'
import type { ErrorData } from '@/types/errorData'

export const useAppStore = defineStore('app', {
  state: () => ({
    /**
     * Флаг загрузки данных.
     */
    isLoadingData: false as Boolean,
    /**
     * Данные об ошибке.
     */
    error: {
      flag: false,
      text: ''
    } as ErrorData
  }),
  getters: {},
  actions: {
    /**
     * Меняет значение флага загрузки данных.
     * @param newValue Новое значение флага.
     */
    setLoadingDataFlag(newValue: boolean) {
      this.isLoadingData = newValue
    },
    /**
     * Обновляет данные об ошибке. Если передана пустая строка - флаг опускается.
     * @param text Текст ошибки.
     */
    setErrorFlag(text: string) {
      if (text) {
        this.error.flag = true
        this.error.text = text
      } else {
        this.error.flag = false
        this.error.text = ''
      }
    },
  }
})
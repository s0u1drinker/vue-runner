declare global {
  interface String {
    capitalFirstLetter(): string,
  }
}

export default defineNuxtPlugin(() => {
  /**
   * Возвращает строку, в которой каждое слово с заглавной буквы.
   */
  String.prototype.capitalFirstLetter = function(): string {
    return this.toLocaleLowerCase().split(' ').map((word) => `${word[0].toLocaleUpperCase()}${word.slice(1)}`).join(' ')
  }
})
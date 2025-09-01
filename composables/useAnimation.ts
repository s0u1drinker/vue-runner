type AnimationClasses = {
  [key: string]: boolean,
}

type Animations = [ 'pulse-once', 'pulse' ]
type Colors = ['error', 'success']
type ColorKeys = Colors[number]

/**
 * Использование анимации на элементе.
 * @param animation Имя анимации.
 * @param color Цвет (опционально).
 * @returns Средства для работы с анимацией.
 */
export function useAnimation(animation: Animations[number]) {
  // Возможные наименования анимаций.
  const ANIMATIONS_MAP: ReadonlyMap<Animations[number], string> = new Map([
    ['pulse-once', 'pulse-once'],
    ['pulse', 'pulse'],
  ])
  // Возможные наименования цветов.
  const COLORS_MAP: ReadonlyMap<ColorKeys, string> = new Map([
    ['error', 'red'],
    ['success', 'green'],
  ])

  const isAnimationInProgress = ref<boolean>(false)
  const currentColor = ref<ColorKeys | undefined>(undefined)

  const animationClass = computed<string>(() => ANIMATIONS_MAP.has(animation) ? `animation_${ANIMATIONS_MAP.get(animation)}` : '')
  // Вычисление классов, которые будут добавлены элементу.
  const animationClasses = computed<AnimationClasses>(() => {
    const classes: AnimationClasses = {}
    
    if (isAnimationInProgress.value && animationClass.value) {
      // Основной класс анимации.
      classes[animationClass.value] = true
      
      // Класс цвета, если задан.
      if (currentColor.value && COLORS_MAP.has(currentColor.value)) {
        classes[`${animationClass.value}_${COLORS_MAP.get(currentColor.value)}`] = true
      }
    }
    
    return classes
  })
  // Начало анимации.
  const startAnimation = (color?: ColorKeys): void => {
    if (color) {
      currentColor.value = color
    }
    isAnimationInProgress.value = true
  }
  // Окончание анимации.
  const onAnimationEnd = (): void => {
    isAnimationInProgress.value = false
  }
  
  return {
    isAnimationInProgress,
    startAnimation,
    onAnimationEnd,
    animationClasses,
  }
}
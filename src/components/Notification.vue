<template>
  <Transition name="notify" appear>
    <div
      v-if="modelValue"
      class="notification"
      :class="variantClass"
      :style="{ top: `${offset}px`, right: `${offset}px`, zIndex: zIndex }"
      :role="ariaRole"
      :aria-live="ariaLive"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="onClick"
    >
      <div class="icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" class="icon-svg">
          <path :d="iconPath" />
        </svg>
      </div>
      <div class="content">
        <div v-if="title" class="title">{{ title }}</div>
        <div class="message">
          <slot>{{ message }}</slot>
        </div>
      </div>
      <button
        v-if="closable"
        class="close"
        type="button"
        aria-label="Закрыть уведомление"
        @click.stop="close"
      >
        <svg viewBox="0 0 24 24" class="close-svg" focusable="false" aria-hidden="true">
          <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/>
        </svg>
      </button>
    </div>
  </Transition>
  <!-- Inline SVG icons as functional components -->
  <template #icons>
    <!-- kept for clarity; actual icons are below in script via defineComponent -->
  </template>
  
</template>

<script setup>
import { computed, onBeforeUnmount, watch, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  type: {
    type: String,
    default: 'info',
    validator: (v) => ['info', 'success', 'warning', 'error'].includes(v)
  },
  duration: { type: Number, default: 3000 },
  closable: { type: Boolean, default: true },
  zIndex: { type: Number, default: 2000 },
  offset: { type: Number, default: 16 },
})

const emit = defineEmits(['update:modelValue', 'close', 'click'])

const timerId = ref(null)

const variantClass = computed(() => `variant-${props.type}`)
const ariaLive = computed(() => (props.type === 'error' ? 'assertive' : 'polite'))
const ariaRole = computed(() => (props.type === 'error' ? 'alert' : 'status'))

function clearTimer() {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
}

function startTimer() {
  clearTimer()
  if (props.duration > 0 && props.modelValue) {
    timerId.value = setTimeout(() => {
      close()
    }, props.duration)
  }
}

function onMouseEnter() {
  clearTimer()
}

function onMouseLeave() {
  startTimer()
}

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function onClick() {
  emit('click')
}

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) startTimer()
    else clearTimer()
  },
  { immediate: true }
)

onBeforeUnmount(() => clearTimer())

// Provide a single SVG path per type to avoid JSX/extra plugins
const iconPath = computed(() => {
  switch (props.type) {
    case 'success':
      return 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm4.3 8.3-5 5a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.4l1.3 1.29 4.3-4.29a1 1 0 0 1 1.4 1.4Z'
    case 'warning':
      return 'M12.87 3.49 21.5 18a2 2 0 0 1-1.74 3H4.24A2 2 0 0 1 2.5 18l8.63-14.51a2 2 0 0 1 3.74 0ZM12 9a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1Zm0 7a1.25 1.25 0 1 0-1.25-1.25A1.25 1.25 0 0 0 12 16Z'
    case 'error':
      return 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm3.54 12.46a1 1 0 1 1-1.41 1.41L12 13.41l-2.12 2.12a1 1 0 1 1-1.41-1.41L10.59 12 8.47 9.88a1 1 0 1 1 1.41-1.41L12 10.59l2.12-2.12a1 1 0 1 1 1.41 1.41L13.41 12Z'
    default:
      return 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 15a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1Zm0-8a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 12 9Z'
  }
})
</script>

<style scoped>
.notification {
  position: fixed;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 280px;
  max-width: 420px;
  padding: 12px 14px 12px 12px;
  border-radius: 10px;
  border: 1px solid var(--n-border);
  background: var(--n-bg);
  color: var(--n-fg);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
}

.icon {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  margin-top: 2px;
}

.icon-svg {
  width: 22px;
  height: 22px;
  fill: var(--n-accent);
}

.content {
  display: grid;
  gap: 2px;
}

.title {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.message {
  font-size: 13px;
  line-height: 1.3;
  opacity: 0.9;
}

.close {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  margin-left: auto;
  padding: 4px;
  border-radius: 8px;
  color: inherit;
}

.close:hover {
  background: rgba(0, 0, 0, 0.06);
}

.close-svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Variants */
.variant-info {
  --n-bg: #f0f7ff;
  --n-fg: #0b3a75;
  --n-border: #c9e1ff;
  --n-accent: #2f80ed;
}

.variant-success {
  --n-bg: #f0fff7;
  --n-fg: #0f5132;
  --n-border: #c9f2db;
  --n-accent: #2ecc71;
}

.variant-warning {
  --n-bg: #fff9ed;
  --n-fg: #664d03;
  --n-border: #ffe2b5;
  --n-accent: #f39c12;
}

.variant-error {
  --n-bg: #fff2f0;
  --n-fg: #842029;
  --n-border: #f5c2c7;
  --n-accent: #e74c3c;
}

/* Transition: smooth drop-in from top-right */
.notify-enter-from,
.notify-leave-to {
  transform: translateY(-12px) scale(0.98);
  opacity: 0;
}

.notify-enter-active {
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease-out;
}

.notify-leave-active {
  transition: transform 200ms ease-in, opacity 180ms ease-in;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .notify-enter-active,
  .notify-leave-active {
    transition: none;
  }
}
</style>


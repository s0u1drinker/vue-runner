<script setup lang="ts">
import type { NotificationType } from '@/types/notification'

const { type = 'message', text = '', close } = defineProps<{
  type: NotificationType,
  text: string,
  close: () => void,
}>()

const NOTIFICATION_HEADER_MAP: ReadonlyMap<NotificationType, string> = new Map([
  [ 'message', 'Сообщение' ],
  [ 'error', 'Ошибка' ],
  [ 'info', 'Информация' ],
  [ 'success', 'Успех' ],
])
// Нормализованный тип уведомления: если переданного типа не существует - подставляется message.
const trueType = computed<NotificationType>((): NotificationType => {
  return NOTIFICATION_HEADER_MAP.has(type) ? type : 'message'
})
// Класс для стилизации уведомления.
const classType = computed<string>((): string => {
  return `notification_${trueType.value}`
})
// Заголовок.
const notificationHeader = computed<string>((): string => {
  return NOTIFICATION_HEADER_MAP.get(trueType.value)!
})
</script>

<template>
  <div class="notification" :class="classType">
    <div class="notification__inner">
      <h4 class="notification__header">{{ notificationHeader }}</h4>
      <p class="notification__text">{{ text }}</p>
    </div>
    <button class="notification__close" @click="close()">
      <Icon name="material-symbols:close-rounded" />
    </button>
  </div>
</template>

<style scoped>
@keyframes fly-time {
  100% { width: 0; }
}

.notification {
  padding: var(--indent);
  border-radius: var(--border-radius);
  border-width: 0 0 0 var(--indent-half);
  border-style: solid;
  box-shadow: 0 0 .5rem rgba(0, 0, 0, .25);
  box-sizing: border-box;
  font-size: 1rem;
  display: flex;
  gap: var(--indent-half);
  align-items: flex-start;
  transition: box-shadow .3s ease-out;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    background-color: var(--white);
    left: 0;
    width: 100%;
    bottom: 0;
    height: 4px;
    animation: fly-time 5s linear forwards;
  }

  &:hover {
    box-shadow: var(--shadow);
  }

  &_message {
    --color: var(--gray);

    background-color: var(--n-message-bg);
    color: var(--color);
  }

  &_error {
    --color: var(--button-red-hover);

    background-color: var(--n-error-bg);
    color: var(--color);
  }

  &_info {
    --color: var(--button-blue-hover);

    background-color: var(--n-info-bg);
    color: var(--color);
  }

  &_success {
    --color: var(--green);

    background-color: var(--n-success-bg);
    color: var(--color);
  }

  &__inner {
    display: flex;
    flex-direction: column;
    gap: var(--indent-half);
    flex: 1;
  }

  &__close {
    border: 0 none;
    color: inherit;
    background-color: var(--white);
    padding: var(--indent-quarter);
    display: flex;
    border-radius: .25rem;
    transition: background-color .3s ease-out, color .3s ease-out;

    &:hover {
      background-color: var(--color);
      color: var(--white);
    }
  }
}
</style>
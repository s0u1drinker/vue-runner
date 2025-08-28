<script setup lang="ts">
const notificationStore = useNotificationStore()
</script>

<template>
  <TransitionGroup class="n-container" name="notification" tag="div">
    <NotificationItem
      v-for="item in notificationStore.notifications"
      :type="item.type"
      :text="item.text"
      :close="() => notificationStore.closeNotification(item.id)"
      :key="item.id"
    />
  </TransitionGroup>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.n-container {
  --notification-padding: var(--indent);

  display: flex;
  flex-direction: column;
  gap: var(--notification-padding);
  padding: var(--notification-padding);
  position: fixed;
  top: 0;
  width: 16.75rem;
  z-index: 10;

  @media (--only-sm) {
    left: 0;
  }

  @media (--viewport-sm) {
    right: 0;
    width: 20rem;
  }
}
/* Анимация для сообщения */
.notification-move,
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translate(120%, 0);
}
.notification-enter-to,
.notification-leave-from {
  opacity: 1;
}
.notification-leave-to {
  opacity: 0;
}
</style>
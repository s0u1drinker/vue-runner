<script setup></script>

<template>
  <TheNavigation />
  <main class="default-layout">
    <slot></slot>
  </main>
  <NotificationContainer />
</template>

<style scoped>
.default-layout {
  flex: 1;
  padding: var(--indent);
}
</style>
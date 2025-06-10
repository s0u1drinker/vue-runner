<script setup></script>

<template>
  <TheNavigation />
  <main class="default-layout">
    <slot></slot>
  </main>
</template>

<style scoped>
.default-layout {
  flex: 1;
  padding: var(--indent);
}
</style>
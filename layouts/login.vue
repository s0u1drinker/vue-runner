<script setup lang="ts">
const bgImage = ref('')

onMounted(() => {
  bgImage.value = `url('/img/background_${getRandom(1, 4)}.png')`
})
</script>

<template>
  <main class="login-layout">
    <slot></slot>
  </main>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.login-layout {
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--dark-gray);

  @media (--viewport-md) {
    background-image: v-bind(bgImage);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    justify-content: flex-end;
  }
}
</style>
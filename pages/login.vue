<script setup lang="ts">
definePageMeta({
  layout: 'login'
})

const rotateForm = ref(false)

const changeFormFlag = (val: boolean): void => {
  if (val) rotateForm.value = !rotateForm.value
}
</script>

<template>
  <div class="login">
    <div class="login__inner" :class="{ 'login__inner_rotate': rotateForm }">
      <FormAuth @change-form="changeFormFlag" class="login__front" />
      <FormRegistration @change-form="changeFormFlag" class="login__back" />
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.login {
  background-color: transparent;
  width: 17rem;
  height: 21rem;
  perspective: 1000px;
  
  @media (--viewport-md) {
    position: relative;
    right: 20%;
    width: 20rem;
  }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;

    &_rotate {
      transform: rotateY(180deg);
    }
  }

  &__back{
    transform: rotateY(180deg);
  }
}
</style>
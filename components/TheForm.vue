<script setup lang="ts">
const { title, message } = defineProps<{
  title?: string,
  message?: string
}>()
</script>

<template>
  <form class="form">
    <div class="form__header" v-if="$slots.title">
      <h1 class="form__title">{{ title }}</h1>
    </div>
    <div class="form__body" v-if="$slots.body">
      <slot name="body"></slot>
    </div>
    <div class="form__extra" v-if="$slots.extra">
      <slot name="extra"></slot>
    </div>
    <p class="form__message">{{ message }}</p>
    <div class="form__buttons" v-if="$slots.buttons">
      <slot name="buttons"></slot>
    </div>
  </form>
</template>

<style scoped>
.form {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background-color: #ffffff99;
  border: 2px solid var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 0 .5rem var(--gray);
  padding: var(--indent);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--indent);

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--indent);
  }

  &__message {
    min-height: 1.5rem;
    color: var(--dark-red);
    text-align: center;
    flex: 1;
  }
  
  &__buttons {
    display: flex;
    gap: var(--indent);
    justify-content: space-between;
  }
}
</style>
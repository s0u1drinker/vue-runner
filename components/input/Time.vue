<script setup lang="ts">

// TODO: Input`ы вынести в отдельный компонент.

const { showSeconds = true } = defineProps<{
  showSeconds?: boolean
}>()

const inputTime = reactive({
  hours: '00',
  minutes: '00',
  seconds: '00',
})
</script>

<template>
  <div class="i-time">
    <InputTimeInput
      class="input i-time__input"
      :max="23"
      v-model="inputTime.hours"
    />
    <span class="i-time__colon">:</span>
    <InputTimeInput
      class="input i-time__input"
      v-model="inputTime.minutes"
    />
    <template v-if="showSeconds">
      <span class="i-time__colon">:</span>
      <InputTimeInput
      class="input i-time__input"
      v-model="inputTime.seconds"
    />
    </template>
  </div>
</template>

<style scoped>
.i-time {
  display: flex;
  gap: var(--indent-quarter);
  align-items: center;

  &__input {
    width: 2.25rem;
  }
}
</style>
<script setup lang="ts">

// TODO: Input`ы вынести в отдельный компонент.

const { showSeconds = true } = defineProps<{
  showSeconds?: boolean
}>()

const inputTime= reactive({
  hours: 0,
  minutes: 0,
  seconds: 0,
})
</script>

<template>
  <div class="i-time">
    <input
      type="number"
      class="i-time__input_hours input"
      inputmode="numeric"
      min="0"
      step="1"
      placeholder="--"
      v-model="inputTime.hours"
    />
    <span class="i-time__colon">:</span>
    <input
      type="number"
      class="i-time__input_minutes input"
      inputmode="numeric"
      min="0"
      step="1"
      placeholder="--"
      v-model="inputTime.minutes"
    />
    <template v-if="showSeconds">
      <span class="i-time__colon">:</span>
      <input
        type="number"
        class="i-time__input_seconds input"
        inputmode="numeric"
        min="0"
        step="1"
        placeholder="--"
        v-model="inputTime.seconds"
      />
    </template>
  </div>
</template>

<style scoped>
.i-time {
  display: flex;
  gap: var(--indent-quarter);
}
</style>
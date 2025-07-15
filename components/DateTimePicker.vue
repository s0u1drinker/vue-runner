<script setup lang="ts">
const date = '15.07.2025'
const time = '19:45:07'

const computedDatetime = computed(() => {
  return `${date} ${time}`
})
</script>

<template>
  <div class="datetimepicker">
    DateTimePicker
    <template v-if="false">
      <input type="text" v-model="computedDatetime" />
      <TheCalendar v-model:date="date" />
      <InputTime v-model:time="time" />
    </template>
  </div>
</template>

<style scoped>
.datetimepicker {}
</style>
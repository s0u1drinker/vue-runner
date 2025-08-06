<script setup lang="ts">
import type { Lap } from '@/types/lap'

const laps = defineModel<Lap[]>({ default: [] })

const { lapDistance } = defineProps<{
  lapDistance: number
}>()
//
const showAddForm = ref<boolean>(false)
//
const tempNewLap = computed<Lap>(() => {
  return {
    idLap: (laps.value.length + 1),
    distance: lapDistance,
    heartRate: 0,
    lapTime: '00:00',
    totalTime: '00:00:00',
    pace: '00:00',
  }
})
// Флаг возможности добавления данных (необходимо, чтобы был передан параметр "длина круга").
const canAddLaps = computed<boolean>(() => {
  return lapDistance ? true : false
})
//
function closeEditForm(): void {
  showAddForm.value = false
}
//
function addNewLap(newLap: Lap): void {
  closeEditForm()
  laps.value.push(newLap)
}
</script>

<template>
  <div class="l-add">
    <span class="color_gray italic" v-if="!canAddLaps">Необходимо указать длину круга.</span>
    <div class="l-add__inner" v-else>
      <FormEditLap
        :lap="tempNewLap"
        @cancel="closeEditForm"
        @save="addNewLap"
        v-if="showAddForm"
      />
      <template v-else>
        <TableLaps :laps :lapDistance v-show="laps.length" />
        <button class="button button_blue" @click="showAddForm = true">Добавить</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.l-add {
  display: flex;
  flex-direction: column;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--indent);
  }
}
</style>
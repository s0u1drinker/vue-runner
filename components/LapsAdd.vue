<script setup lang="ts">
import type { Lap } from '@/types/lap'

const laps = defineModel<Lap[]>({ default: [] })

const { lapDistance } = defineProps<{
  lapDistance: number
}>()
// Флаг для отображения формы добавления/редактирования круга.
const showAddForm = ref<boolean>(false)
// Данные о круге, которые передаются в форму.
let lapToForm = reactive<Lap>({
  idLap: 1,
  distance: lapDistance,
  heartRate: 0,
  lapTime: '00:00',
  totalTime: '00:00:00',
  pace: '00:00',
})
// Флаг возможности добавления данных (необходимо, чтобы был передан параметр "длина круга").
const canAddLaps = computed<boolean>(() => {
  return lapDistance ? true : false
})
// Закрывает форму.
function closeForm(): void {
  showAddForm.value = false
}
// Открыть форму для добавления нового круга.
function addLap(): void {
  // Количество кругов.
  const lapsLength = laps.value.length
  // Шаблон нового круга.
  const newLap = {
    idLap: (lapsLength + 1),
    distance: lapDistance,
    heartRate: 0,
    lapTime: '00:00',
    pace: '00:00',
    totalTime: '00:00:00',
  }
  // Если есть данные в массиве laps.
  if (lapsLength) {
    // Индекс последнего круга.
    const lastLapIndex = lapsLength - 1
    // Обновляем данные в шаблоне значениями последнего круга.
    newLap.heartRate = laps.value[lastLapIndex].heartRate
    newLap.lapTime = laps.value[lastLapIndex].lapTime
    newLap.pace = laps.value[lastLapIndex].pace
    newLap.totalTime = laps.value[lastLapIndex].totalTime
  }

  // Отправляем в форму.
  lapToForm = { ...newLap }
  // Открываем форму.
  showAddForm.value = true
}
// Сохраняет данные о круге.
function saveLap(newLap: Lap): void {
  // Ищем круг с таким же идентификатором.
  const lapIndex = laps.value.findIndex((lap) => lap.idLap === newLap.idLap)
  // Если такой круг есть -
  if (lapIndex !== -1) {
    // заменяем на новые данные.
    laps.value.splice(lapIndex, 1, newLap)
  } else {
    // Иначе добавляем данные о новом круге.
    laps.value.push(newLap)
  }
  // Зкрываем форму.
  closeForm()
}
/**
 * Редактирование данных о круге.
 * @param idLap Идентификатор круга.
 */
function editLap(idLap: number): void {
  // Ищем круг с таким идентификатором.
  const lapToEdit = laps.value.find((lap) => lap.idLap === idLap)
  // Если найден -
  if (lapToEdit) {
    // копируем данные
    lapToForm = { ...lapToEdit }
    // и открываем форму.
    showAddForm.value = true
  }
}
/**
 * Удаление данных о круге.
 * @param idLap Идентификатор круга.
 */
function deleteLap(idLap: number): void {
  // Ищем круг с таким же идентификатором.
  const lapIndex = laps.value.findIndex((lap) => lap.idLap === idLap)
  // Если такой круг найден -
  if (lapIndex !== -1) {
    // удаляем.
    laps.value.splice(lapIndex, 1)
    // Корректировка идентификаторов.
    laps.value.forEach((item, index) => item.idLap = index + 1)
  }
}
</script>

<template>
  <div class="l-add">
    <span class="color_gray italic" v-if="!canAddLaps">Необходимо указать длину круга.</span>
    <div class="l-add__inner" v-else>
      <FormEditLap
        :lap="lapToForm"
        @cancel="closeForm"
        @save="saveLap"
        v-if="showAddForm"
      />
      <template v-else>
        <TableLaps
          :laps
          :lapDistance
          :showControls="true"
          @edit="editLap"
          @delete="deleteLap"
          v-show="laps.length"
        />
        <button class="button button_blue" @click="addLap">Добавить</button>
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
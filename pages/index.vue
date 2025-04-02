<script setup lang="ts">
import type {DocumentData, Firestore} from 'firebase/firestore'
import { collection, getDocs, QuerySnapshot } from 'firebase/firestore'
import { ref, onMounted } from 'vue'

interface Workout {
  id: string,
  dateStart: string,
  dateStop: string,
  distance: number
}

const { db } = useFirebase()
const workout = ref<Workout[]>([])

const fetchWorkout = async (): Promise<void> => {
  const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collection(db as Firestore, 'workout'))

  workout.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Workout))
}

onMounted(fetchWorkout)
</script>

<template>
  <h1>Статистика</h1>
  {{ workout }}
</template>

<style scoped></style>
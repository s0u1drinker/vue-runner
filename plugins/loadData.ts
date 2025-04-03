import { defineNuxtPlugin } from '#app';
import { useFirestore, useCollection } from 'vuefire';
import { collection } from 'firebase/firestore';
import { useWorkoutStore } from '@/stores/workoutStore';
import type { Workout } from '@/types/workout'

export default defineNuxtPlugin(async () => {
  const db = useFirestore();
  const workoutStore = useWorkoutStore();

  try {
    // Поднимаем флаг загрузки данных.
    workoutStore.setLoadingDataFlag(true);
    // Загружаем данные из Firestore.
    const workoutsRef = useCollection(collection(db, 'workout'));
    // Извлекаем данные, попутно добавляя идентификатор документа.
    const workouts: Workout[] = workoutsRef.value.map((doc) => ({ id: doc.id, ...doc })) as Workout[];
    // Сохраняем данные в хранилище.
    workoutStore.updateWorkoutInStore(workouts);
  } catch (error) {
    console.log(error || 'Failed to load data');
  } finally {
    // Снимаем флаг загрузки данных.
    workoutStore.setLoadingDataFlag(false);
  }
});
import { defineStore } from 'pinia'
import { getDataFromDB } from './utils/dataFromDB'
import type { Achievement } from '@/types/achievement'
import type { Lap } from '@/types/lap'
import type { Workout } from '@/types/workout'
import type { AchievementRating } from '~/types/achievementRating'

export const useAchievementStore = defineStore('achievement', {
  state: () => ({
    achievements: [] as Achievement[],
  }),
  getters: {
    getAchievementByOrder: (state) => {
      return (order: number): Achievement | null => {
        if (typeof order !== 'number') {
          console.error(`Неверный порядковый номер: ${order}. Ожидалось число.`)
          return null
        }

        return state.achievements.find((item) => item.order === order) ?? null
      }
    }
  },
  actions: {
    /**
     * Обновление данных из БД.
     */
    async updateAchievementsFromDB(): Promise<void> {
      this.achievements = (await getDataFromDB<Achievement>('achievements')).sort((a, b) => a.order - b.order)
    },
    /**
     * Пересчитывает рейтинги.
     * @param laps Круги добавленной тренировки.
     */
    async updateRatings(workout: Workout): Promise<void> {
      const lapsSeconds: number[] = workout.laps
        .filter((lap) => (lap.distance === workout.lapDistance))
        .map((lap) => timeToSeconds(lap.lapTime))
        .sort()
      const lapsSecondsLength: number = lapsSeconds.length
      const ratingTemplate: AchievementRating = {
        idWorkout: workout.id,
        time: '',
        workoutDate: prettyDate(workout.dateStart).date
      }
      let achievement: Achievement | null = null

      // 1 км
      achievement = this.getAchievementByOrder(1)
      if (achievement) {
        let updateFlag: boolean = false
        // Проверяем наличие рейтинга.
        if (achievement.rating.length) {
          // Перебираем.
          for (let lapSeconds of lapsSeconds) {
            const index = achievement.rating.length - 1
            // Если текущий элемент меньше последнего в рейтинге, то добавляем его в рейтинг. Иначе выходим из цикла.
            if (lapSeconds < timeToSeconds(achievement.rating[index].time)) {
              updateFlag = true
              ratingTemplate.time = secondsToTime(lapSeconds)
              achievement.rating.splice(index, 0, ratingTemplate)
            } else break
          }
          // Оставляем в рейтинге только первые 5 элементов.
          if (achievement.rating.length > 5) achievement.rating.length = 5
        } else {
          // Если рейтинга нет - берём первые пять элементов (или весь массив, если элементов меньше) и добавляем.
          const arrLength: number = lapsSecondsLength >= 5 ? 5 : lapsSecondsLength

          for (let i = 0; i < arrLength; i++) {
            updateFlag = true
            ratingTemplate.time = secondsToTime(lapsSeconds[i])
            achievement.rating[i] = ratingTemplate
          }
        }

        if (updateFlag) {
          // Обновление рейтинга в БД.
        }
      } else console.error(`Не найдена информация о достижении с порядковым номером ${1}.`)
    },
  },
})
<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { Lap } from '@/types/lap'
import type { WeatherByAPI } from '@/types/weatherByAPI'

type WorkoutField = keyof Workout

// TODO: Объединить с компонентом <FormEditLap>.
// TODO: Обновление достижений.

const weatherStore = useWeatherStore()
const notificationStore = useNotificationStore()
const { addWorkoutInDB, updateWorkoutInDB, getWorkoutForTheDay } = useWorkoutStore()
const { addModalLoader, addModalDialog, openModal, closeModal } = useModalStore()

const activityList = storeToRefs(useActivityStore()).getActivitiesForSelect
const weatherList = storeToRefs(weatherStore).getWeatherListForSelect

// Идентификатор модального окна при сохранении данных.
const idModalLoader = ref<string>('')
// Идентификатор модального окна, если найдена тренировка за указанный день.
const idModalDialog = ref<string>('')
// Данные о тренировке.
const formData = reactive<Workout>({
  id: '',
  trainingTime: '',
  distance: 0,
  dateStart: '',
  idActivity: '',
  idWeather: '',
  lapDistance: 1000,
  averagePace: '',
  heartrate: 0,
  temperature: 0,
  cadence: 0,
  climb: 0,
  weightBefore: 0,
  weightAfter: 0,
  comment: [],
  laps: <Lap[]>[],
})
const rulesToCheck = reactive<{ [key: string]: { cl: null | string[], isBadValue: () => boolean, errorText: string }}>({
  idActivity: {
    cl: null,
    isBadValue: (): boolean => !formData.idActivity,
    errorText: 'Необходимо выбрать активность.',
  },
  distance: {
    cl: null,
    isBadValue: (): boolean => (formData.distance <= 0),
    errorText: 'Неверно указана дистанция.',
  },
  trainingTime: {
    cl: null,
    isBadValue: (): boolean => !formData.trainingTime || (formData.trainingTime === '00:00:00'),
    errorText: 'Укажите время тренировки.',
  },
  averagePace: {
    cl: null,
    isBadValue: (): boolean => !formData.averagePace || (formData.averagePace === '00:00'),
    errorText: 'Укажите средний темп.',
  },
  heartrate: {
    cl: null,
    isBadValue: (): boolean => (formData.heartrate <= 0),
    errorText: 'Укажите пульс.',
  },
  weightBefore: {
    cl: null,
    isBadValue: (): boolean => (formData.weightBefore <= 0),
    errorText: 'Укажите вес до тренировки.',
  },
  weightAfter: {
    cl: null,
    isBadValue: (): boolean => (formData.weightAfter <= 0),
    errorText: 'Укажите вес после тренировки.',
  },
})
// Возможные сообщения при работе API.
const resultMessages: { [ key: string ]: string } = {
  error: 'Ошибка',
  success: 'Обновлено'
}
// Синхронизируем дату между клиентом и сервером.
const today = useState('today', () => new Date())
// Асинхронный запрос о погоде.
const { fetchWeather } = useWeather()
// Эффект пульсации после обновления данных (о погоде).
const { isAnimationInProgress, startAnimation, onAnimationEnd, animationClasses } = useAnimation('pulse-once')
// Сообщение об ошибке/успешной отправке.
const messageResultSubmitForm = ref<string>('')
// Флаг запроса данных о погоде по API.
const pendingDataFromWeatherAPI = ref<boolean>(false)
// Результат обновления данных о погоде по API.
const messageResultWeatherAPI = ref<string>('')
// Флаг статуса показа формы добавления нового круга.
const formAddIsShown = ref<boolean>(false)
// Флаг проверки формы.
const checkFormBeforeSubmit = ref<boolean>(false)
// Таймер для работы с показом сообщения.
const idTimeout = ref<ReturnType<typeof setTimeout>>()
// Флаг расчёта данных на основе информации о кругах:
// если пользователь добавил данные о кругах, то некоторые показатели расчитываются автоматически.
const calculationByLaps = computed<boolean>((): boolean => formAddIsShown.value || Boolean(formData.laps.length))
// Следим за количествои кругов и пересчитываем некоторые параметры.
watch(formData.laps, () => {
  // Значения по умолчанию.
  formData.distance = 0
  formData.trainingTime = '00:00:00'
  formData.heartrate = 0
  formData.averagePace = '00:00'
  // Если данные должны считаться автоматически (установлен флаг = длина массива с кругами больше 0).
  if (calculationByLaps.value) {
    let parameterValues = []
    // Считаем дистанцию.
    formData.distance = (formData.laps.reduce((sum, lap) => sum = lap.distance + sum, 0) / formData.lapDistance)
    // Так как время тренировки счмиаеися автоматом при добавлении круга, то просто забираем значение у последней записи.
    formData.trainingTime = formData.laps.slice(-1)[0].totalTime 
    // Среднее значение пульса: собираем данные из массива и считаем.
    parameterValues = formData.laps.flatMap((item) => item.heartRate)
    formData.heartrate = getAverage(parameterValues, parameterValues.length, 0)
    // Среднее значение темпа: собираем -> конвертируем -> считаем -> конвертируем обратно.
    parameterValues = formData.laps.flatMap((item) => timeToSeconds(item.pace))
    formData.averagePace = secondsToTime(getAverage(parameterValues, parameterValues.length, 0))
  }
})
// Очищаем строку с результатом запроса погоды по API.
watch(messageResultWeatherAPI, () => {
  clearTimeout(idTimeout.value)

  if(messageResultWeatherAPI.value) {
    idTimeout.value = setTimeout(() => messageResultWeatherAPI.value = '', 3000)
  }
})

onMounted(() => {
  getWeather(true)
  idModalLoader.value = addModalLoader('svg-spinners:12-dots-scale-rotate', 'Отправляем данные...')
})
// Запрос погоды.
async function getWeather(isInitialLoad: boolean = false): Promise<void> {
  let weatherByAPI: WeatherByAPI | null = null
  // Сбрасываем текущие данные и поднимаем флаг запроса.
  formData.temperature = 0
  formData.idWeather = ''
  messageResultWeatherAPI.value = ''
  pendingDataFromWeatherAPI.value = true
  // Ждём ответ.
  weatherByAPI = await fetchWeather()
  // Проверяем на ошибки.
  if (weatherByAPI) {
    if (!weatherByAPI.error) {
      // Получаем идентификатор погодного явления по описанию.
      const idWeather = weatherStore.getWeatherIdByDescription(weatherByAPI.description)
      // Если элемент найден - подставляем его идентификатор, иначе останется выбранным первый элемент.
      if (idWeather) formData.idWeather = idWeather
      // Обновляем температуру.
      formData.temperature = weatherByAPI.temperature
      // Вывод текста.
      messageResultWeatherAPI.value = resultMessages.success
      // Анимация.
      startAnimation('success')
      // Если функция запускается по клику на кнопке, то показываем уведомление.
      if (!isInitialLoad) {
        notificationStore.addNotification({
          type: 'success',
          text: 'Данные о погоде обновлены.',
        })
      }
    } else {
      messageResultWeatherAPI.value = resultMessages.error
      startAnimation('error')
      notificationStore.addNotification({
        type: 'error',
        text: 'Сервер погоды недоступен.',
      })
      console.error(`Ошибка при запросе погоды по API: ${weatherByAPI.description}`)
    }
  } else {
    messageResultWeatherAPI.value = resultMessages.error
    startAnimation('error')
    notificationStore.addNotification({
      type: 'error',
      text: 'Неизвестная ошибка. Попробуйте ещё раз.',
    })
    console.error('По /api/weather вернулось пустое значение.')
  }
  // Убираем флаг.
  pendingDataFromWeatherAPI.value = false
}
// Включает/отключает элементы в формею
function disableCalculatedElements(status: boolean): void {
  formAddIsShown.value = status
}
// Отправка формы.
function submitForm(): void {
  messageResultSubmitForm.value = ''
  checkFormBeforeSubmit.value = true

  // Начинаем проверять поля формы.
  for (let elementName in rulesToCheck) {
    // Проверяем значение.
    if (rulesToCheck[elementName].isBadValue()) {
      // Если вернулась ошибка, то вешаем классы.
      rulesToCheck[elementName].cl = [ 'animation_pulse', 'animation_pulse_red' ]
      // Выводим сообщение об ошибке.
      messageResultSubmitForm.value = rulesToCheck[elementName].errorText
      // Навешиваем временный watch, который при изменении некорректного значения
      const e = watch(() => formData[elementName as WorkoutField], () => {
        // очистит классы
        rulesToCheck[elementName].cl = null
        // и самоустранится.
        e()
      })
      checkFormBeforeSubmit.value = false
      break
    }
  }
  // Если нет сообщения об ошибке, то пробуем сохранить в БД.
  if (!messageResultSubmitForm.value) {
    if (idModalLoader.value) {
      // Проверяем есть ли в хранилище информация о тренировке за указанную дату.
      const idWorkout = getWorkoutForTheDay(formData.dateStart)

      if (idWorkout) {
        // Если есть - выводим диалоговое модальное окно.
        idModalDialog.value = addModalDialog(
          'Дата тренировки',
          `За указанную дату ${prettyDate(formData.dateStart).date} уже есть тренировка. Обновить данные?`,
          {
            close: {
              title: 'Нет',
            },
            confirm: {
              title: 'Да',
              action: buttonConfirmInModalDialog.bind(null, idWorkout),
            },
          }
        )
        openModal(idModalDialog.value)
        checkFormBeforeSubmit.value = false
      } else {
        saveWorkoutToDB()
      }
      
    } else console.error('Пустой идентификатор модального окна.')
  }
}
/**
 * Нажатие на кнопку "Да" в диалоговом модальном окне.
 * @param idWorkout Идентификатор тренировки.
 */
function buttonConfirmInModalDialog(idWorkout: string) {
  closeModal(idModalDialog.value)
  saveWorkoutToDB(idWorkout)
}
/**
 * Сохранение данных в БД. Если передан идентификатор тренировки, то обновляется запись, иначе добавляется новая.
 * @param idWorkoutToUpd Идентификатор тренировки (если нужно обновить).
 */
async function saveWorkoutToDB(idWorkoutToUpd?: string): Promise<void> {
  openModal(idModalLoader.value)

  const { result, idWorkout } = (idWorkoutToUpd && typeof idWorkoutToUpd === 'string')
    ? {
        result: await updateWorkoutInDB(idWorkoutToUpd, formData),
        idWorkout: idWorkoutToUpd
      }
    : await addWorkoutInDB(formData)

  if (result) {
    // Добавлено успешно - редирект на страницу с тренировкой.
    navigateTo({
      path: `/workout/${idWorkout}`,
      query: {
        // Передаём идентификатор модального окна, которое нужно закрыть.
        idModal: idModalLoader.value
      }
    })
  } else {
    // Какая-то ошибка при добавлении.
    messageResultSubmitForm.value = 'Ошибка при работе с БД.'
    closeModal(idModalLoader.value)
  }
}
// Очистка формы.
function clearForm(): void {
  messageResultSubmitForm.value = 'Форма будет очищена... скоро.'
}
</script>

<template>
  <form class="form-add" @submit.prevent @keydown.enter.stop>
    <div class="form-add__item">
      <div class="form-add__item-title">Активность:</div>
      <SelectCustom
        :class="rulesToCheck.idActivity.cl"
        :list="activityList"
        v-model="formData.idActivity"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Начало:</div>
      <DateTimePicker
        :date="today.toLocaleDateString()"
        :time="today.toLocaleTimeString()"
        v-model="formData.dateStart"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Длина круга (м):</div>
      <InputNumber
        :min="0"
        :step="100"
        v-model="formData.lapDistance"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Круги:</div>
      <LapsAdd
        :lapDistance="formData.lapDistance"
        @showFormToAddNewLap="disableCalculatedElements"
        v-model="formData.laps"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Дистанция (км):</div>
      <InputNumber
        :class="rulesToCheck.distance.cl"
        :float="2"
        :min="0"
        :disabled="calculationByLaps"
        v-model="formData.distance"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime
        :class="rulesToCheck.trainingTime.cl"
        :disabled="calculationByLaps"
        v-model:time="formData.trainingTime"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Средний темп:</div>
      <InputTime
        :class="rulesToCheck.averagePace.cl"
        :showHours="false"
        :disabled="calculationByLaps"
        v-model:time="formData.averagePace"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Пульс:</div>
      <InputNumber
        :class="rulesToCheck.heartrate.cl"
        :min="0"
        :disabled="calculationByLaps"
        v-model="formData.heartrate"
      />
    </div>
    <div class="form-add__item form-add__item_weather">
      <div class="flex flex_column">
        <div class="form-add__item">
          <div class="form-add__item-title">Температура:</div>
          <InputNumber
            :class="animationClasses"
            :min="-40"
            :max="60"
            :disabled="pendingDataFromWeatherAPI"
            @animationend="onAnimationEnd"
            v-model="formData.temperature"
          />
        </div>
        <div class="form-add__item">
          <div class="form-add__item-title">Погода:</div>
          <CarouselSimple
            :class="animationClasses"
            :items="weatherList"
            :disabled="pendingDataFromWeatherAPI"
            @animationend="onAnimationEnd"
            v-model="formData.idWeather"
          />
        </div>
      </div>
      <div class="flex flex_column">
        <button
          class="button button_blue"
          @click="getWeather()"
          :disabled="pendingDataFromWeatherAPI || isAnimationInProgress"
        >
          <Icon
            :name="pendingDataFromWeatherAPI ? 'svg-spinners:clock' : 'material-symbols:refresh-rounded'"
            size="1.25rem"
          />
          <span>{{ pendingDataFromWeatherAPI ? 'Ожидание' : 'Обновить' }}</span>
        </button>
        <p
          class="form-add__message"
          :class="`color_${messageResultWeatherAPI === resultMessages.error ? 'red' : 'green'}`"
        >{{ messageResultWeatherAPI }}</p>
      </div>
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Каденс:</div>
      <InputNumber :min="0" v-model="formData.cadence" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Набор высоты (м):</div>
      <InputNumber :min="0" v-model="formData.climb" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес до:</div>
      <InputNumber
        :class="rulesToCheck.weightBefore.cl"
        :float="1"
        :min="0"
        :step="0.1"
        v-model="formData.weightBefore"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес после:</div>
      <InputNumber
        :class="rulesToCheck.weightAfter.cl"
        :float="1"
        :min="0"
        :step="0.1"
        v-model="formData.weightAfter"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Комментарий:</div>
      <AddWorkoutCommentBadges v-model="formData.comment" />
    </div>
    <div class="form-add__item">
      <p class="form-add__message color_red">{{ messageResultSubmitForm }}</p>
    </div>
    <div class="form-add__item form-add__buttons">
      <button
        class="button button_outline_gray"
        @click="clearForm"
        :disabled="checkFormBeforeSubmit"
      >Очистить</button>
      <button
        type="submit"
        class="button button_blue"
        @click="submitForm"
        :disabled="checkFormBeforeSubmit"
      >Сохранить</button>
    </div>
  </form>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.form-add {
  margin-top: var(--indent-double);

  &__item {
    display: flex;
    flex-direction: column;
    gap: var(--indent-half);
    align-items: flex-start;

    @media (--viewport-sm) {
      flex-direction: row;
      gap: 0;
      width: fit-content;
    }

    & + & {
      margin-top: var(--indent);
    }

    &_weather {
      border: var(--border);
      border-radius: var(--border-radius);
      padding: var(--indent);
      gap: var(--indent);

      .button {
        width: 8.25rem;
      }

      .form-add__message {
        text-align: center;
        margin-top: .5rem;
      }
    }
  }

  &__item-title {

    @media (--viewport-sm) {
      transform: translateY(50%);
      width: 10rem;
      flex: none;
    }
  }

  &__message {
    min-height: 1.5rem;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    gap: var(--indent);
  }
}
</style>
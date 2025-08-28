<script setup lang="ts">
import type { Workout } from '@/types/workout'
import type { Lap } from '@/types/lap'
import type { WeatherByAPI } from '@/types/weatherByAPI'

// TODO: Объединить с компонентом <FormEditLap>.

const weatherStore = useWeatherStore()
const notificationStore = useNotificationStore()

const activityList = storeToRefs(useActivityStore()).getActivitiesForSelect
const weatherList = storeToRefs(weatherStore).getWeatherListForSelect

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
  comment: '',
  laps: <Lap[]>[],
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
const message = ref<string>('')
// Флаг запроса данных о погоде по API.
const pendingDataFromWeatherAPI = ref<boolean>(false)
// Результат обновления данных о погоде по API.
const messageResultWeatherAPI = ref<string>('')
// Флаг статуса показа формы добавления нового круга.
const formAddIsShown = ref<boolean>(false)
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
        text: 'Сервер недоступен.',
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
function sendForm(): void {
  message.value = 'Форма будет отправлена... не сейчас.'
}
// Очистка формы.
function clearForm(): void {
  message.value = 'Форма будет очищена... скоро.'
}
</script>

<template>
  <form class="form-add" @submit.prevent @keydown.enter.stop>
    <p class="form-add__temp-message">Извините, данная форма ещё в разработке.</p>
    <div class="form-add__item">
      <div class="form-add__item-title">Активность:</div>
      <SelectCustom
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
        :float="2"
        :min="0"
        :disabled="calculationByLaps"
        v-model="formData.distance"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Время:</div>
      <InputTime
        :disabled="calculationByLaps"
        v-model:time="formData.trainingTime"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Средний темп:</div>
      <InputTime
        :showHours="false"
        :disabled="calculationByLaps"
        v-model:time="formData.averagePace"
      />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Пульс:</div>
      <InputNumber
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
      <InputNumber :float="1" :min="0" :step="0.1" v-model="formData.weightBefore" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Вес после:</div>
      <InputNumber :float="1" :min="0" :step="0.1" v-model="formData.weightAfter" />
    </div>
    <div class="form-add__item">
      <div class="form-add__item-title">Комментарий:</div>
      <TextareaNative
        :rows="4"
        :placeholder="'Самочувствие / негативные или положительные моменты / обстановка вокруг и т.д. и т.п.'"
        :maxLength="120"
        v-model="formData.comment"
      />
    </div>
    <div class="form-add__item">
      <p class="form-add__message">{{ message }}</p>
    </div>
    <div class="form-add__item form-add__buttons">
      <button class="button button_outline_gray" @click="clearForm">Очистить</button>
      <button type="submit" class="button button_blue" @click="sendForm">Сохранить</button>
    </div>
  </form>
</template>

<style scoped>
@import '@/assets/css/media.postcss';

.form-add {
  margin-top: var(--indent-double);

  &__temp-message {
    color: var(--red);
    margin-bottom: var(--indent-double);
  }

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
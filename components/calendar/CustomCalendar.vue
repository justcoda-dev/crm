<template>
  <v-date-picker
      class="custom-calendar"
      expanded
      v-model.range="selectedDate"
      @did-move="onChangeMonth"
      :attributes="props.calendarList"
      :disabled-dates="disabledDates"
      mode="date"
  >
    <template #day-content="{attributes:[attribute],dayEvents, day, dayProps}">
      <div class="vc-day-ceil" v-on="dayEvents">
        <div class="vc-day-label-wrapper">
          <span class="vc-day-label">
            {{ day.day }}
          </span>
          <div class="vc-day-reserved-comment-wrapper">
            <p
                class="vc-day-reserved-comment"
                v-show="dayProps['aria-disabled']"
                :class="{reserved: dayProps['aria-disabled']}"
            >
              {{ attribute?.customData?.attributes?.name }}
              <br>
              {{ attribute?.customData?.attributes?.phone }}
              <br>
              {{ attribute?.customData?.total_price }} грн
              <slot
                  name="menu-reserved"
                  v-if="dayProps['aria-disabled']"
                  v-bind="{attribute, day}"
              />
            </p>
          </div>
        </div>
      </div>
    </template>
  </v-date-picker>
</template>

<script lang="ts" setup>

interface IProps {
  calendarList: [],
  currentPrice: object
}

const props = defineProps<IProps>()
const emit = defineEmits()
const selectedDate = ref({})

const disabledDates = computed(() => {
  return props.calendarList?.map(date => date.dates)
})

const weekendsPrice = computed(() => parseInt(props.currentPrice?.weekendsPrice))
const weekdaysPrice = computed(() => parseInt(props.currentPrice?.weekdaysPrice))

const mapSelectedDate = computed(() => {
  let res = {};
  for (const key in selectedDate.value) {
    res[key] = selectedDate.value[key].toString()
  }

  const start = new Date(selectedDate.value?.start)
  const end = new Date(selectedDate.value?.end)

  const filterDate = `${start.getFullYear()}-${start.getMonth() + 1}`

  let daysArray = []
  let daysCount = (end.getTime() - start.getTime()) / 1000 / 60 / 60 / 24 || 1
  let day = start.getDay();
  res.daysCount = daysCount
  while (daysCount > 0) {
    if (day < 7) {
      daysArray.push(day)
    } else {
      day = 0
      daysArray.push(day)
    }
    daysCount--
    day++
  }
  const saturday = 6;
  const sunday = 0;

  res.total_price = daysArray.reduce((prev, curr) => {
    if (saturday === curr || sunday === curr) {
      return prev + weekendsPrice.value
    } else {
      return prev + weekdaysPrice.value
    }
  }, 0)


  res.days = daysArray
  res.filter_date = filterDate
  return res
})

const onSelectDate = () => {
  emit("selectDate", mapSelectedDate.value)
}

const onChangeMonth = async ([month]) => {
  emit("changeMonth", month)
}


watch(() => selectedDate.value, () => {
  onSelectDate()
})

</script>

<style lang="scss">
$day-border: 1px solid #b8c2cc;
$day-border-highlight: 1px solid #b8c2cc;
$weekday-bg: #f8fafc;
$weekday-border: 1px solid #eaeaea;
$day-width: 40px;
$day-height: 90px;


.custom-calendar {
  width: 100%;
  border-radius: 0;

  .vc-header {
    margin: 5px 0;
  }

  .vc-weeks {
    padding: 0;
  }

  .vc-weekday {
    background: $weekday-bg;
    border-bottom: $weekday-border;
    border-top: $weekday-border;
    padding: 5px 0;
  }

  .vc-week {
    border-bottom: $day-border;

    &:last-child {
      border-bottom: none;
    }
  }

  .vc-day {
    position: relative;
    padding: 0 5px 3px 5px;
    text-align: left;
    height: $day-height;
    min-width: $day-width;
    background: #ffffff;
    @media (max-height: 700px) {
      height: 75px;
    }
    @media (max-width: 500px) {
      height: 70px;
    }

    &.weekday-1, &.weekday-7 {
      background: #eff8ff;
    }

    &:not(.on-right) {
      border-right: $day-border;
    }

    &.vc-day-dots {
      margin-bottom: 5px;
    }

    .vc-day-ceil {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }


  .vc-day-label-wrapper {
    display: inline-block;
    z-index: 10;
    overflow: hidden;
  }

  .vc-day-label {
    display: inline;
    position: relative;
    z-index: 1;
    font-size: 1rem;
    font-weight: 500;
    color: #333333;
  }

  .vc-day-reserved-comment-wrapper {
    float: left;
    display: block;
  }

  .vc-day-reserved-comment {
    font-size: 13px;
    text-align: center;
    color: white;
    font-weight: 500;
    text-indent: 15px;
    box-sizing: border-box;
    @media (max-width: 700px) {
      padding-top: 20px;
      text-indent: 0;
      font-size: 7px;
      text-wrap: normal;
      word-wrap: normal;
      word-break: break-word;
    }
  }

  .reserved {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #e53e3e;

  }
}


</style>
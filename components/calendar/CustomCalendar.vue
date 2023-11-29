<template>
  <v-date-picker
      class="custom-calendar"
      expanded mode="date"
      v-model.range="rangeDate"
      :masks="masks"
      :attributes="attributes"
  >
    <template v-slot:day-content="{attributes, day, dayEvents}">
      <div class="vc-day-ceil" v-on="dayEvents">
        <div class="vc-day-label-wrapper">
          <span class="vc-day-label">{{ day.day }}</span>
          <div class="vc-day-reserved-comment-wrapper">
            <p
                v-for="attr in attributes"
                :key="attr.key"
                class="vc-day-reserved-comment"
                :class="{reserved:attr.customData?.reserved}"
            >
              {{ attr.customData?.costumer }}
              <br>
              {{ attr.customData?.phone }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </v-date-picker>
</template>

<script lang="ts" setup>
const masks = ref({
  weekdays: "WWW"
})
const rangeDate = ref()
const onSubmitForm = () => {
}

const attributes = ref([{
  key: 1,
  popover: {
    label: "Koval Oleksandr Anatoliovych"
  },
  customData: {
    reserved: true,
    costumer: "Koval Oleksandr Anatoliovych",
    phone: "+380952823990"
  },
  dates: [
    new Date(2023, 11, 24),
    new Date(2023, 11, 25),
    new Date(2023, 11, 26),
  ]
}])

watch(() => rangeDate.value, () => {
  console.log(rangeDate.value)
})
onMounted(() => {
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
    display: flex;
    //flex-direction: column;
    z-index: 10;
    overflow: hidden;
  }

  .vc-day-label {
    display: inline;
    width: 25px;
    height: 25px;
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
    color: white;
    font-weight: 500;
    text-indent: 30px;
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
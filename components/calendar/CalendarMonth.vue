<template>
  <div class="calendar-month">
    <calendar-day
      v-for="day of props.days"
      :day="day"
      :selected="day.selected"
      :disabled="day.disabled"
      :startDate="day.startDate"
      :endDate="day.endDate"
      :reserved="day.reserved"
      @onClick="onDayClick"
      @onReservedClick="onReservedDayClick"
    >
    </calendar-day>
  </div>
</template>

<script lang="ts" setup>
import type { IDay } from "~/TS/Calendar";

interface IProps {
  days: Array<IDay>;
}

const props = defineProps<IProps>();
const emit = defineEmits(["onDayClick", "onReservedDayClick"]);

const onDayClick = (day: IDay) => {
  emit("onDayClick", day);
};
const onReservedDayClick = (day: IDay) => {
  emit("onReservedDayClick", day);
};
</script>

<style lang="scss">
.calendar-month {
  display: grid;
  grid-template-columns: repeat(7, 85px);
  grid-template-rows: repeat(6, 85px);
  gap: 1px;
}
</style>

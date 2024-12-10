<template>
  <div class="calendar-month">
    <template v-for="day of props.days" :key="day.id">
      <calendar-day
        :day="day"
        @onClick="onDayClick"
        @onReservedClick="onReservedDayClick"
      >
      </calendar-day>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { ICalendarDateCreate } from "~/TS/ICalendarDate";

interface IProps {
  days: ICalendarDateCreate[];
}

const props = defineProps<IProps>();
const emit = defineEmits(["onDayClick", "onReservedDayClick"]);

const onDayClick = (day: ICalendarDateCreate) => {
  emit("onDayClick", day);
};
const onReservedDayClick = (day: ICalendarDateCreate, type: string) => {
  emit("onReservedDayClick", day, type);
};
</script>

<style lang="scss">
.calendar-month {
  display: grid;
  grid-template-columns: repeat(7, 85px);
  grid-template-rows: repeat(6, 85px);
  gap: 1px;
  @media screen and (max-width: 600px) {
    grid-template-columns: repeat(7, 52px);
    grid-template-rows: repeat(6, 52px);
  }
}
</style>

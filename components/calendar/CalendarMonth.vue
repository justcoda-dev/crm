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
  width: 100%;
  height: 100%;
  display: grid;
  background: #22303e1f;
  gap: 1px;
  grid-template-columns: repeat(7, calc(100% / 7));
  grid-template-rows: repeat(6, calc(100% / 6));

  @media screen and (max-width: 600px) {
    // grid-template-rows: repeat(6, 62px);
  }
}
</style>

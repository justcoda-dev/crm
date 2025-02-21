<template>
  <div class="calendar-week">
    <template v-for="day of props.calendarWeek" :key="day.id">
      <calendar-day
        class="calendar-week__day"
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
  calendarWeek: ICalendarDateCreate[];
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
.calendar-week {
  width: 100%;
  display: flex;
  height: calc(100% / 6);
  &:last-child {
    .calendar-week__day {
      border-bottom: none;
    }
  }
  &__day {
    border-right: 1px solid #22303e1f;
    border-bottom: 1px solid #22303e1f;
    &:first-child {
      border-left: none;
    }
    &:last-child {
      border-right: none;
    }
  }
}
</style>

<template>
  <div class="calendar-month">
    <template v-for="(week, index) of calendarWeeks" :key="index">
      <calendar-week
        @onDayClick="onDayClick"
        @onReservedDayClick="onReservedDayClick"
        :calendarWeek="week"
      >
      </calendar-week>
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

const unFlat = (arr: any[], count: number) => {
  const result = [];
  for (
    let start = 0, end = count;
    start < arr.length;
    start += count, end += count
  )
    result.push(arr.slice(start, end));
  return result;
};

const calendarWeeks = computed(() => {
  const weeks = unFlat(props.days, 7);
  return weeks;
});

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
}
</style>

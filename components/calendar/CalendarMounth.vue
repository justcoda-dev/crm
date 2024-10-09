<template>
  <div class="calendar-mounth">
    <calendar-day
      v-for="day of props.days"
      :active="false"
      :day="day"
      @onClick="onDayClick"
    >
      {{ day.day }}
    </calendar-day>
  </div>
</template>

<script lang="ts" setup>
import type { IDay } from "~/TS/Calendar";

interface IProps {
  days: Array<IDay>;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onDayClick"]);
const onDayClick = (day: IDay) => {
  emit("onDayClick", day);
};
</script>

<style lang="scss">
.calendar-mounth {
  display: grid;
  grid-template-columns: repeat(7, 85px);
  grid-template-rows: repeat(6, 85px);
  gap: 1px;
}
</style>

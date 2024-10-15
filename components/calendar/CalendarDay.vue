<template>
  <div
    class="calendar-day"
    :class="{ active: props.day.selected }"
    @click="onDayClick"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { IDay } from "~/TS/Calendar";

interface IProps {
  day: IDay;
}
const props = defineProps<IProps>();

const emit = defineEmits(["onClick"]);
const onDayClick = () => {
  emit("onClick", { ...props.day });
};
</script>

<style lang="scss">
.calendar-day {
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.262);
  text-align: start;
  // aspect-ratio: 1/1;
}
.active {
  background: red;
}
</style>

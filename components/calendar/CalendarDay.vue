<template>
  <div
    class="calendar-day"
    :class="{
      selected: props.selected,
      disabled: props.disabled,
      reserved: props.reserved,
    }"
    @click="onDayClick"
  >
    <span class="calendar-day__day">{{ day.day }}</span>
    <div
      v-if="props.endDate"
      @click="onReservedClick"
      :class="{ end: props.endDate }"
    >
      Виїжає
    </div>
    <div
      v-if="props.startDate"
      @click="onReservedClick"
      :class="{ start: props.startDate }"
    >
      Заїжає
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { IDay } from "~/TS/Calendar";

interface IProps {
  day: IDay;
  reserved?: boolean;
  disabled?: boolean;
  selected?: boolean;
  startDate?: boolean;
  endDate?: boolean;
}

const props = defineProps<IProps>();

const emit = defineEmits(["onClick", "onReservedClick"]);
const onDayClick = () => {
  if (!props.disabled) {
    emit("onClick", { ...props.day });
  }
};
const onReservedClick = () => {
  if (props.endDate || props.startDate) {
    emit("onReservedClick", { ...props.day });
  }
};
</script>

<style lang="scss">
.calendar-day {
  width: 100%;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.262);
  text-align: start;
  position: relative;
  // aspect-ratio: 1/1;
  &__day {
    position: absolute;
    z-index: 1;
  }
}
.selected {
  background: red !important;
}
.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.reserved {
  background: rgba(0, 0, 255, 0.753);
}
.start {
  position: absolute;
  bottom: 0;
  height: 50%;
  width: 100%;
  background: purple;
}
.end {
  position: absolute;
  top: 0;
  height: 50%;
  width: 100%;
  background: greenyellow;
  text-indent: 30%;
}
</style>

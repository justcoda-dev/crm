<template>
  <div
    class="calendar-day"
    :class="{
      selected: props.day.selected,
      disabled: props.day.disabled,
      reserved: props.day.reserved,
    }"
    @click="onDayClick"
  >
    <span class="calendar-day__day">{{ day.day }}</span>
    <div
      v-if="props.day.end_date"
      @click.stop="onReservedDayClick('costumer_leave')"
      class="end"
    >
      <span>Виїзд</span>
    </div>
    <div
      v-if="props.day.start_date"
      @click.stop="onReservedDayClick('costumer_enter')"
      class="start"
    >
      <span>Заїзд</span>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { ICalendarDateCreate } from "~/TS/ICalendarDate";

interface IProps {
  day: ICalendarDateCreate;
}

const props = defineProps<IProps>();

const emit = defineEmits(["onClick", "onReservedClick"]);
const onDayClick = () => {
  if (!props.day.disabled && !props.day.selected) {
    emit("onClick", { ...props.day });
  }
};
const onReservedDayClick = (type: string) => {
  emit("onReservedClick", { ...props.day }, type);
};
</script>

<style lang="scss">
.calendar-day {
  width: 100%;
  height: 100%;
  background: #fff;
  color: #374451;
  text-align: start;
  position: relative;
  box-sizing: border-box;
  &__day {
    position: absolute;
    z-index: 1;
    left: 5px;
    top: 5px;
  }
}
.selected {
  background: #ffca28 !important;
}
.disabled {
  background: #0091ea;
  pointer-events: none;
  opacity: 0.3;
}
.reserved {
  background: #0091ea;
}
.start {
  position: absolute;
  bottom: 0;
  height: 50%;
  width: 100%;
  background: #26a69a;
  font-weight: 700;
  & span {
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  @media screen and (max-width: 600px) {
    font-size: 10px;
  }
}
.end {
  position: absolute;
  height: 50%;
  width: 100%;
  background: #e65100;
  font-weight: 700;
  & span {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  @media screen and (max-width: 600px) {
    font-size: 10px;
  }
}
</style>

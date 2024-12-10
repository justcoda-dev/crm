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
      :class="{ end: props.day.end_date }"
    >
      <span>Виїзд</span>
    </div>
    <div
      v-if="props.day.start_date"
      @click.stop="onReservedDayClick('costumer_enter')"
      :class="{ start: props.day.start_date }"
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.262);
  text-align: start;
  position: relative;

  &__day {
    position: absolute;
    z-index: 1;
  }
}
.selected {
  background: #ffca28 !important;
}
.disabled {
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
  @media screen and (max-width: 600px) {
    font-size: 10px;
    & span {
      position: absolute;
      left: 20%;
      top: 20%;
    }
  }
}
.end {
  position: absolute;
  top: 0;
  height: 50%;
  width: 100%;
  background: #e65100;
  text-indent: 30%;
  font-weight: 700;

  @media screen and (max-width: 600px) {
    font-size: 10px;
    & span {
      position: absolute;
      left: 20%;
      top: 20%;
    }
  }
}
</style>

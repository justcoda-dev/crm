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
      v-if="props.day.endDate"
      @click.stop="onReservedLeaveClick"
      :class="{ end: props.day.endDate }"
    >
      <span>Виїзд</span>
    </div>
    <div
      v-if="props.day.startDate"
      @click.stop="onReservedEnterClick"
      :class="{ start: props.day.startDate }"
    >
      <span>Заїзд</span>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import type { IDay } from "~/TS/IDay";

interface IProps {
  day: IDay;
}

const props = defineProps<IProps>();

const emit = defineEmits(["onClick", "onReservedClick"]);
const onDayClick = () => {
  if (!props.day.disabled && !props.day.selected) {
    emit("onClick", { ...props.day });
  }
};
const onReservedEnterClick = () => {
  emit("onReservedClick", { ...props.day, enter: true });
};
const onReservedLeaveClick = () => {
  emit("onReservedClick", { ...props.day, enter: false });
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

<template>
  <div class="calendar-header">
    <div class="calendar-header__navigation">
      <button @click="onPrevMounth"><</button>
      <div>select mounth</div>
      <button @click="onNextMounth">></button>
    </div>
    <div><slot></slot></div>
    <div class="calendar-header__days">
      <div class="calendar-header__day-name" v-for="day of days">{{ day }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const emit = defineEmits();
const onPrevMounth = () => {
  emit("prevMounth");
};
const onNextMounth = () => {
  emit("nextMounth");
};
</script>

<style lang="scss">
.calendar-header {
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  &__navigation {
    display: flex;
    justify-content: center;
  }
  &__days {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 85px);
  }
  &__day-name {
  }
}
</style>

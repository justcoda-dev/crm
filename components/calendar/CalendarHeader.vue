<template>
  <div class="calendar-header">
    <div class="calendar-header__navigation">
      <v-btn
        icon="mdi-chevron-left"
        variant="text"
        @click="onPrevMonth"
      ></v-btn>
      <div class="d-flex justify-center align-center"><slot></slot></div>
      <v-btn
        icon="mdi-chevron-right"
        variant="text"
        @click="onNextMonth"
      ></v-btn>
    </div>
    <div class="calendar-header__days">
      <template v-for="day of days" :key="day.id">
        <div class="calendar-header__day-name">{{ day }}</div>
      </template>
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
const emit = defineEmits(["prevMonth", "nextMonth"]);
const onPrevMonth = () => {
  emit("prevMonth");
};
const onNextMonth = () => {
  emit("nextMonth");
};
</script>

<style lang="scss">
.calendar-header {
  display: flex;
  flex-direction: column;

  &__navigation {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  &__days {
    width: 100%;
    display: grid;
    text-align: center;
    grid-template-columns: repeat(7, 85px);
    @media screen and (max-width: 600px) {
      grid-template-columns: repeat(7, 50px);
    }
  }
  &__day-name {
    @media screen and (max-width: 600px) {
      font-size: 10px;
    }
  }
}
</style>

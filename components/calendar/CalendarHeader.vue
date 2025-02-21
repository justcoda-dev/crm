<template>
  <div class="calendar-header">
    <div class="calendar-header__navigation my-5">
      <v-btn icon="mdi-chevron-left" @click="onPrevMonth"></v-btn>
      <div class="d-flex justify-center align-center text-h5">
        <slot></slot>
      </div>
      <v-btn icon="mdi-chevron-right" @click="onNextMonth"></v-btn>
    </div>
    <div class="calendar-header__days text-subtitle-1 font-weight-bold">
      <template v-for="day of days" :key="day.id">
        <div class="calendar-header__day-name py-2">{{ day }}</div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
const days = [
  "Понеділок",
  "Вівторок",
  "Середа",
  "Четвер",
  "П'ятниця",
  "Субота",
  "Неділя",
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
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #3b4651;

  &__navigation {
    display: flex;
    justify-content: space-around;
  }
  &__days {
    width: 100%;
    display: grid;
    text-align: center;
    grid-template-columns: repeat(7, calc(100% / 7));
    border-top: 1px solid #22303e1f;
    border-bottom: 1px solid #22303e1f;
  }
  &__day-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.87;
    @media screen and (max-width: 600px) {
      font-size: 10px;
    }
  }
}
</style>

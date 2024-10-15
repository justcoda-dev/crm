<template>
  <v-container class="py-4">
    <Calendar @selectDates="onSelectDates"> </Calendar>
  </v-container>
</template>

<script lang="ts" setup>
const onSelectDates = (dates: { start: any; end: any }) => {
  console.log(dates);
};
</script>

<style></style>

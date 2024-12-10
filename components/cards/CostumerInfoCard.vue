<template>
  <v-card class="pa-4">
    <v-card-title class="text-center">
      {{ props.costumer.name }}
    </v-card-title>
    <p class="text-center">{{ props.costumer.phone }}</p>
    <v-card-text v-if="props.costumerDate" class="text-center py-2 px-8">
      <p>з {{ props.costumerDate?.start }} по {{ props.costumerDate?.end }}</p>
      <p>Загальна ціна {{ props.costumerDate?.total_price }} грн</p>
    </v-card-text>
    <v-card-actions class="mx-auto">
      <v-btn
        variant="text"
        class="mx-2"
        @click="onClickDelete(props.costumer)"
        >{{ $t("button-delete") }}</v-btn
      >

      <v-btn variant="text" class="mx-2" @click="onClickCancel">{{
        $t("button-close")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { ICalendarDateFromDb } from "~/TS/ICalendarDate";
import type { ICostumer } from "~/TS/ICostumer";

interface IProps {
  costumer: ICostumer;
  costumerDate?: ICalendarDateFromDb;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onDelete", "onCancel", "onEdit"]);

const onClickDelete = (costumer: ICostumer) => {
  emit("onDelete", { ...costumer });
};
const onClickCancel = () => {
  emit("onCancel");
};
</script>

<style lang="scss"></style>

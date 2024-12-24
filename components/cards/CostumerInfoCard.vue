<template>
  <v-card class="pa-3">
    <v-card-title>
      {{ props.costumer.name }}
    </v-card-title>
    <v-card-text class="pa-6" v-if="props.costumerDate">
      <v-list>
        <v-list-item
          >Мобільний телефон:
          <a href="tel:{{ props.costumer.phone }}">{{
            props.costumer.phone
          }}</a></v-list-item
        >
        <v-list-item>
          Заброньований з {{ props.costumerDate?.start }} по
          {{ props.costumerDate?.end }}
        </v-list-item>
        <v-list-item>
          Загальна ціна складає {{ props.costumerDate?.total_price }} грн
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions class="mx-auto">
      <v-btn
        class="mr-4"
        color="error"
        @click="onClickDelete(props.costumer)"
        >{{ $t("button-delete") }}</v-btn
      >

      <v-btn variant="tonal" @click="onClickCancel">{{
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

<template>
  <v-card class="pa-4 costumer-info-card">
    <h3 class="costumer-info-card__text">
      {{ props.costumer.name }}
    </h3>
    <h3 class="costumer-info-card__text">
      {{ props.costumer.phone }}
    </h3>
    {{ props.costumer }}
    <slot name="information"></slot>
    <div class="mx-auto mt-4">
      <v-btn variant="tonal" @click="onClickDelete(props.costumer)">{{
        $t("button-delete")
      }}</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import type { ICostumer } from "~/TS/ICostumer";

interface IProps {
  costumer: ICostumer;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onDelete"]);

const onClickDelete = (costumer: ICostumer) => {
  emit("onDelete", { ...costumer });
};
</script>

<style lang="scss">
.costumer-info-card {
  width: 100%;

  background-color: #fff;
  &__text {
    text-align: center;
  }
}
</style>

<template>
  <v-card>
    <v-card-actions>
      <v-btn color="primary" outlined @click="onCreateNew">
        {{ $t("button-create.new-costumer") }}
      </v-btn>
      <v-btn color="primary" outlined @click="onCreate">
        {{ $t("button-create.costumer") }}
      </v-btn>
      <v-btn color="primary" outlined @click="onCancel">
        {{ $t("button-cancel") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
interface IProps {}

const props = defineProps<IProps>();
const emit = defineEmits(["createNewCostumer", "createCostumer", "cancel"]);

const show = ref();

const onCreateNew = () => {
  emit("createNewCostumer");
};
const onCreate = () => {
  emit("createCostumer");
};
const onCancel = () => {
  emit("cancel");
};
</script>

<style lang="scss" scoped></style>

<template>
  <v-overlay activator="parent" location-strategy="static" origin="bottom">
    <v-card class="align-self-end">
      <v-card-actions>
        <v-list class="d-flex-center w-100">
          <v-list-item class="pa-6 text-center" @click="onDelete">
            {{ $t("button-delete") }}
          </v-list-item>
          <v-list-item class="pa-6 text-center" @click="onEdit">
            {{ $t("button-edit") }}
          </v-list-item>
          <v-list-item class="mb-3 pa-6 text-center" @click="onCancel">
            {{ $t("button-cancel") }}
          </v-list-item>
        </v-list>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script lang="ts" setup>
interface IProps {
  attribute: object;
}

const props = defineProps<IProps>();

const emit = defineEmits();
const {
  public: { apiBase },
} = useRuntimeConfig();

const onDelete = () => {
  emit("delete", props.attribute?.key);
};
const onEdit = () => {
  emit("edit", {
    dates: props.attribute?.dates,
    costumer: props.attribute?.customData,
  });
};
const onCancel = () => {};
</script>

<style lang="scss" scoped>
:deep(.v-card-actions) {
  width: 100%;
}
:deep(.v-overlay__content) {
  bottom: 0;
  width: 100%;
}
</style>

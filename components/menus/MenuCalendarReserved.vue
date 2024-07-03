<template>
  <v-menu activator="parent" location="end">
    <v-card>
      <v-card-actions>
        <v-btn color="primary" outlined @click="onDelete">
          {{ $t("button-delete") }}
        </v-btn>
        <v-btn color="primary" outlined @click="onEdit">
          {{ $t("button-edit") }}
        </v-btn>
        <v-btn color="primary" outlined @click="onCancel">
          {{ $t("button-cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
import type { ID } from "~/TS/myTypes";

interface IProps {
  attribute: {
    customData: {
      id: ID;
      attributes: any;
    };
    key: string;
  };
}

const props = defineProps<IProps>();
const emit = defineEmits();

const costumer = computed(() => {
  if (props.attribute) {
    return {
      id: props.attribute.customData.id,
      ...props.attribute.customData.attributes,
    };
  } else {
    return {};
  }
});

const onDelete = () => {
  emit("delete", props.attribute.key);
};
const onEdit = () => {
  emit("edit", costumer);
};
const onCancel = () => {};
</script>

<style lang="scss" scoped></style>

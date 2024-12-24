<template>
  <v-form @submit.prevent="onSubmit">
    <v-card class="pa-3">
      <v-card-title>{{ props.title }}</v-card-title>
      <v-card-text class="pa-6">
        <template v-for="key of keys">
          <v-text-field
            class="pa-3"
            v-model="form[key]"
            :hide-no-data="hideNoData"
          />
        </template>
        <v-card-actions class="pa-3"
          ><v-btn class="mr-4" type="submit" color="primary">
            {{ $t("button-submit") }}
          </v-btn>
          <v-btn variant="tonal" @click="onCancel">
            {{ $t("button-cancel") }}
          </v-btn></v-card-actions
        >
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
interface IProps {
  initialState: { [key: string]: any };
  title?: string;
}
const emit = defineEmits(["onSubmit", "onCancel"]);
const props = defineProps<IProps>();
const keys = Object.keys(props.initialState);
const form = ref(props.initialState);
const hideNoData = ref(false);

const onSubmit = () => {
  emit("onSubmit", form.value);
};
const onCancel = () => {
  emit("onCancel");
};
</script>

<style></style>

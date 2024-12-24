<template>
  <v-card class="pa-3">
    <v-card-title>{{ setting.title }}</v-card-title>
    <v-card-text class="pa-6">
      <template
        v-for="(setting, index) of props.setting.component"
        :key="setting.id"
      >
        <component
          :is="components[setting.__component]"
          v-bind="componentProps(setting)[setting.__component]"
          v-on="componentEvents(setting, index)[setting.__component]"
        ></component>
      </template>
      <v-card-actions class="align-self-end">
        <v-btn class="mr-3" color="primary" @click="onSumbit">{{
          $t("button-submit")
        }}</v-btn>
        <v-btn variant="tonal" @click="onCancel">{{
          $t("button-cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { VCheckbox, VTextField } from "vuetify/components";
// в потрібно від кількості робити масив з масивами
interface IProps {
  setting: any;
}
const emit = defineEmits();

const props = defineProps<IProps>();
const components = shallowRef<{ [key: string]: any }>({
  "input.text-input": VTextField,
  "input.checkbox-option": VCheckbox,
});

const setting = ref(props.setting);
const componentEvents = (optionComponent: any, index: number) => {
  return {
    "input.text-input": {
      "update:modelValue": (value: string) => {
        setting.value = { ...props.setting };
        setting.value.component = [...setting.value.component];
        setting.value.component[index] = { ...optionComponent, value };
        emit("update:modelValue", { ...setting.value });
      },
    },
    "input.checkbox-option": {
      "update:modelValue": (value: boolean) => {
        setting.value = { ...props.setting };
        setting.value.component = [...setting.value.component];
        setting.value.component[index] = { ...optionComponent, value };
        emit("update:modelValue", { ...setting.value });
      },
    },
  };
};
const componentProps = (optionComponent: { value: any; title: string }) => {
  return {
    "input.text-input": {
      modelValue: optionComponent.value,
      label: optionComponent.title,
    },
    "input.checkbox-option": {
      modelValue: optionComponent.value,
      label: optionComponent.title,
      checked: optionComponent.value,
      color: "primary",
    },
  };
};

const onSumbit = () => {
  emit("onSubmit");
};
const onCancel = () => {
  emit("onCancel");
  emit("update:modelValue");
};
</script>

<style></style>

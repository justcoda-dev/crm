<template>
  <div v-if="props.type">
    <div>{{ copyOptionItem.title }}</div>
    <component
      :is="componentTypes[props.type]"
      v-model="copyOptionItem.value"
    ></component>
    <v-btn :disabled="buttonSaveDisabled" @click="onSaveClick">{{
      t("button-save")
    }}</v-btn>
    <v-btn
      class="ml-2"
      :disabled="buttonCancelDisabled"
      @click="onCancelClick"
      >{{ t("button-cancel") }}</v-btn
    >
  </div>
</template>

<script lang="ts" setup>
import { VCheckbox, VTextField } from "vuetify/components";

interface IProps {
  type: string;
  optionItem: any;
}

const props = defineProps<IProps>();
const emit = defineEmits();
const { t } = useI18n();

const componentTypes = shallowRef({
  checkbox_option: VCheckbox,
  text_option: VTextField,
});

const copyOptionItem = ref({ ...props.optionItem });
const optionValue = ref();
const buttonSaveDisabled = ref(true);
const buttonCancelDisabled = ref(true);

const onCancelClick = () => {
  copyOptionItem.value = { ...props.optionItem };
};
const onSaveClick = () => {
  emit("onSave", { value: copyOptionItem.value, type: props.type });
  buttonCancelDisabled.value = true;
  buttonSaveDisabled.value = true;
};

watch(
  () => copyOptionItem.value,
  ({ value }) => {
    if (value === props.optionItem.value) {
      buttonCancelDisabled.value = true;
      buttonSaveDisabled.value = true;
    } else if (value.length === 0) {
      buttonCancelDisabled.value = false;
      buttonSaveDisabled.value = true;
    } else {
      buttonCancelDisabled.value = false;
      buttonSaveDisabled.value = false;
    }
  },
  { deep: true }
);
</script>

<style></style>

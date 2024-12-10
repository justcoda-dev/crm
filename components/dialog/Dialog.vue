<template>
  <component
    v-if="client"
    :is="dialogComponents[dialogComponent]"
    v-bind="dialogProps"
    v-on="dialogEvents"
  >
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
import { VDialog } from "vuetify/components";
import { VBottomSheet } from "vuetify/components";
import { useMyMobileStore } from "~/store/mobile";
import type { Component } from "vue";
interface IProps {
  component?: Component;
}
const props = defineProps<IProps>();
const emit = defineEmits(["update:modelValue"]);
const client = ref();
const { mobile } = storeToRefs(useMyMobileStore());

const dialogComponentShow = ref<boolean>(false);
const dialogComponent = ref<string>("VDialog");
const dialogComponents = shallowRef(<{ [key: string]: Component }>{
  VDialog,
  VBottomSheet,
});

const dialogProps = computed(() => ({
  modelValue: dialogComponentShow.value,
}));

const dialogEvents = {
  "update:modelValue": (value: boolean) => {
    dialogComponentShow.value = value;
    emit("update:modelValue", value);
  },
};

onMounted(() => (client.value = true));
watchEffect(() => {
  if (mobile.value) {
    dialogComponent.value = "VBottomSheet";
  } else {
    dialogComponent.value = "VDialog";
  }
});
</script>

<style lang="scss"></style>

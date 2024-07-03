<template>
  <v-card>
    <v-card-item>
      <v-card-text>
        <v-btn @click="onSave" :disabled="disabled">{{
          t("button-save")
        }}</v-btn>
        <v-btn class="ml-2" @click="onCancel" :disabled="disabled">{{
          t("button-cancel")
        }}</v-btn>
        <v-list class="ma-2">
          <v-list-item v-for="(item, index) of list" :key="item.id">
            <v-row>
              <v-col class="my-auto">{{ item.title }}</v-col>
              <v-col
                ><v-text-field
                  variant="underlined"
                  :placeholder="item.title"
                  :value="item.value"
                  @update:modelValue="onInput($event, index)"
                  @update:focused="onFocused($event, index)"
              /></v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
interface IProps {
  list: any[];
  disabled: boolean;
}
const props = defineProps<IProps>();
const emit = defineEmits([
  "onSaveClick",
  "onFocused",
  "onCancelClick",
  "onInput",
]);
const { t } = useI18n();
const onSave = () => {
  emit("onSaveClick");
};
const onFocused = (value: boolean, index: number) => {
  emit("onFocused", { value, index });
};
const onCancel = () => {
  emit("onCancelClick");
};
const onInput = (value: string, index: number) => {
  emit("onInput", { value, index });
};
</script>

<style></style>

<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    return-object
  ></v-data-table>
</template>

<script lang="ts" setup>
interface IProps {
  usersList: any[];
  search: string;
}
const { t } = useI18n();

const selected = defineModel("selected");

const props = defineProps<IProps>();

const items = computed(() => {
  if (props.usersList.length) {
    return props.usersList.map((item) => {
      return reactive({
        id: item.id,
        name: item.attributes.name,
        phone: item.attributes.phone,
      });
    });
  } else {
    return [];
  }
});
const headers = computed(() => {
  if (!items.value.length) {
    return [];
  }
  const keys = Object.keys(items.value[0]);
  return keys
    .filter((item) => item !== "id")
    .map((key) => ({
      title: t(`title.${key}`),
      value: key,
      key,
    }));
});
</script>

<style scoped></style>

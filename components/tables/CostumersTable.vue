<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    :search="search"
    show-select
    return-object
  >
    <template #item.name="{ item }">
      <NuxtLink @click="onClick(item.id)">
        {{ item.name }}
      </NuxtLink>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { ICostumer } from "~/TS/ICostumer";
import type { ID } from "~/TS/myTypes";

interface IProps {
  costumersList: ICostumer[];
  search: string;
}
const props = defineProps<IProps>();
const selected = defineModel("selected");
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const onClick = (id: ID) => {
  router.push({ path: `${route.path}/costumer`, query: { id } });
};
const items = computed(() => {
  if (props.costumersList.length) {
    return props.costumersList.map((item) => {
      return reactive({
        id: item.id,
        name: item.name,
        phone: item.phone,
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

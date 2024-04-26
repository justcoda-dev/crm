<template>
  <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
      item-value="id"
      :loading="loading"
      v-model:search="search"
      show-select
      return-object
  >
    <template #header.data-table-select>
      <v-checkbox-btn></v-checkbox-btn>
    </template>
    <template #item.data-table-select>
      <v-checkbox-btn></v-checkbox-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import {useI18n} from "vue-i18n";

interface IProps {
  usersList: []
}

const {t} = useI18n()
const search = defineModel("search")
const props = defineProps<IProps>()

console.log(props.usersList)
const selected = ref()
const items = computed(() => props.usersList?.map(item => {
  return {
    id: item.id,
    user: {
      name: item.attributes?.name,
      phone: item.attributes?.phone,
    }
  }
}))

const headers = computed(() => {
  const keys = Object.keys(items.value?.[0]?.user || {});
  if (!keys.length) {
    return []
  } else {
    return keys.map(key => {
      return {title: t(`title.${key}`), value: `user.${key}`, key};
    });
  }
});

const loading = computed(() => !!props.items?.value?.length)
watch(selected, () => {
  console.log(selected.value)
  console.log(selected)
})
</script>

<style scoped>

</style>
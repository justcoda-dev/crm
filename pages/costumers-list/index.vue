<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
            :label="$t('text-field.search')"
            append-inner-icon="mdi-magnify"
        />
      </v-col>
      <v-col>
        <v-btn>{{ $t('button-add') }}</v-btn>
      </v-col>
    </v-row>
    <users-table :usersList="mapCostumersList"/>
  </v-container>

</template>

<script lang="ts" setup>

import UsersTable from "../../components/tables/UsersTable.vue";

const {public: {apiBase}} = useRuntimeConfig()
const {
  data: costumers,
  refresh: refreshCostumers,
} = await useFetch(() =>
    `${apiBase}/costumers`)

const mapCostumersList = computed(() => {
  return costumers.value?.data
})
</script>

<style scoped>

</style>
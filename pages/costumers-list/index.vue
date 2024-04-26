<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
            v-model="search"
            :label="$t('text-field.search')"
            append-inner-icon="mdi-magnify"
            density="compact"
        />
      </v-col>
      <v-col>
        <v-btn @click="onOpenCreateForm">{{ $t('button-add') }}</v-btn>
      </v-col>
    </v-row>

    <users-table
        v-model:search="search"
        :usersList="costumersList"
    />

    <v-dialog v-model="showCreateCostumerForm">
      <v-card class="pa-4">
        <template #title>
          {{ $t('title.create-user') }}
        </template>
        <create-costumer-form
            @keyup.esc="onCancelCostumerCreateForm"
            @cancelCLick="onCancelCostumerCreateForm"
            @submitForm="onSubmitCreateForm"
        />
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script lang="ts" setup>

import UsersTable from "../../components/tables/UsersTable.vue";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue"
import {useI18n} from "vue-i18n";

const {public: {apiBase}} = useRuntimeConfig()
const {t} = useI18n()
const {
  data: costumers,
  refresh: refreshCostumers,
} = await useFetch(() =>
    `${apiBase}/costumers`)

const costumersList = computed(() => costumers.value?.data)

const search = ref("")

const showCreateCostumerForm = ref(false)

const onOpenCreateForm = () => {
  showCreateCostumerForm.value = true
}

const onCancelCostumerCreateForm = () => {
  showCreateCostumerForm.value = false
}
const onSubmitCreateForm = async (formData: object) => {
  showCreateCostumerForm.value = false

  const responseCostumers = await useFetch(`${apiBase}/costumers`, {
    method: "POST",
    body: {
      data: {
        ...formData
      }
    }
  })
  refreshCostumers()
}
</script>

<style scoped>

</style>
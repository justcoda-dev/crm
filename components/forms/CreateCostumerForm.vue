<template>
  <v-form @submit.prevent="onSubmitForm">
    <v-text-field placeholder="name" v-model="createForm.name"/>
    <v-text-field placeholder="phone" v-model="createForm.phone"/>
  </v-form>
</template>

<script lang="ts" setup>
const emit = defineEmits()
const initialCreateForm = {
  name: "",
  phone: ""
}

const createForm = ref(initialCreateForm)

const onSubmitForm = () => {
  emit("onSubmit", createForm.value)
  createForm.value = initialCreateForm
}
</script>

<style scoped>

</style>
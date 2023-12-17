<template>
    <keep-alive>
      <component
          @onChangeComponent="onChangeComponent"
          :is="components[currentComponent]"
      />
    </keep-alive>
</template>

<script lang="ts" setup>
import LoginForm from "../../components/forms/LoginForm.vue"
import RegistrationForm from "../../components/forms/RegistrationForm.vue"

const meta = definePageMeta({
  layout: "authorization"
})

const currentComponent = ref("LoginForm")
const components = {
  LoginForm,
  RegistrationForm
}

const onChangeComponent = (componentName) => {
  currentComponent.value = componentName
}
</script>

<style scoped>

</style>
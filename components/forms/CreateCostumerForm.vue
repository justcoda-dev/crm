<template>
  <v-form @submit.prevent="onSubmitForm">
    <v-combobox
        :label="$t('text-field.name.placeholder')"
        v-model="createForm.name"
        :items="usersFromDb"
        :disabled="disabledForms"

    >
      <template #item="{item, props}">
        <div class="py-2 px-2 v-combobox__select-item" :value="item.title"
             @click="onClick({item, props})">
          {{ item.title }}
        </div>
      </template>
    </v-combobox>
    <v-combobox
        :label="$t('text-field.phone.placeholder')"
        v-model="createForm.phone"
        :disabled="disabledForms"
    />
    <v-btn type="submit" class="ml-4" :disabled="disabledSubmitBtn">
      {{ $t("button-submit") }}
    </v-btn>
    <v-btn class="ml-4" @click="onCancel">
      {{ $t("button-cancel") }}
    </v-btn>
  </v-form>
</template>

<script lang="ts" setup>
const emit = defineEmits()
const {public: {apiBase}} = useRuntimeConfig()
const debounceTimeMs = 300;

const initialCreateForm = {
  name: "",
  phone: "",
  userFromDb: false,
  userId: null
}

const createForm = ref(initialCreateForm)
const usersFromDb = ref([])
const disabledSubmitBtn = ref(true)
const disabledForms = ref(false)

const onClick = ({item, props}: { item: object, props: object }) => {
  props.onClick()
  createForm.value.phone = item.props?.phone
  createForm.value.userId = item.raw?.id
  createForm.value.userFromDb = true
  disabledForms.value = true
}


const onSubmitForm = () => {
  emit("submitForm", createForm.value)
  createForm.value = initialCreateForm
}

const onCancel = () => {
  emit("cancelCLick")
}

watch(() => createForm.value.name, _debounce(async (value) => {
  try {
    if (value && value.length > 3 || value?.title?.length) {
      const {data} = await $fetch(`${apiBase}/costumers?filters[name][$startsWith]=${typeof value === 'string' ? value : value.title}`)
      usersFromDb.value = data.map(user => {
        return {
          id: user.id,
          title: user.attributes?.name,
          props: {
            name: user.attributes?.name,
            phone: user.attributes?.phone
          },
          attributes: user.attributes
        }
      })
      disabledSubmitBtn.value = false
    } else {
      usersFromDb.value = []
      disabledSubmitBtn.value = true
    }
  } catch (e) {
    console.error("create form watcher err", e)

  }
}, debounceTimeMs))
//
// watch(() => createForm.value.phone, _debounce(async (value) => {
//
//   try {
//     if (value && value.length > 5) {
//       const {data} = await $fetch(`${apiBase}/costumers?filters[phone][$startsWith]=${value}`)
//       usersFromDb.value = data.map(user => {
//         return {
//           id: user.id,
//           title: user.attributes?.name,
//           props: {
//             name: user.attributes?.name,
//             phone: user.attributes?.phone
//           },
//           attributes: user.attributes
//         }
//       })
//     } else {
//       usersFromDb.value = []
//     }
//   } catch (e) {
//     console.error("create form watcher err", e)
//   }
// }, debounceTimeMs))


</script>

<style lang="scss" scoped>
.v-combobox {
  &__select-item {
    cursor: pointer;
  }
}
</style>
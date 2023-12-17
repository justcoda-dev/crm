<template>
  <v-form @submit.prevent="onSubmitForm">
    <v-combobox
        :label="$t('text-field.name.placeholder')"
        v-model="createForm.name"
        :items="usersFromDb"
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
interface IProps {
  editCostumer: object
}

const props = defineProps<IProps>()
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
const disabledSubmitBtn = ref(false)


createForm.value = {
  name: props.editCostumer?.costumer?.attributes?.name,
  phone: props.editCostumer?.costumer?.attributes?.phone,
  userFromDb: true,
  userId: props.editCostumer?.costumer?.id,
}

const onClick = ({item, props}: { item: object, props: object }) => {
  props.onClick()
  createForm.value.phone = item.props?.phone
  createForm.value.userId = item.raw?.id
  createForm.value.userFromDb = true
}


const onSubmitForm = () => {
  emit("submitForm", createForm.value)
  createForm.value = initialCreateForm
}

const onCancel = () => {
  emit("cancelCLick")
}

</script>

<style lang="scss" scoped>
.v-combobox {
  &__select-item {
    cursor: pointer;
  }
}
</style>
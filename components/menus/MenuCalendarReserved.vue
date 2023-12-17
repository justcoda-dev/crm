<template>
  <v-menu
      activator="parent"
      location="end"
  >
    <v-card>
      <v-card-actions>
        <v-btn color="primary" outlined @click="onDelete">
          {{ $t('button-delete') }}
        </v-btn>
        <v-btn color="primary" outlined @click="onEdit">
          {{ $t('button-edit') }}
        </v-btn>
        <v-btn color="primary" outlined @click="onCancel">
          {{ $t('button-cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts" setup>
interface IProps {
  attribute: object
}

const props = defineProps<IProps>()

const emit = defineEmits()
const {public: {apiBase}} = useRuntimeConfig()

const onDelete = () => {
  emit("delete", props.attribute?.key)
}
const onEdit = () => {
  emit("edit", {dates: props.attribute?.dates, costumer: props.attribute?.customData})
}
const onCancel = () => {

}


</script>

<style lang="scss" scoped>

</style>
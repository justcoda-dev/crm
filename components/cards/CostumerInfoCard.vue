<template>
  <div class="costumer-info-card">
    <h3>{{ props.costumer.name }}</h3>
    <h3>{{ props.costumer.phone }}</h3>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  costumer: any;
}
const props = defineProps<IProps>();
</script>

<style lang="scss">
.costumer-info-card {
}
</style>

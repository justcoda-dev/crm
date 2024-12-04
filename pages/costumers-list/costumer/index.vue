<template>
  <div>{{ costumerFromDb.data }}</div>
</template>
<script lang="ts" setup>
const app = useNuxtApp();
const route = useRoute();
console.log(route.query.id);
const { data: costumerFromDb }: { data: any; refresh?: any } =
  await app.$useApiFetch(`costumers/${route.query.id}`);
console.log(costumerFromDb);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useMyMobileStore } from "./store/mobile";

const store = useMyMobileStore();
onBeforeMount(() => {
  store.checkViewPort();
});
</script>

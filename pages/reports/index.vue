<template>
  <div :class="name === 'xs' ? 'ma-0' : 'ma-6'"></div>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { name } = useDisplay();
</script>

<style></style>

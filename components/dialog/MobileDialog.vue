<template>
  <v-dialog>
    <slot></slot>
  </v-dialog>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
:deep(.v-overlay__content) {
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100% !important;
  width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
}
</style>

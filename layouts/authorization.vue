<template>
  <v-app>
    <v-container class="pa-6 h-100 flex">
      <slot />
    </v-container>
  </v-app>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

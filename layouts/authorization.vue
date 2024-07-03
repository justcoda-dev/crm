<template>
  <v-app>
    <v-container class="h-100 flex">
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

<template>
  <v-app>
    <Header :headerMenuList="headerMenuList"/>
    <v-main>
      <slot/>
    </v-main>
  </v-app>
</template>
<script lang="ts" setup>

const headerMenuList = [{
  id: 1, path: "/calendar", title: "menuItem.calendar",
  iconName: "mdi-view-dashboard"
}, {
  id: 2, path: "/costumers-list", title: "menuItem.costumers-list",
  iconName: "mdi-view-dashboard"
}, {
  id: 3, path: "/options", title: "menuItem.options",
  iconName: "mdi-view-dashboard"
}]

</script>
<style scoped></style>

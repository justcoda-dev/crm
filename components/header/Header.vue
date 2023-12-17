<template>
  <v-app-bar>
    <v-app-bar-nav-icon
        variant="text"
        @click.stop="onMenuToggle"
    />
    <v-toolbar-title>
      {{ $t('mainTitle') }}
    </v-toolbar-title>
    <v-spacer/>
    <v-btn
        variant="text"
        icon="mdi-dots-vertical"
    />
    <v-btn icon="mdi-export"/>
  </v-app-bar>
  <v-navigation-drawer
      v-model="menuToggle"
      temporary
  >
    <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        title="John Leider"
    />
    <v-divider/>
    <v-list density="compact" nav>
      <template v-for="menuItem of props.headerMenuList">
        <NuxtLink
            :to="menuItem.path"
        >
          <v-list-item
              :prepend-icon="menuItem.iconName"
              :title="$t(menuItem.title)"
          />
        </NuxtLink>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>

type MenuItem = {
  id: string | number;
  title: string;
  path: string;
  iconName: string;
}

interface IProps {
  headerMenuList: [];
}

const props = defineProps<IProps>()
const menuToggle = ref(false)
const onMenuToggle = () => menuToggle.value = !menuToggle.value
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
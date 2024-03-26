<template>
  <v-table fixed-header :height="`calc(100vh - 160px)`">
    <thead>
    <tr>
      <th>
        <v-checkbox/>
      </th>
      <th>
        <v-btn-toggle>
          <v-btn>{{ $t('title.name') }}</v-btn>
        </v-btn-toggle>

      </th>
      <th>
        <v-btn-toggle>
          <v-btn>{{ $t('title.phone') }}</v-btn>
        </v-btn-toggle>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item of props.usersList" :key="item.id">
      <td>
        <v-checkbox/>
      </td>
      <td>{{ item.attributes?.name }}</td>
      <td>{{ item.attributes?.phone }}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup>
interface IProps {
  usersList: []
}

const props = defineProps<IProps>()
</script>

<style scoped>

</style>
<template>
  <v-card>
    <v-card-item>
      <v-card-text>
        <v-list class="ma-2">
          {{ props.item }}
          <template v-for="type of itemKeys">
            <v-list-item>
              <v-row>
                <template v-for="(optionItem, index) of itemCopy[type]">
                  <v-col>
                    {{ optionItem }}
                    <options-card-item
                      @onSave="onSaveClick(index, $event)"
                      :type="type"
                      :optionItem="optionItem"
                    />
                  </v-col>
                </template>
              </v-row>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import { VCheckbox, VTextField } from "vuetify/components";
import OptionsCardItem from "./OptionsCardItem.vue";

interface IProps {
  item: any;
}

const props = defineProps<IProps>();

const emit = defineEmits();

const { t } = useI18n();

// const itemCopy = ref(
//   _cloneDeep({
//     ...props.item,
//   })
// );

// const itemKeys = computed(() => {
//   if (itemCopy.value) {
//     return Object.entries(itemCopy.value)
//       .map(([key, value]) => {
//         if (Array.isArray(value) && value.length) {
//           return key;
//         }
//       })
//       .filter((value) => value !== undefined);
//   } else {
//     return [];
//   }
// });

// const onSaveClick = (
//   index: number,
//   { value, type }: { value: any; type: string }
// ) => {
//   itemCopy.value[type].splice(index, 1, { ...value });

//   emit("onSave", { ...itemCopy.value });
// };
</script>

<style></style>

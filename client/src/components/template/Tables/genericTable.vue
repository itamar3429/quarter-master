<script
  setup
  lang="ts"
  generic="Key extends string | number, T extends Record<string, any> & { key: Key }"
>
import { computed, ref, toRef, type Ref } from 'vue';
import TableCheckboxCell from '@/components/template/Tables/TableCheckboxCell.vue';
import BaseButtons from '@/components/template/Elements/BaseButtons.vue';
import BaseButton from '@/components/template/Elements/BaseButton.vue';
import usePaginate from '../../../hooks/usePaginate';
import TablePagination from './tablePagination.vue';
import CardBox from '../Cards/CardBox.vue';
import CardBoxComponentBody from '../Cards/CardBoxComponentBody.vue';
import CardBoxComponentEmpty from '../Cards/CardBoxComponentEmpty.vue';

const props = defineProps<{
  checkable?: boolean;
  items: T[];
  columns: {
    key: string;
    title: string;
    btn?: {
      icon?: string;
      text?: string;
      color?: string;
      onClick: (item: T, event: PointerEvent) => any;
      rounded?: boolean;
    }[];
  }[];
  paginate?: boolean;
}>();

const data = computed(() => props.items);

const { forComponent, paginatedResults } = usePaginate(data);

const checkedRows: Ref<T[]> = ref([]);

const checked = (isChecked, item: T) => {
  if (isChecked) {
    checkedRows.value.push(item);
  } else {
    checkedRows.value = checkedRows.value.filter((x) => x.key != item.key);
  }
};
</script>

<template>
  <template v-if="items.length">
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in paginate ? paginatedResults : items" :key="item.key">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, item)" />
          <td
            v-for="(col, i) in columns"
            :key="col.key"
            :class="col.btn ? 'before:hidden lg:w-1 whitespace-nowrap' : ''"
            :data-label="col.title"
          >
            <BaseButtons v-if="col.btn" type="justify-start lg:justify-end" no-wrap>
              <BaseButton
                v-for="(btn, j) in col.btn"
                :key="j"
                :color="btn.color"
                :icon="btn.icon"
                small
                @click="(event) => btn.onClick(item, event)"
                :rounded-full="btn.rounded"
              />
            </BaseButtons>
            <template v-else>{{ item[col.key] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <TablePagination v-if="paginate" v-bind="forComponent()" />
  </template>
  <template v-else>
    <CardBox>
      <CardBoxComponentBody>
        <CardBoxComponentEmpty></CardBoxComponentEmpty>
      </CardBoxComponentBody>
    </CardBox>
  </template>
</template>

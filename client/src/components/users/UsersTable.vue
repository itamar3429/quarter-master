<template>
  <GenericTable
    :items="
      usersStore.users.data
        .filter((x) => (usersStore.showActive ? !x.deleted_date : x.deleted_date))
        .map((x) => ({
          key: x.id,
          username: x.username,
          role: x.role,
          battalion:
            x.role == 'battalion'
              ? orgStore.org.data.find((y) => y.battalion_id == x.level_id)?.battalion_name
              : x.role == 'platoon'
                ? orgStore.org.data.find((y) => y.platoons.find((z) => z.platoon_id == x.level_id))
                    ?.battalion_name
                : '',
          platoon:
            x.role == 'platoon'
              ? orgStore.org.data
                  .map((y) => {
                    return y.platoons.find((z) => z.platoon_id == x.level_id)?.platoon_name;
                  })
                  .filter(Boolean)[0]
              : '',
          created_date: $d(
            DateTime.fromISO(x.created_date, { zone: serverZone }).toLocal().toJSDate(),
            'short_date',
          ),
        }))
    "
    :columns="[
      {
        key: 'username',
        title: $t('users.username'),
      },
      {
        key: 'role',
        title: $t('users.role'),
      },
      {
        key: 'battalion',
        title: $t('org.battalion'),
      },
      {
        key: 'platoon',
        title: $t('org.platoon'),
      },
      {
        key: 'created_date',
        title: $t('global.created_date'),
      },
      {
        key: 'edit',
        title: '',
        btn: [
          {
            color: usersStore.showActive ? 'danger' : 'success',
            icon: usersStore.showActive ? mdiTrashCan : mdiDeleteRestore,
            onClick(item, event) {
              deleteRestoreUser(item.key, !!usersStore.showActive);
            },
          },
          {
            color: 'info',
            icon: mdiPencil,
            onClick(item, event) {
              state.showEdit = true;
              state.userID = item.key;
            },
          },
        ],
      },
    ]"
  ></GenericTable>
  <EditUserModal v-model="state.showEdit" :user-i-d="state.userID"></EditUserModal>
</template>

<script setup lang="ts">
import GenericTable from '../template/Tables/genericTable.vue';
import { useUsersStore } from '@/stores/userStore';
import { mdiDeleteRestore, mdiPencil, mdiTrashCan } from '@mdi/js';
import { useOrgStore } from '@/stores/orgStructure';
import { DateTime } from 'luxon';
import { serverZone } from '@/constants';
import { reactive } from 'vue';
import EditUserModal from './EditUserModal.vue';
import fetchService from '@/services/fetch.service';
import type { UpdateUser } from '@/services/types/users';

const usersStore = useUsersStore();

const orgStore = useOrgStore();

const state = reactive({
  showEdit: false,
  userID: 0,
});

const deleteRestoreUser = async (userID: number, deleted: boolean) => {
  const res = await fetchService<UpdateUser>({
    body: {
      deleted,
    },
    method: 'put',
    url: `/users/${userID}`,
  });
  if (res?.success) {
    Object.assign(usersStore.users.data.find((u) => u.id == res.data.id) || {}, res.data);
  }
};
</script>

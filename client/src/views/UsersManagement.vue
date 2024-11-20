<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccountMultiple" :title="$t('nav.users')">
        <AddUserModal></AddUserModal>
      </SectionTitleLineWithButton>
      <div class="w-52 mb-3">
        <FormField>
          <FormControl
            type="select"
            :options="[
              { id: 1, label: $t('users.active') },
              {
                id: 0,
                label: $t('users.deleted'),
              },
            ]"
            :icon="mdiDeleteSweep"
            v-model="usersStore.showActive"
          ></FormControl>
        </FormField>
      </div>
      <CardBox class="mb-6" has-table>
        <UsersTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup lang="ts">
import CardBox from '@/components/template/Cards/CardBox.vue';
import FormControl from '@/components/template/form/FormControl.vue';
import FormField from '@/components/template/form/FormField.vue';
import SectionMain from '@/components/template/Sections/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/template/Sections/SectionTitleLineWithButton.vue';
import AddUserModal from '@/components/users/AddUserModal.vue';
import UsersTable from '@/components/users/UsersTable.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { useUsersStore } from '@/stores/userStore';
import { mdiAccountMultiple, mdiDeleteSweep } from '@mdi/js';

const usersStore = useUsersStore();
//
</script>

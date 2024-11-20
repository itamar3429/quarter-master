import { fetchComputed } from '@/hooks/fetchComputed';
import type { GetUsers } from '@/services/types/users';
import { defineStore } from 'pinia';
import { watch } from 'vue';

export const useUsersStore = defineStore('users-store', {
  state() {
    const users = fetchComputed<GetUsers>(
      () => {
        return {
          method: 'get',
          url: '/users/list',
        };
      },
      {
        defVal: [],
      },
    );
    return {
      users: users,
      showActive: 1,
    };
  },
});

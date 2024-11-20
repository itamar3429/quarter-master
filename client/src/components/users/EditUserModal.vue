<template>
  <CardBoxModal
    v-model="show"
    :title="$t('users.edit')"
    has-cancel
    @cancel="
      {
        state.username = '';
        state.role = roles[0].id;
      }
    "
    :btn-props="{
      disabled: !validation.valid || state.loading,
      loading: state.loading,
    }"
    @confirm="save"
  >
    <CardBox>
      <FormField :label="$t('users.username')" :help="validation.username">
        <FormControl v-model="state.username" type="text"> </FormControl>
      </FormField>
      <FormField :label="$t('users.password')" :help="validation.password">
        <FormControl v-model="state.password" type="password"> </FormControl>
      </FormField>
      <FormField :label="$t('users.role')" :help="validation.role">
        <FormControl v-model="state.role" name="role" :options="roles" type="select"> </FormControl>
      </FormField>
      <FormField
        :label="$t('org.battalion')"
        v-show="state.role == 'battalion' || state.role == 'platoon'"
        :help="validation.battalion"
      >
        <FormControl v-model="state.battalion" name="role" :options="battalions" type="select">
        </FormControl>
      </FormField>
      <FormField
        :label="$t('org.platoon')"
        v-show="state.role == 'platoon'"
        :help="validation.platoon"
      >
        <FormControl v-model="state.platoon" name="role" :options="platoons" type="select">
        </FormControl>
      </FormField>
      <NotificationBar v-show="!!state.error" color="danger" small @dismiss="state.error = ''">{{
        state.error
      }}</NotificationBar>
    </CardBox>
  </CardBoxModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch, type ComputedRef } from 'vue';
import BaseButton from '../template/Elements/BaseButton.vue';
import CardBoxModal from '../template/Cards/CardBoxModal.vue';
import CardBox from '../template/Cards/CardBox.vue';
import FormControl from '../template/form/FormControl.vue';
import FormField from '../template/form/FormField.vue';
import { asyncComputed } from '@/hooks/asyncComputed';
import fetchService from '@/services/fetch.service';
import { type PostUser, type UpdateUser, type ValidateUsername } from '@/services/types/users';
import { accessEnums } from '@/constants';
import type { TRole } from '@/services/types';
import { isAllowedFor } from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { useOrgStore } from '@/stores/orgStructure';
import NotificationBar from '../template/NotificationBar.vue';
import { useUsersStore } from '@/stores/userStore';

const props = defineProps<{
  modelValue: boolean;
  userID: number;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
}>();

const { t } = useI18n();

const orgStore = useOrgStore();
const usersStore = useUsersStore();

const user = computed(() => {
  return usersStore.users.data.find((x) => x.id == props.userID);
});
const userBattalion = computed(() => {
  const u = user.value;
  if (!u || u.role == 'admin') return;
  return orgStore.org.data.find((x) => {
    if (u.role == 'battalion') return x.battalion_id == u.level_id;
    return x.platoons.find((y) => y.platoon_id == u.level_id);
  });
});
const userPlatoon = computed(() => {
  if (!userBattalion.value || user.value!.role !== 'platoon') return;
  return userBattalion.value.platoons.find((x) => x.platoon_id == user.value!.level_id);
});

const roles = computed(() => {
  return (Object.keys(accessEnums) as TRole[])
    .filter((x) => isAllowedFor(x))
    .map((x) => ({
      id: x,
      label: t('org.' + x),
    }));
});

const battalions = computed(() => {
  return orgStore.org.data.map((x) => ({
    id: x.battalion_id,
    label: x.battalion_name,
  }));
});

const state = reactive({
  username: '',
  password: '',
  role: roles.value[0]?.id,
  battalion: (battalions.value[0]?.id as number) || null,
  platoon: null as number | null,
  loading: false,
  error: '',
  success: '',
});

const platoons: typeof battalions = computed(() => {
  return (
    orgStore.org.data
      .find((x) => x.battalion_id == state.battalion)
      ?.platoons.map((x) => ({
        id: x.platoon_id,
        label: x.platoon_name,
      })) || []
  );
});

state.platoon = platoons.value[0]?.id || null;

const show = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const isValid = asyncComputed(
  async () => {
    if (state.username.length < 3 || state.username.length > 50) return false;
    if (state.username == user.value?.username) return true;
    const data = await fetchService<ValidateUsername>({
      method: 'post',
      url: '/users/validate-username',
      body: {
        username: state.username,
      },
    });
    return !!data?.success && !!data.valid;
  },
  {
    defVal: false,
    resetOnLoad: true,
    watchers: [() => state.username],
    debounce: 500,
  },
);

const validation = computed(() => {
  const errors = {
    username: '',
    password: '',
    role: '',
    battalion: '',
    platoon: '',
    valid: true,
  };

  if (!isValid.data.value) {
    errors.username = t('global.name_invalid');
    errors.valid = false;
  }
  if (state.password && !/[a-zA-z0-9!#]{6,20}/.test(state.password)) {
    errors.password = t('users.password_invalid');
    errors.valid = false;
  }
  if (!roles.value.find((x) => x.id == state.role)) {
    errors.role = t('global.invalid_selection');
    errors.valid = false;
  }
  if (
    (state.role == 'battalion' || state.role == 'platoon') &&
    !battalions.value.find((x) => x.id == state.battalion)
  ) {
    errors.battalion = t('global.invalid_selection');
    errors.valid = false;
  }
  if (state.role == 'platoon' && !platoons.value.find((x) => x.id == state.platoon)) {
    errors.platoon = t('global.invalid_selection');
    errors.valid = false;
  }
  return errors;
});

const save = async () => {
  state.loading = true;
  state.error = '';
  if (!validation.value.valid) return;
  const res = await fetchService<UpdateUser>({
    body: {
      password: state.password || undefined,
      username: state.username,
      role: state.role,
      level_id: state.role == 'admin' ? 0 : state[state.role]!,
    },
    method: 'put',
    url: `/users/${props.userID}`,
  });
  if (res?.success) {
    Object.assign(usersStore.users.data.find((x) => x.id == res.data.id) || {}, res.data);
    state.success = t('global.save_success');
  } else {
    state.error = t('global.500');
  }
  state.loading = false;
};

watch(battalions, () => {
  state.battalion = battalions.value[0]?.id ?? null;
});
watch(platoons, () => {
  state.platoon = platoons.value[0]?.id ?? null;
});

watch([user, () => props.modelValue], () => {
  if (user.value && props.modelValue) {
    state.username = user.value.username;
    state.role = user.value.role;
    if (userBattalion.value) state.battalion = userBattalion.value.battalion_id;
    if (userPlatoon.value) state.platoon = userPlatoon.value.platoon_id;
  }
});
watch(userBattalion, () => {
  if (userBattalion.value) state.battalion = userBattalion.value.battalion_id;
});
watch(userPlatoon, () => {
  if (userPlatoon.value) state.platoon = userPlatoon.value.platoon_id;
});
</script>

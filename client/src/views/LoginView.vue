<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { mdiAccount, mdiAsterisk, mdiClose } from '@mdi/js';
import SectionFullScreen from '@/components/template/Sections/SectionFullScreen.vue';
import CardBox from '@/components/template/Cards/CardBox.vue';
import FormField from '@/components/template/form/FormField.vue';
import FormControl from '@/components/template/form/FormControl.vue';
import BaseButton from '@/components/template/Elements/BaseButton.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import { useAuthStore } from '../stores/authStore';
import NotificationBar from '../components/template/NotificationBar.vue';
import { useI18n } from 'vue-i18n';

const form = reactive({
  username: '',
  pass: '',
  remember: true,
  loading: false,
  error: ''
});

const authStore = useAuthStore();

const router = useRouter();
const i18n = useI18n();
const submit = async () => {
  form.loading = true;

  const loggedIn = await authStore.login(form.username, form.pass);
  console.log(loggedIn);

  if (loggedIn) {
    router.push(authStore.redirectUrl || '/');
    authStore.redirectUrl = '';
  } else {
    form.error = i18n.t('login.error');
  }
  form.loading = false;
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField :label="$t('login.username')" :help="$t('login.username_ins')">
          <FormControl
            v-model="form.username"
            :icon="mdiAccount"
            name="username"
            autocomplete="username"
            required
          />
        </FormField>

        <FormField :label="$t('login.password')" :help="$t('login.password_ins')">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </FormField>
        <NotificationBar v-if="form.error" color="danger">
          {{ form.error }}
          <template #right>
            <BaseButton
              :icon="mdiClose"
              small
              rounded-full
              color="danger"
              @click="form.error = ''"
            />
          </template>
        </NotificationBar>

        <BaseButton type="submit" color="info" :label="$t('login.i')" :loading="form.loading" />
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

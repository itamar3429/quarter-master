<script setup lang="ts">
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import menuAside from '@/menuAside';
import menuNavBar from '@/menuNavBar';
import { useDarkModeStore } from '@/stores/darkMode';
import BaseIcon from '@/components/template/Elements/BaseIcon.vue';
import FormControl from '@/components/template/form/FormControl.vue';
import NavBar from '@/components/template/Layout/NavBar.vue';
import NavBarItemPlain from '@/components/template/Layout/NavBarItemPlain.vue';
import AsideMenu from '@/components/template/Layout/AsideMenu.vue';
import FooterBar from '@/components/template/form/FooterBar.vue';

const layoutAsidePadding = 'xl:pl-60';

const darkModeStore = useDarkModeStore();

const router = useRouter();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

router.beforeEach(() => {
  isAsideMobileExpanded.value = false;
  isAsideLgActive.value = false;
});

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.setDarkMode();
  }

  if (item.isLogout) {
    router.push('/logout');
    //
  }
};
</script>

<template>
  <div
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
    }"
  >
    <div
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar
        :menu="menuNavBar()"
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        @menu-click="menuClick"
      >
        <NavBarItemPlain
          display="flex lg:hidden"
          @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
        >
          <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="isAsideLgActive = true">
          <BaseIcon :path="mdiMenu" size="24" />
        </NavBarItemPlain>
        <NavBarItemPlain use-margin>
          <FormControl placeholder="Search (ctrl+k)" ctrl-k-focus transparent borderless />
        </NavBarItemPlain>
      </NavBar>
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside()"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />
      <slot />
      <FooterBar> Quarter Master - © Copyrights all rights reserved</FooterBar>
    </div>
  </div>
</template>

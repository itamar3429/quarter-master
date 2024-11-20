import {
  // mdiMenu,
  // mdiClockOutline,
  // mdiCloud,
  // mdiCrop,
  // mdiAccount,
  // mdiCogOutline,
  // mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiTranslate,
} from '@mdi/js';
import { useI18n } from 'vue-i18n';

export default function navMenuItems() {
  const { t } = useI18n();

  return [
    // {
    //   icon: mdiMenu,
    //   label: 'Sample menu',
    //   menu: [
    //     {
    //       icon: mdiClockOutline,
    //       label: 'Item One'
    //     },
    //     {
    //       icon: mdiCloud,
    //       label: 'Item Two'
    //     },
    //     {
    //       isDivider: true
    //     },
    //     {
    //       icon: mdiCrop,
    //       label: 'Item Last'
    //     }
    //   ]
    // },
    {
      isCurrentUser: true,
      menu: [
        // {
        //   icon: mdiAccount,
        //   label: 'My Profile',
        //   to: '/profile'
        // },
        // {
        //   icon: mdiCogOutline,
        //   label: 'Settings'
        // },
        // {
        //   icon: mdiEmail,
        //   label: 'Messages'
        // },
        {
          icon: mdiTranslate,
          label: 'עברית',
          lang: 'he',
        },
        {
          icon: mdiTranslate,
          label: 'English',
          lang: 'en',
        },
        {
          isDivider: true,
        },
        {
          icon: mdiLogout,
          label: t('nav.logout'),
          isLogout: true,
        },
      ],
    },
    {
      icon: mdiThemeLightDark,
      label: 'Light/Dark',
      isDesktopNoLabel: true,
      isToggleLightDark: true,
    },
    // {
    //   icon: mdiGithub,
    //   label: 'GitHub',
    //   isDesktopNoLabel: true,
    //   href: 'https://github.com/justboil/admin-one-vue-tailwind',
    //   target: '_blank'
    // },
    // {
    //   icon: mdiReact,
    //   label: 'React version',
    //   isDesktopNoLabel: true,
    //   href: 'https://github.com/justboil/admin-one-react-tailwind',
    //   target: '_blank'
    // },
    {
      icon: mdiLogout,
      label: t('nav.logout'),
      isDesktopNoLabel: true,
      isLogout: true,
    },
  ];
}

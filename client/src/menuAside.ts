import { mdiHome, mdiAccountMultiple, mdiHomeCity } from '@mdi/js';
import { useI18n } from 'vue-i18n';
import { isAllowedFor } from './utils/auth';

export default function getMenuItems() {
  const i18n = useI18n();

  return [
    {
      to: '/',
      icon: mdiHome,
      label: i18n.t('nav.home'),
    },
    {
      to: '/org',
      icon: mdiHomeCity,
      label: i18n.t('nav.org'),
      hide: !isAllowedFor('battalion'),
    },
    {
      to: '/users',
      icon: mdiAccountMultiple,
      label: i18n.t('nav.users'),
    },
    // {
    //   to: '/tables',
    //   label: 'Tables',
    //   icon: mdiTable
    // },
    // {
    //   to: '/forms',
    //   label: 'Forms',
    //   icon: mdiSquareEditOutline
    // },
    // {
    //   to: '/ui',
    //   label: 'UI',
    //   icon: mdiTelevisionGuide
    // },
    // {
    //   to: '/responsive',
    //   label: 'Responsive',
    //   icon: mdiResponsive
    // },
    // {
    //   to: '/',
    //   label: 'Styles',
    //   icon: mdiPalette
    // },
    // {
    //   to: '/profile',
    //   label: 'Profile',
    //   icon: mdiAccountCircle
    // },
    // {
    //   to: '/login',
    //   label: 'Login',
    //   icon: mdiLock
    // },
    // {
    //   to: '/error',
    //   label: 'Error',
    //   icon: mdiAlertCircle
    // },
    // {
    //   label: 'Dropdown',
    //   icon: mdiViewList,
    //   menu: [
    //     {
    //       label: 'Item One'
    //     },
    //     {
    //       label: 'Item Two'
    //     }
    //   ]
    // },
    // {
    //   href: 'https://github.com/justboil/admin-one-vue-tailwind',
    //   label: 'GitHub',
    //   icon: mdiGithub,
    //   target: '_blank'
    // },
    // {
    //   href: 'https://github.com/justboil/admin-one-react-tailwind',
    //   label: 'React version',
    //   icon: mdiReact,
    //   target: '_blank'
    // }
  ];
}

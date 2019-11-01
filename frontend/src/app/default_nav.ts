interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/page/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/page/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/page/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Components'
  },
  {
    name: 'Base',
    url: '/page/base',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'Cards',
        url: '/page/base/cards',
        icon: 'icon-puzzle'
      },
      {
        name: 'Carousels',
        url: '/page/base/carousels',
        icon: 'icon-puzzle'
      },
      {
        name: 'Collapses',
        url: '/page/base/collapses',
        icon: 'icon-puzzle'
      },
      {
        name: 'Forms',
        url: '/page/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Pagination',
        url: '/page/base/paginations',
        icon: 'icon-puzzle'
      },
      {
        name: 'Popovers',
        url: '/page/base/popovers',
        icon: 'icon-puzzle'
      },
      {
        name: 'Progress',
        url: '/page/base/progress',
        icon: 'icon-puzzle'
      },
      {
        name: 'Switches',
        url: '/page/base/switches',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tables',
        url: '/page/base/tables',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tabs',
        url: '/page/base/tabs',
        icon: 'icon-puzzle'
      },
      {
        name: 'Tooltips',
        url: '/page/base/tooltips',
        icon: 'icon-puzzle'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/page/buttons',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Buttons',
        url: '/page/buttons/buttons',
        icon: 'icon-cursor'
      },
      {
        name: 'Dropdowns',
        url: '/page/buttons/dropdowns',
        icon: 'icon-cursor'
      },
      {
        name: 'Brand Buttons',
        url: '/page/buttons/brand-buttons',
        icon: 'icon-cursor'
      }
    ]
  },
  {
    name: 'Charts',
    url: '/page/charts',
    icon: 'icon-pie-chart'
  },
  {
    name: 'Icons',
    url: '/page/icons',
    icon: 'icon-star',
    children: [
      {
        name: 'CoreUI Icons',
        url: '/page/icons/coreui-icons',
        icon: 'icon-star',
        badge: {
          variant: 'success',
          text: 'NEW'
        }
      },
      {
        name: 'Flags',
        url: '/page/icons/flags',
        icon: 'icon-star'
      },
      {
        name: 'Font Awesome',
        url: '/page/icons/font-awesome',
        icon: 'icon-star',
        badge: {
          variant: 'secondary',
          text: '4.7'
        }
      },
      {
        name: 'Simple Line Icons',
        url: '/page/icons/simple-line-icons',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/page/notifications',
    icon: 'icon-bell',
    children: [
      {
        name: 'Alerts',
        url: '/page/notifications/alerts',
        icon: 'icon-bell'
      },
      {
        name: 'Badges',
        url: '/page/notifications/badges',
        icon: 'icon-bell'
      },
      {
        name: 'Modals',
        url: '/page/notifications/modals',
        icon: 'icon-bell'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/page/widgets',
    icon: 'icon-calculator',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    divider: true
  },
  {
    title: true,
    name: 'Extras',
  },
  {
    name: 'Pages',
    url: '/page/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/page/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/page/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/page/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/page/500',
        icon: 'icon-star'
      }
    ]
  },
  {
    name: 'Disabled',
    url: '/page/dashboard',
    icon: 'icon-ban',
    badge: {
      variant: 'secondary',
      text: 'NEW'
    },
    attributes: { disabled: true },
  },
  {
    name: 'Download CoreUI',
    url: 'http://coreui.io/angular/',
    icon: 'icon-cloud-download',
    class: 'mt-auto',
    variant: 'success',
    attributes: { target: '_blank', rel: 'noopener' }
  },
  {
    name: 'Try CoreUI PRO',
    url: 'http://coreui.io/pro/angular/',
    icon: 'icon-layers',
    variant: 'danger',
    attributes: { target: '_blank', rel: 'noopener' }
  }
];

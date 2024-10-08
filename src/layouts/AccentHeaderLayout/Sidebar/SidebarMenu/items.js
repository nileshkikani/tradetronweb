import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';

const menuItems = [
  {
    heading: 'gggfdg',
    items: [
      {
        name: 'Opstra',
        icon: BackupTableTwoToneIcon,
        // items: [
        //   {
        //     name: 'Extended Sidebar',
        //     link: '/dashboards/reports',
        //     badge: 'v3.0',
        //     badgeTooltip: 'Added in version 3.0'
        //   }
        // ]
      },
      {
        name: 'Strategy',
        icon: SmartToyTwoToneIcon,
        link: '/blueprints/accent-header/dashboards',
        items: [
          {
            name: 'Option Wizard',
            link: '/blueprints/accent-header/dashboards/reports',
            badge: '',
            badgeTooltip: 'Dot indicator with example tooltip'
          },
          {
            name: 'Deployed',
            link: '/blueprints/accent-header/dashboards/expenses',
            badge: ''
          },
          // {
          //   name: 'Healthcare',
          //   link: '/blueprints/accent-header/dashboards/healthcare',
          //   items: [
          //     {
          //       name: 'Doctors',
          //       link: '/blueprints/accent-header/dashboards/healthcare/doctor'
          //     },
          //     {
          //       name: 'Hospital',
          //       link: '/blueprints/accent-header/dashboards/healthcare/hospital'
          //     }
          //   ]
          // },
          // {
          //   name: 'Helpdesk',
          //   link: '/blueprints/accent-header/dashboards/helpdesk'
          // },
        ]
      }
    ]
  },
  // {
  //   heading: 'Extra Pages',
  //   items: [
  //     {
  //       name: 'Auth Pages',
  //       icon: VpnKeyTwoToneIcon,
  //       items: [
  //         {
  //           name: 'Login',
  //           items: [
  //             {
  //               name: 'Basic',
  //               link: '/auth/login/basic?demo=true'
  //             },
  //             {
  //               name: 'Cover',
  //               link: '/auth/login/cover?demo=true'
  //             }
  //           ]
  //         },
  //         {
  //           name: 'Register',
  //           items: [
  //             {
  //               name: 'Basic',
  //               link: '/auth/register/basic?demo=true'
  //             },
  //             {
  //               name: 'Cover',
  //               link: '/auth/register/cover?demo=true'
  //             },
  //             {
  //               name: 'Wizard',
  //               link: '/auth/register/wizard?demo=true'
  //             }
  //           ]
  //         },
  //         {
  //           name: 'Recover Password',
  //           link: '/auth/recover-password?demo=true'
  //         }
  //       ]
  //     },
  //     {
  //       name: 'Status',
  //       icon: ErrorTwoToneIcon,
  //       items: [
  //         {
  //           name: 'Error 404',
  //           link: '/status/404'
  //         },
  //         {
  //           name: 'Error 500',
  //           link: '/status/500'
  //         },
  //         {
  //           name: 'Maintenance',
  //           link: '/status/maintenance'
  //         },
  //         {
  //           name: 'Coming Soon',
  //           link: '/status/coming-soon'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   heading: 'Foundation',
  //   items: [
  //     {
  //       name: 'Overview',
  //       link: '/',
  //       icon: DesignServicesTwoToneIcon
  //     },
  //     {
  //       name: 'Documentation',
  //       icon: SupportTwoToneIcon,
  //       link: '/docs'
  //     }
  //   ]
  // }
];
export default menuItems;

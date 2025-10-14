// import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
// import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
// import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
// import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
// import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
// import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ConstructionIcon from '@mui/icons-material/Construction';
import AddchartIcon from '@mui/icons-material/Addchart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';

const menuItems = [
  {
    // heading: 'General',
    items: [
      {
        name: 'Profile',
        icon: AccountCircleIcon,
        link: '/dashboards/profile'
      },
      // {
      //   name: 'Builder',
      //   icon: ConstructionIcon,
      //   link: '/dashboards/strategy-builder'
      // },
      {
        name:'EMA Scalping',
        icon: ConstructionIcon,
        items: [
          {
            name: 'Orders',
            link: '/dashboards/ema-scalping',
            badge: '',
            // badgeTooltip: 'Dot indicator with example tooltip'
          },
          {
            name: 'My Strategies',
            link: '/dashboards/my-strategies',
            badge: ''
          },

          {
            name:'Reports',
            link:'/dashboards/reports',
            badge:''
          }

        ]
      },
      // {
      //   name: 'EMA Scalping',
      //   icon: ConstructionIcon,
      //   link: '/dashboards/ema-scalping'
      // },
      {
        name: 'Cryptos',
        icon: CurrencyBitcoinIcon,
        link: '/dashboards/cryptos'
      },
      {
        name: 'Strategy',
        icon: AddchartIcon,
        // link: '/dashboards/banking',
        items: [
          {
            name: 'Option Wizard',
            link: '/dashboards/option-wizard',
            badge: '',
            // badgeTooltip: 'Dot indicator with example tooltip'
          },
          {
            name: 'Deployed',
            link: '/dashboards/deployed',
            badge: ''
          }
        ]
      },
      // {
      //   name: "Index/Stoke Report",
      //   icon: SmartToyTwoToneIcon,
      //   link: "/dashboards/stoke-report",
      // },
      // {
      //   name: 'Positions',
      //   icon: SupportTwoToneIcon,
      //   link: '/dashboards/positions',
      // },
      {
        name: 'Brokers',
        icon: ReceiptTwoToneIcon,
        // link: '/dashboards/brokers',
        items: [
          {
            name: 'Add New Broker',
            link: '/dashboards/add-new-broker',
            badge: '',
            // badgeTooltip: 'Dot indicator with example tooltip'
          },
          {
            name: 'Existing Brokers',
            link: '/dashboards/existing-brokers',
            badge: ''
          }
        ]
      }
      
]
  }];

export default menuItems;

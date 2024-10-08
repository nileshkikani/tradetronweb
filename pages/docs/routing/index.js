import { Container, Typography, Grid } from '@mui/material';

import DocsLayout from 'src/layouts/DocsLayout';
import Head from 'next/head';
import PageHeader from 'src/components/PageHeaderDocs';
import { Prism } from 'react-syntax-highlighter';
import a11yDark from 'react-syntax-highlighter/dist/cjs/styles/prism/a11y-dark';

function Routing() {
  const routingExample = `├── account
  │   ├── login-basic
  │   │   └── index.js
  │   ├── login-cover
  │   │   └── index.js
  │   ├── recover-password
  │   │   └── index.js
  │   ├── register-basic
  │   │   └── index.js
  │   ├── register-cover
  │   │   └── index.js
  │   └── register-wizard
  │       └── index.js
  ├── applications
  │   ├── file-manager
  │   │   └── index.js
  │   ├── jobs-platform
  │   │   └── index.js
  │   ├── messenger
  │   │   └── index.js
  │   └── projects-board
  │       └── index.js
  ├── dashboards
  │   ├── analytics
  │   │   └── index.js
  │   ├── automation
  │   │   └── index.js
  │   ├── banking
  │   │   └── index.js
  │   ├── commerce
  │   │   └── index.js
  │   ├── crypto
  │   │   └── index.js
  │   ├── finance
  │   │   └── index.js
  │   ├── fitness
  │   │   └── index.js
  │   ├── healthcare
  │   │   ├── doctor
  │   │   │   └── index.js
  │   │   └── hospital
  │   │       └── index.js
  │   ├── helpdesk
  │   │   └── index.js
  │   ├── learning
  │   │   └── index.js
  │   ├── monitoring
  │   │   └── index.js
  │   └── tasks
  │       └── index.js
  ├── management
  │   ├── commerce
  │   │   ├── products
  │   │   │   ├── create
  │   │   │   │   └── index.js
  │   │   │   ├── [productId].js
  │   │   │   └── index.js
  │   │   └── shop
  │   │       └── index.js
  │   ├── invoices
  │   │   ├── [invoiceId].js
  │   │   └── index.js
  │   ├── projects
  │   │   └── index.js
  │   └── users
  │       ├── [userId].js
  │       └── index.js
  ├── status
  │   ├── 404
  │   │   └── index.js
  │   ├── 500
  │   │   └── index.js
  │   ├── coming-soon
  │   │   └── index.js
  │   └── maintenance
  │       └── index.js
  ├── _app.js
  ├── _document.js
  ├── 404.js
  └── index.js`;
  const sidebarExample = `

  import AnalyticsTwoToneIcon from '@mui/icons-material/AnalyticsTwoTone';
  import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
  import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
  import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
  import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
  import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
  
  const menuItems = [
    {
      heading: 'General',
      items: [
        {
          name: 'Opstra',
          icon: BackupTableTwoToneIcon,
          items: [
            {
              name: 'Extended Sidebar',
              link: '/dashboards/reports',
              badge: 'v3.1',
              badgeTooltip: 'Added in version 3.1'
            },
            {
              name: 'Accent Header',
              link: '/blueprints/accent-header/dashboards/reports',
              badge: '',
              badgeTooltip: 'Updated'
            },
            {
              name: 'Accent Sidebar',
              link: '/blueprints/accent-sidebar/dashboards/reports'
            }
          ]
        },
        {
          name: 'Dashboards',
          icon: SmartToyTwoToneIcon,
          link: '/dashboards',
          items: [
            {
              name: 'Reports',
              link: '/dashboards/reports',
              badge: '',
              badgeTooltip: 'Dot indicator with example tooltip'
            },
            {
              name: 'Automation',
              link: '/dashboards/automation'
            },
            {
              name: 'Healthcare',
              link: '/dashboards/healthcare',
              items: [
                {
                  name: 'Doctors',
                  link: '/dashboards/healthcare/doctor'
                },
                {
                  name: 'Hospital',
                  link: '/dashboards/healthcare/hospital'
                }
              ]
            },
            {
              name: 'Helpdesk',
              link: '/dashboards/helpdesk'
            }
          ]
        },
        {
          name: 'Data Display',
          icon: HealthAndSafetyTwoToneIcon,
          badge: '',
          link: '/blocks',
          badgeTooltip: 'Tokyo contains over 250 data display blocks',
          items: [
            {
              name: 'Charts large',
              link: '/blocks/charts-large'
            }
          ]
        },
        {
          name: 'Applications',
          link: '/applications',
          icon: AnalyticsTwoToneIcon,
          items: [
            {
              name: 'Calendar',
              link: '/applications/calendar'
            }
          ]
        }
      ]
    },
    {
      heading: 'Management',
      items: [
        {
          name: 'Projects',
          link: '/management/projects',
          icon: AccountTreeTwoToneIcon
        },
        {
          name: 'Invoices',
          link: '/management/invoices',
          icon: ReceiptTwoToneIcon,
          items: [
            {
              name: 'List',
              link: '/management/invoices'
            },
            {
              name: 'Details',
              link: '/management/invoices/single/1'
            }
          ]
        }
      ]
    },
    {
      heading: 'Extra Pages',
      items: [
        {
          name: 'Auth Pages',
          icon: VpnKeyTwoToneIcon,
          items: [
            {
              name: 'Login',
              items: [
                {
                  name: 'Basic',
                  link: '/auth/login/basic?demo=true'
                },
                {
                  name: 'Cover',
                  link: '/auth/login/cover?demo=true'
                }
              ]
            },
            {
              name: 'Register',
              items: [
                {
                  name: 'Basic',
                  link: '/auth/register/basic?demo=true'
                },
                {
                  name: 'Cover',
                  link: '/auth/register/cover?demo=true'
                },
                {
                  name: 'Wizard',
                  link: '/auth/register/wizard?demo=true'
                }
              ]
            },
            {
              name: 'Recover Password',
              link: '/auth/recover-password?demo=true'
            }
          ]
        },
        {
          name: 'Status',
          icon: ErrorTwoToneIcon,
          items: [
            {
              name: 'Error 404',
              link: '/status/404'
            },
            {
              name: 'Error 500',
              link: '/status/500'
            },
            {
              name: 'Maintenance',
              link: '/status/maintenance'
            },
            {
              name: 'Coming Soon',
              link: '/status/coming-soon'
            }
          ]
        }
      ]
    },
    {
      heading: 'Foundation',
      items: [
        {
          name: 'Overview',
          link: '/',
          icon: DesignServicesTwoToneIcon
        },
        {
          name: 'Documentation',
          icon: SupportTwoToneIcon,
          link: '/docs'
        }
      ]
    }
  ];
  
  export default menuItems;
  `;

  return (
    <>
      <Head>
        <title>Routing - Tokyo Black NextJS Javascript Admin Dashboard</title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader heading="Routing" subheading="" />
          </Grid>
          <Grid item xs={12}>
            <Typography paragraph>
              In Next.js, a page is a React Component exported from a .js, .jsx,
              .js, or .js file in the pages directory. Each page is associated
              with a route based on its file name.
            </Typography>
            <Typography paragraph>
              Example: If you create <code>pages/about.js</code> or{' '}
              <code>pages/About/index.js</code> that exports a React component
              like below, it will be accessible at <code>/about</code>.
            </Typography>
            <Typography paragraph>
              Any route like /post/1, /post/abc, etc. will be matched by{' '}
              <code>pages/post/[pid].js</code>. The matched path parameter will
              be sent as a query parameter to the page, and it will be merged
              with the other query parameters.
            </Typography>
            <Typography paragraph>
              The example below is a sample from the <code>/pages</code> folder.
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {routingExample}
            </Prism>
            <br />
            <Typography variant="h2" sx={{ mb: 2 }}>
              Sidebar Navigation
            </Typography>
            <Typography paragraph>
              To modify the current sidebar navigation, edit the following file{' '}
              <code>
                src\layouts\ExtendedSidebarLayout\Sidebar\SidebarMenu\items.js
              </code>
              . It contains an items array used for building the sidebar menu
              tree. The 'link' parameter represents the page URL defined based
              on the <code>/pages</code> folder structure.
            </Typography>
            <Prism
              showLineNumbers
              wrapLines
              language="javascript"
              style={a11yDark}
            >
              {sidebarExample}
            </Prism>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Routing;

Routing.getLayout = function getLayout(page) {
  return <DocsLayout>{page}</DocsLayout>;
};

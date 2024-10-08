import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import DashboardOptionWizardContent from '../../../src/content/DashboardPages/option-wizard/index';


function DashboardReports() {
  return (
    <>
      <Head>
        <title>Option Wizard</title>
      </Head>
      <DashboardOptionWizardContent />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

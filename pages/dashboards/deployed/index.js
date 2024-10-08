import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
// import DashboardOptionWizardContent from '../../../src/content/DashboardPages/d';
import DashboardDeployedContent from '../../../src/content/DashboardPages/deployed/index';



function DashboardReports() {
  return (
    <>
      <Head>
        <title>Deployed</title>
      </Head>
      <DashboardDeployedContent />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

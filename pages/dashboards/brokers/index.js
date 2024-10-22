import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
// import DashboardOptionWizardContent from '../../../src/content/DashboardPages/d';
import DashboardBrokersContent from '../../../src/content/DashboardPages/brokers/index';



function DashboardReports() {
  return (
    <>
      <Head>
        <title>Select your brokerss</title>
      </Head>
      <DashboardBrokersContent />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import DashboardExistingBrokersContent from '../../../src/content/DashboardPages/existing-brokers/index';




function DashboardReports() {
  return (
    <>
      <Head>
        <title>Select your brokerss</title>
      </Head>
      <DashboardExistingBrokersContent />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

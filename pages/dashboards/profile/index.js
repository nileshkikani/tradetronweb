import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import DashboardProfileContent from '../../../src/content/DashboardPages/profile/index';



function DashboardReports() {
  return (
    <>
      <Head>
        <title>Positions</title>
      </Head>
      <DashboardProfileContent />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

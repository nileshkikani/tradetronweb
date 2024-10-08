import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import DashboardPositionsContent from '../../../src/content/DashboardPages/positions/index';


function DashboardStatistics() {
  return (
    <>
      <Head>
        <title>Positions</title>
      </Head>
      <DashboardPositionsContent />
    </>
  );
}

DashboardStatistics.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardStatistics;

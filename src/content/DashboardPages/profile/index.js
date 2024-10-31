import React from 'react'
import { Authenticated } from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';

const DashboardProfileContent = () => {
  return (
    <div>profile content here</div>
  )
}

DashboardProfileContent.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default DashboardProfileContent;
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

// import { Grid } from '@mui/material';

// import Block1 from 'src/content/Dashboards/Products/Block1';
// import Block2 from 'src/content/Dashboards/Products/Block2';
// import Block3 from 'src/content/Blocks/ChartsLarge/Block5';
// import Block4 from 'src/content/Dashboards/Products/Block4';
// import Block5 from 'src/content/Blocks/ChartsSmall/Block5';
// import Block6 from 'src/content/Dashboards/Products/Block6';

function DashboardPositionsContent() {
    return (
        <>
            <PageTitleWrapper>
                <h1>Positions</h1>
            </PageTitleWrapper>
            <Footer />
        </>
    );
}

DashboardPositionsContent.getLayout = (page) => (
    <Authenticated>
      <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
  );
  

export default DashboardPositionsContent;

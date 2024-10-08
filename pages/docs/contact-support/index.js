import { Container, Typography, Grid } from '@mui/material';

import DocsLayout from 'src/layouts/DocsLayout';
import Head from 'next/head';
import PageHeader from 'src/components/PageHeaderDocs';

function ContactSupport() {
  return (
    <>
      <Head>
        <title>
          Contact Support - Tokyo Black NextJS Javascript Admin Dashboard
        </title>
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <PageHeader heading="Contact Support" subheading="" />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ mb: 2 }} variant="h2">
              Support Tickets
            </Typography>
            <Typography paragraph>
              If you need help you can open a support ticket by sending an email
              to <code>support@bloomui.freshdesk.com</code>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ContactSupport;

ContactSupport.getLayout = function getLayout(page) {
  return <DocsLayout>{page}</DocsLayout>;
};

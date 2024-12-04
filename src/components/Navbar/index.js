import { Box, Button, Container, styled, Card } from '@mui/material'
import React from 'react'
import Logo from '../LogoSign'
import { useTranslation } from 'next-i18next'
import Link from 'src/components/Link'

const HeaderWrapper = styled(Card)(
    ({ theme }) => `
    width: 100%;
    display: flex;
    align-items: center;
    height: ${theme.spacing(10)};
    // margin-bottom: ${theme.spacing(10)};
    position: sticky;
    top: 0;
    z-index: 1000; /* Ensure it stays on top of other content */
    background: ${theme.palette.background.paper}; /* Ensure background is set */
  `
)

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
      overflow: auto;
      background: ${theme.palette.common.white};
      flex: 1;
      overflow-x: hidden;
  `
)

const Navbar1 = () => {
    const { t } = useTranslation()

    return (
        // <OverviewWrapper>
            <HeaderWrapper>
                <Container maxWidth="lg">
                    <Box display="flex" alignItems="center">
                        <Logo />
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            flex={1}
                        >
                            <Box />
                            <Box>
                                <Link
                                    href="/affiliates"
                                    style={{ cursor: 'pointer', marginRight: '16px' }}
                                >
                                    {t('Affiliates')}
                                </Link>
                                <Link
                                    href="/contact-us"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {t('Contact us')}
                                </Link>
                                <Button
                                    component={Link}
                                    href="/dashboards/reports"
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                >
                                    {t('Log In')}
                                </Button>
                                <Button
                                    component={Link}
                                    href="auth/register/cover"
                                    variant="contained"
                                    sx={{ ml: 2 }}
                                >
                                    {t('Sign Up')}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </HeaderWrapper>
        // </OverviewWrapper>
    )
}

export default Navbar1

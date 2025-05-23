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
    z-index: 1000;
    background: ${theme.palette.background.paper};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0;
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

const NavLinksWrapper = styled(Box)(
    ({ theme }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(3),
      
      [theme.breakpoints.down('md')]: {
        gap: theme.spacing(2),
      }
    })
)

const StyledLink = styled(Link)(
    ({ theme }) => `
      text-decoration: none;
      color: ${theme.palette.text.primary};
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: ${theme.palette.primary.main};
      }
      
      @media (max-width: 768px) {
        font-size: 0.9rem;
      }
  `
)

const ButtonGroup = styled(Box)(
    ({ theme }) => `
      display: flex;
      gap: ${theme.spacing(1.5)};
      
      @media (max-width: 768px) {
        gap: ${theme.spacing(1)};
      }
  `
)

const Navbar1 = () => {
    const { t } = useTranslation()

    return (
                    <HeaderWrapper>
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between"
                    width="100%"
                    py={1}
                >
                
                    <Box sx={{ flexShrink: 0 }}>
                        <Logo />
                    </Box>
                    
                
                    <NavLinksWrapper>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 3 }}>
                            <StyledLink href="/affiliates">
                                {t('Affiliates')}
                            </StyledLink>
                            <StyledLink href="/contact-us">
                                {t('Contact us')}
                            </StyledLink>
                        </Box>
                        
                        <ButtonGroup>
                            <Button
                                component={Link}
                                href="/dashboards/reports"
                                variant="outlined"
                                size="medium"
                                sx={{ 
                                    minWidth: { xs: 'auto', sm: '80px' },
                                    px: { xs: 2, sm: 3 }
                                }}
                            >
                                {t('Log In')}
                            </Button>
                            <Button
                                component={Link}
                                href="auth/register/cover"
                                variant="contained"
                                size="medium"
                                sx={{ 
                                    minWidth: { xs: 'auto', sm: '80px' },
                                    px: { xs: 2, sm: 3 }
                                }}
                            >
                                {t('Sign Up')}
                            </Button>
                        </ButtonGroup>
                    </NavLinksWrapper>
                </Box>
            </Container>
        </HeaderWrapper>
    )
}

export default Navbar1

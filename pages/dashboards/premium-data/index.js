import { useState, useEffect } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container, Grid, Card, CardHeader, CardContent, Divider,
  Table, TableBody, TableCell, TableHead, TableRow,
  Box, Typography, CircularProgress, TextField, InputAdornment, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import useToast from 'src/hooks/useToast';

const SearchBar = ({ onSearch, disabled }) => {
  const [localStr, setLocalStr] = useState('');
  return (
    <Box display="flex" gap={2} alignItems="center">
      <TextField
        size="small"
        placeholder="e.g. RELIANCE, TCS"
        value={localStr}
        onChange={(e) => setLocalStr(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch(localStr);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        sx={{ minWidth: 250, bgcolor: 'background.paper', borderRadius: 1 }}
      />
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={() => onSearch(localStr)}
        disabled={disabled}
      >
        Fetch Data
      </Button>
    </Box>
  );
};

function PremiumData() {
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = process.env.EMA_SCALPING_URL;

  const fetchPremiumData = async (symbols = '') => {
    setLoading(true);
    try {
      const url = symbols 
        ? `${baseURL}premium/data/?symbols=${symbols}` 
        : `${baseURL}premium/data/`;
      const response = await axios.get(url);
      
      let items = [];
      if (response.data && response.data.data) {
        items = response.data.data;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      } else {
        items = response.data?.symbols || [];
      }
      
      // Sort items based on requested criteria
      // 1. Both CALL & PUT (score 3)
      // 2. Only CALL (score 2)
      // 3. Only PUT (score 1)
      // 4. Empty (score 0)
      const getScore = (opts) => {
        if (!opts || opts.length === 0) return 0;
        const hasCall = opts.some(o => o.option_type === 'CALL');
        const hasPut = opts.some(o => o.option_type === 'PUT');
        if (hasCall && hasPut) return 3;
        if (hasCall) return 2;
        if (hasPut) return 1;
        return 0;
      };

      const sorted = [...items].sort((a, b) => {
          return getScore(b.options) - getScore(a.options);
      });
      
      setData(sorted);
    } catch (error) {
      console.error('Error fetching premium data:', error);
      showToast('Failed to fetch premium data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const handleFilter = (searchStr) => {
    const cleanSyms = searchStr.replace(/\s+/g, '');
    fetchPremiumData(cleanSyms);
  };

  const PremiumPill = ({ val }) => {
    // Map value to simplistic colors mimicking the user's reference image
    const bgColor = val >= 5 ? 'success.light' : val >= 2 ? 'warning.light' : 'error.light';
    const textColor = val >= 5 ? 'success.dark' : val >= 2 ? 'warning.dark' : 'error.dark';
    
    return (
      <Box sx={{
        display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 10,
        bgcolor: bgColor,
        color: textColor,
        fontWeight: 'bold', fontSize: '0.75rem'
      }}>
        {val}
      </Box>
    );
  };

  const OptionTable = ({ title, options, typeColor }) => (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ bgcolor: `${typeColor}.lighter`, p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" color={`${typeColor}.main`} sx={{ letterSpacing: 1 }}>{title}</Typography>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '0.75rem', p: 1 }}>STRIKE</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', p: 1 }}>LTP</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', p: 1 }} align="right">PREMIUM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map(opt => (
            <TableRow hover key={opt.strike}>
              <TableCell sx={{ p: 1 }}>{opt.strike}</TableCell>
              <TableCell sx={{ p: 1, color: typeColor === 'success' ? 'primary.main' : 'error.main' }}>
                {opt.ltp}
              </TableCell>
              <TableCell sx={{ p: 1 }} align="right">
                 <PremiumPill val={opt.premium} />
              </TableCell>
            </TableRow>
          ))}
          {options.length === 0 && (
             <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="caption" color="text.secondary">No Active Strikes</Typography>
                </TableCell>
             </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <>
      <Head>
        <title>Premium Data - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 0 }}>
            Premium Data View
          </Typography>
          <SearchBar onSearch={handleFilter} disabled={loading} />
        </Box>
      </PageTitleWrapper>

      <Container maxWidth="xl" sx={{ pb: 5 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary">No Data Available</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {data.map((symbol) => {
              const calls = (symbol.options || []).filter(o => o.option_type === 'CALL').sort((a, b) => b.strike - a.strike); // or a.strike - b.strike
              const puts = (symbol.options || []).filter(o => o.option_type === 'PUT').sort((a, b) => b.strike - a.strike);

              return (
                <Grid item xs={12} md={6} lg={4} xl={4} key={symbol.name}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardHeader
                      title={
                        <Box>
                          <Typography variant="h4">{symbol.name}</Typography>
                          {/* <Typography variant="caption" color="text.secondary">NSE · {symbol.name.toUpperCase()}</Typography> */}
                        </Box>
                      }
                      action={
                        <Typography variant="h4" sx={{ mt: 1 }}>
                          &#8377;{symbol.price}
                        </Typography>
                      }
                      sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}
                    />
                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                      <Grid container sx={{ height: '100%' }}>
                        <Grid item xs={6} sx={{ borderRight: '1px solid', borderColor: 'divider' }}>
                          <OptionTable title="CALLS" options={calls} typeColor="success" />
                        </Grid>
                        <Grid item xs={6}>
                          <OptionTable title="PUTS" options={puts} typeColor="error" />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </>
  );
}

PremiumData.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default PremiumData;

import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import dynamic from 'next/dynamic';
import {
  Container,
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Divider
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import useToast from 'src/hooks/useToast';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function OIChangesAndRatios() {
  const { showToast } = useToast();
  const theme = useTheme();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [oiData, setOiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(true);

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchOiData(selectedDate);
    }
  }, [selectedDate]);

  const fetchDates = async () => {
    try {
      setDatesLoading(true);
      const response = await axiosInstance.get('/oi-data/dates/');
      if (response.data && response.data.dates) {
        setDates(response.data.dates);
        if (response.data.dates.length > 0) {
          setSelectedDate(response.data.dates[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching dates:', error);
      showToast('Failed to fetch available dates', 'error');
    } finally {
      setDatesLoading(false);
    }
  };

  const fetchOiData = async (date) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/oi-data/?date=${date}`);
      if (response.data && response.data.data) {
        setOiData(response.data.data);
      } else {
        setOiData([]);
      }
    } catch (error) {
      console.error('Error fetching OI data:', error);
      showToast('Failed to fetch OI data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const enrichedData = useMemo(() => {
    if (!oiData || oiData.length === 0) return [];

    return oiData.map((row, idx) => {
      const nifty = toNum(row.nifty);
      const totalCeOi = toNum(row.total_ce_oi);
      const totalPeOi = toNum(row.total_pe_oi);
      const pcr = totalCeOi ? totalPeOi / totalCeOi : 1.0;

      return {
        ...row,
        pcr,
        ce_oi_change: toNum(row.change_in_total_ce_oi),
        pe_oi_change: toNum(row.change_in_total_pe_oi),
        nifty
      };
    });
  }, [oiData]);

  const { niftyMin, niftyMax } = useMemo(() => {
    if (enrichedData.length === 0) return { niftyMin: 0, niftyMax: 0 };
    const values = enrichedData.map(d => d.nifty);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 100;
    return {
      niftyMin: Math.floor(min - padding),
      niftyMax: Math.ceil(max + padding)
    };
  }, [enrichedData]);


  const commonOptions = {
    chart: {
      toolbar: { show: false },
      animations: { enabled: false },
      foreColor: theme.palette.text.secondary,
      zoom: { enabled: false },
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false, format: 'HH:mm' },
      axisBorder: { color: theme.palette.divider },
      axisTicks: { color: theme.palette.divider }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
    },
    tooltip: {
      theme: theme.palette.mode,
      x: { format: 'HH:mm' },
      shared: true,
      intersect: false,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    annotations: {
      yaxis: []
    }
  };

  const oiChangeSeries = [
    {
      name: 'CE OI Δ',
      type: 'bar',
      data: enrichedData.map(d => ({
        x: new Date(d.date_time).getTime(),
        y: d.ce_oi_change
      }))
    },
    {
      name: 'PE OI Δ',
      type: 'bar',
      data: enrichedData.map(d => ({
        x: new Date(d.date_time).getTime(),
        y: d.pe_oi_change
      }))
    },
    {
      name: 'NIFTY',
      type: 'line',
      data: enrichedData.map(d => ({
        x: new Date(d.date_time).getTime(),
        y: d.nifty
      }))
    }
  ];

  const oiChangeOptions = {
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      id: 'oi-change-chart'
    },
    colors: ['#f87171', '#34d399', '#f59e0b'], // Red for CE, Green for PE, Orange for NIFTY
    stroke: {
      width: [0, 0, 3],
      curve: 'smooth'
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
      }
    },
    yaxis: [
      {
        seriesName: 'CE OI Δ',
        title: { text: 'OI Change' },
        labels: {
          formatter: (val) => (val !== undefined && val !== null) ? (val / 1000000).toFixed(1) + 'M' : ''
        }
      },
      {
        seriesName: 'PE OI Δ',
        show: false
      },
      {
        seriesName: 'NIFTY',
        opposite: true,
        title: { text: 'NIFTY' },
        labels: {
          formatter: (val) => (val !== undefined && val !== null) ? val.toFixed(0) : ''
        },
        min: niftyMin,
        max: niftyMax,
        tickAmount: 5
      }
    ],
  };

  const pcrSeries = [
    {
      name: 'PCR',
      type: 'line',
      data: enrichedData.map(d => ({
        x: new Date(d.date_time).getTime(),
        y: d.pcr
      }))
    },
    {
      name: 'NIFTY',
      type: 'line',
      data: enrichedData.map(d => ({
        x: new Date(d.date_time).getTime(),
        y: d.nifty
      }))
    }
  ];

  const pcrOptions = {
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      id: 'pcr-chart'
    },
    colors: ['#3b82f6', '#f59e0b'], // Blue for PCR, Orange for NIFTY
    stroke: {
      width: [3, 3],
      curve: 'smooth'
    },
    yaxis: [
      {
        seriesName: 'PCR',
        title: { text: 'PCR' },
        labels: {
          formatter: (val) => (val !== undefined && val !== null) ? val.toFixed(2) : ''
        },
        min: 0.5,
        max: 2.5
      },
      {
        seriesName: 'NIFTY',
        opposite: true,
        title: { text: 'NIFTY' },
        labels: {
          formatter: (val) => (val !== undefined && val !== null) ? val.toFixed(0) : ''
        },
        min: niftyMin,
        max: niftyMax,
        tickAmount: 5
      }
    ],
    annotations: {
      yaxis: [
        {
          y: 1.0,
          borderColor: theme.palette.text.secondary,
          label: {
            text: 'PCR 1.0',
            style: {
              color: '#fff',
              background: theme.palette.text.secondary
            }
          },
          strokeDashArray: 5
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>OI Changes and Ratios - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 0 }}>
            OI Changes and Ratios
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            {datesLoading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'background.paper' }}>
                <InputLabel id="date-select-label">Select Date</InputLabel>
                <Select
                  labelId="date-select-label"
                  value={selectedDate}
                  label="Select Date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {dates.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>
      </PageTitleWrapper>

      <Container maxWidth="xl" sx={{ pb: 5 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : enrichedData.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 10, textAlign: 'center' }}>
              <Typography variant="h4" color="text.secondary">
                No OI Data Available for this date
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box display="flex" flexDirection="column" gap={4}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  OI Change & NIFTY
                </Typography>
                <Box height={400}>
                  <Chart
                    options={oiChangeOptions}
                    series={oiChangeSeries}
                    type="line"
                    height={400}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Put-Call Ratio & NIFTY
                </Typography>
                <Box height={400}>
                  <Chart
                    options={pcrOptions}
                    series={pcrSeries}
                    type="line"
                    height={400}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>
    </>
  );
}

OIChangesAndRatios.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default OIChangesAndRatios;

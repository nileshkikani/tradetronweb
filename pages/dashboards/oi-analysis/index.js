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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  useTheme
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import useToast from 'src/hooks/useToast';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ACTION_COLORS = {
  'Call Buying': '#28a745',
  'Put Writing': '#28a745',
  'Short Covering': '#6db56d',
  'Call Writing': '#dc3545',
  'Put Buying': '#dc3545',
  'Long Unwinding': '#ffc107',
  'Neutral': 'transparent'
};

const BIAS_COLORS = {
  'Bullish': '#1e4620',
  'Bearish': '#4a151b',
  'Neutral': 'transparent'
};

function getSignalColor(value) {
  if (value === null || value === undefined) return 'transparent';
  let r, g;
  if (value < 50) {
    r = 255;
    g = Math.round(5.1 * value);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * value);
  }
  return `rgb(${r},${g},0)`;
}

function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function OIAnalysis() {
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

  const W = {
    oi_magnitude: 0.25,
    pcr_alignment: 0.20,
    multi_level_confirmation: 0.20,
    smart_money: 0.15,
    trap_absence: 0.10,
    price_confirmation: 0.10,
  };

  const LEVELS = ['atm', 'otm_1', 'otm_2', 'otm_3', 'otm_4', 'otm_5',
                  'itm_1', 'itm_2', 'itm_3', 'itm_4', 'itm_5'];
  const TRAP_PRICE_THRESHOLD = 0;
  const SMART_MONEY_OI_PERCENTILE = 80;

  const dateGroups = {};
  oiData.forEach((row, idx) => {
    const d = row.date_time.slice(0, 10);
    if (!dateGroups[d]) dateGroups[d] = [];
    dateGroups[d].push(idx);
  });

  const oi_changes = {};
  const px_changes = {};

  LEVELS.forEach(lv => {
    ['ce', 'pe'].forEach(side => {
      const oiKey = `${lv}_${side}_oi`;
      const pxKey = `${lv}_${side}_close`;
      const oiChgKey = `${lv}_${side}_oi_change`;
      const pxChgKey = `${lv}_${side}_close_change`;

      oi_changes[oiChgKey] = new Array(oiData.length).fill(0);
      px_changes[pxChgKey] = new Array(oiData.length).fill(0);

      Object.values(dateGroups).forEach(idxList => {
        idxList.forEach((idx, pos) => {
          if (pos === 0) return; // first row of day → diff = 0
          const prev = oiData[idxList[pos - 1]];
          const curr = oiData[idx];
          oi_changes[oiChgKey][idx] = toNum(curr[oiKey]) - toNum(prev[oiKey]);
          px_changes[pxChgKey][idx] = toNum(curr[pxKey]) - toNum(prev[pxKey]);
        });
      });
    });
  });

  const allAbsOiChanges = [];
  LEVELS.forEach(lv => {
    ['ce', 'pe'].forEach(side => {
      const key = `${lv}_${side}_oi_change`;
      oi_changes[key].forEach(v => allAbsOiChanges.push(Math.abs(v)));
    });
  });
  allAbsOiChanges.sort((a, b) => a - b);
  const pctIdx = Math.floor((SMART_MONEY_OI_PERCENTILE / 100) * allAbsOiChanges.length);
  const SM_THRESHOLD = allAbsOiChanges[pctIdx] ?? 0;

  const oi_accel = {};
  LEVELS.forEach(lv => {
    ['ce', 'pe'].forEach(side => {
      const key = `${lv}_${side}_oi_change`;
      oi_accel[key] = new Array(oiData.length).fill(0);
      Object.values(dateGroups).forEach(idxList => {
        idxList.forEach((idx, pos) => {
          if (pos === 0) return;
          const prevIdx = idxList[pos - 1];
          oi_accel[key][idx] = Math.abs(
            oi_changes[key][idx] - oi_changes[key][prevIdx]
          );
        });
      });
    });
  });

  const CE_BULLISH = new Set(['Call Buying', 'Short Covering']);
  const CE_BEARISH = new Set(['Call Writing', 'Long Unwinding']);
  const PE_BULLISH = new Set(['Put Writing', 'Long Unwinding']);
  const PE_BEARISH = new Set(['Put Buying', 'Short Covering']);

  const atmOiMags = oiData.map((_, idx) =>
    Math.abs(oi_changes['atm_ce_oi_change'][idx]) +
    Math.abs(oi_changes['atm_pe_oi_change'][idx])
  );

  const atmOiRankArr = new Array(oiData.length).fill(0.5);
  Object.values(dateGroups).forEach(idxList => {
    const mags = idxList.map(i => atmOiMags[i]);
    // Match pandas rank(pct=True): ties receive average rank.
    idxList.forEach((idx, pos) => {
      const v = mags[pos];
      let less = 0;
      let equal = 0;
      for (let i = 0; i < mags.length; i++) {
        if (mags[i] < v) less++;
        else if (mags[i] === v) equal++;
      }
      const avgRank = less + (equal + 1) / 2;
      atmOiRankArr[idx] = avgRank / mags.length;
    });
  });

  return oiData.map((row, idx) => {
    const date = row.date_time.slice(0, 10);
    const dateIdxList = dateGroups[date];
    const posInDay = dateIdxList.indexOf(idx);
    const prevIdx = posInDay > 0 ? dateIdxList[posInDay - 1] : null;
    const prevRow = prevIdx !== null ? oiData[prevIdx] : null;

    const nifty_change = prevRow ? toNum(row.nifty) - toNum(prevRow.nifty) : 0;
    const totalCeOi = toNum(row.total_ce_oi);
    const totalPeOi = toNum(row.total_pe_oi);
    const pcr = totalCeOi
      ? (totalPeOi / totalCeOi)
      : 1.0;

    // ── Classify actions for all levels ──
    const actions = {};
    LEVELS.forEach(lv => {
      const oiChg = oi_changes[`${lv}_ce_oi_change`][idx];
      const pxChg = px_changes[`${lv}_ce_close_change`][idx];
      let ce_act = 'Long Unwinding';
      if      (oiChg > 0 && pxChg > 0)  ce_act = 'Call Buying';
      else if (oiChg > 0 && pxChg <= 0) ce_act = 'Call Writing';
      else if (oiChg <= 0 && pxChg > 0) ce_act = 'Short Covering';
      actions[`${lv}_ce_action`] = ce_act;

      const peOiChg = oi_changes[`${lv}_pe_oi_change`][idx];
      const pePxChg = px_changes[`${lv}_pe_close_change`][idx];
      let pe_act = 'Short Covering';
      if      (peOiChg > 0 && pePxChg > 0)  pe_act = 'Put Buying';
      else if (peOiChg > 0 && pePxChg <= 0) pe_act = 'Put Writing';
      else if (peOiChg <= 0 && pePxChg > 0) pe_act = 'Long Unwinding';
      actions[`${lv}_pe_action`] = pe_act;
    });

    const atm_ce_action = actions['atm_ce_action'];
    const atm_pe_action = actions['atm_pe_action'];

    let bull = 0, bear = 0;
    const ce_chg = toNum(row.change_in_total_ce_oi);
    const pe_chg = toNum(row.change_in_total_pe_oi);

    if (pcr > 1.2) bull++;
    if (pcr < 0.8) bear++;
    if (pe_chg > ce_chg && pe_chg > 0) bull++;
    if (ce_chg > pe_chg && ce_chg > 0) bear++;
    if (CE_BULLISH.has(atm_ce_action)) bull++;
    if (atm_ce_action === 'Call Writing') bear++;
    if (atm_pe_action === 'Put Writing') bull++;
    if (PE_BEARISH.has(atm_pe_action) && atm_pe_action === 'Put Buying') bear++;

    const market_bias = bull > bear ? 'Bullish' : bear > bull ? 'Bearish' : 'Neutral';

    let trap_type = '';
    if (nifty_change > TRAP_PRICE_THRESHOLD && atm_ce_action === 'Call Writing')
      trap_type = 'Bull Trap';
    else if (nifty_change < -TRAP_PRICE_THRESHOLD && atm_pe_action === 'Put Writing')
      trap_type = 'Bear Trap';

    let sm_bull_count = 0, sm_bear_count = 0;
    let smart_money_signal = false;

    LEVELS.forEach(lv => {
      ['ce', 'pe'].forEach(side => {
        const key = `${lv}_${side}_oi_change`;
        const absChg = Math.abs(oi_changes[key][idx]);
        const accel = oi_accel[key][idx];
        const isSmLevel = absChg >= SM_THRESHOLD && accel > 0;
        if (!isSmLevel) return;

        smart_money_signal = true;
        const act = actions[`${lv}_${side}_action`];
        if (side === 'ce') {
          if (CE_BULLISH.has(act)) sm_bull_count++;
          if (CE_BEARISH.has(act)) sm_bear_count++;
        } else {
          if (PE_BULLISH.has(act)) sm_bull_count++;
          if (PE_BEARISH.has(act)) sm_bear_count++;
        }
      });
    });

    const atmOiRank = atmOiRankArr[idx];
    let score = 0;
    score += atmOiRank * W.oi_magnitude * 100;
    const pcrAligned =
      (market_bias === 'Bullish' && pcr > 1.0) ||
      (market_bias === 'Bearish' && pcr < 1.0);
    score += (pcrAligned ? 1 : 0) * W.pcr_alignment * 100;

    const nonAtmLevels = LEVELS.filter(lv => lv !== 'atm');
    let matches = 0;
    nonAtmLevels.forEach(lv => {
      if (actions[`${lv}_ce_action`] === atm_ce_action) matches++;
    });
    const confirmRatio = matches / nonAtmLevels.length;
    score += confirmRatio * W.multi_level_confirmation * 100;

    score += (smart_money_signal ? 1 : 0) * W.smart_money * 100;

    const noTrap = !trap_type || trap_type.trim() === '';
    score += (noTrap ? 1 : 0) * W.trap_absence * 100;

    const price_confirmed =
      (nifty_change > 0 && market_bias === 'Bullish') ||
      (nifty_change < 0 && market_bias === 'Bearish');
    score += (price_confirmed ? 1 : 0) * W.price_confirmation * 100;

    const signal_strength = Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;

    return {
      ...row,
      ...actions,
      nifty_change,
      pcr,
      market_bias,
      signal_strength,
      trap_type,
      smart_money_signal,
      sm_bull_count,
      sm_bear_count,
    };
  });
}, [oiData]);
  const formatTime = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const formatFloat = (val, decimals = 2) => {
    if (val === null || val === undefined || isNaN(parseFloat(val))) return '-';
    return parseFloat(val).toFixed(decimals);
  };

  const chartSeries = [{
    name: 'NIFTY',
    data: enrichedData.map(d => ({
      x: new Date(d.date_time).getTime(),
      y: d.nifty
    }))
  }];

  const annotationsPoints = enrichedData.filter(d => d.trap_type).map(d => ({
    x: new Date(d.date_time).getTime(),
    y: d.nifty,
    marker: {
      size: 5,
      fillColor: d.trap_type === 'Bull Trap' ? '#ff4444' : '#2ca02c',
      strokeColor: '#fff',
      shape: 'circle'
    },
    label: {
      borderColor: d.trap_type === 'Bull Trap' ? '#ff4444' : '#2ca02c',
      style: {
        color: '#fff',
        background: d.trap_type === 'Bull Trap' ? '#ff4444' : '#2ca02c',
        fontSize: '10px'
      },
      text: d.trap_type
    }
  }));

  const chartOptions = {
    chart: {
      type: 'line',
      height: 480,
      toolbar: { show: false },
      animations: { enabled: false },
      foreColor: theme.palette.text.secondary
    },
    stroke: { width: 2, colors: ['#008FFB'] },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: false, format: 'HH:mm' },
      axisBorder: { color: theme.palette.divider },
      axisTicks: { color: theme.palette.divider }
    },
    yaxis: {
      decimalsInFloat: 2,
    },
    grid: {
      borderColor: theme.palette.divider
    },
    tooltip: {
      theme: theme.palette.mode,
      x: { format: 'HH:mm' }
    },
    annotations: {
      points: annotationsPoints
    }
  };

  const tableData = [...enrichedData].reverse();

  return (
    <>
      <Head>
        <title>OI Analysis - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 0 }}>
            OI Analysis
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
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  NIFTY Intraday with Signal Overlay
                </Typography>
                <Box height={480}>
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="line"
                    height={480}
                  />
                </Box>
              </CardContent>
            </Card>

            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
              Intraday Market Actions
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>NIFTY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>NIFTY Change</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ATM CE Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>ATM PE Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Market Bias</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Signal Strength</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>PCR</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trap Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{formatTime(row.date_time)}</TableCell>
                      <TableCell>{formatFloat(row.nifty, 2)}</TableCell>
                      <TableCell>{formatFloat(row.nifty_change, 2)}</TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: ACTION_COLORS[row.atm_ce_action] || 'transparent',
                          color: ACTION_COLORS[row.atm_ce_action] !== 'transparent' ? '#000' : 'inherit',
                          fontWeight: ACTION_COLORS[row.atm_ce_action] !== 'transparent' ? 'bold' : 'normal'
                        }}
                      >
                        {row.atm_ce_action}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: ACTION_COLORS[row.atm_pe_action] || 'transparent',
                          color: ACTION_COLORS[row.atm_pe_action] !== 'transparent' ? '#000' : 'inherit',
                          fontWeight: ACTION_COLORS[row.atm_pe_action] !== 'transparent' ? 'bold' : 'normal'
                        }}
                      >
                        {row.atm_pe_action}
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: BIAS_COLORS[row.market_bias] || 'transparent',
                          color: 'inherit',
                          fontWeight: BIAS_COLORS[row.market_bias] !== 'transparent' ? 'bold' : 'normal'
                        }}
                      >
                        {row.market_bias}
                      </TableCell>
                      <TableCell
                         sx={{
                           bgcolor: getSignalColor(row.signal_strength),
                           color: '#000',
                           fontWeight: 'bold'
                         }}
                      >
                        {formatFloat(row.signal_strength, 1)}
                      </TableCell>
                      <TableCell>{formatFloat(row.pcr, 3)}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: row.trap_type === 'Bull Trap' ? '#ff4444' : (row.trap_type === 'Bear Trap' ? '#2ca02c' : 'inherit') }}>
                        {row.trap_type}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </>
  );
}

OIAnalysis.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default OIAnalysis;

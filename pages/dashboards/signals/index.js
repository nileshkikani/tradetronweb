import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import axiosInstance from 'src/utils/axios';
import useToast from 'src/hooks/useToast';

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
  'Bullish': '#d4edda',
  'Bearish': '#f8d7da',
  'Neutral': '#f8f9fa'
};

const SESSION_RANGES = {
  'Full Day': ['09:15', '15:30'],
  'Morning': ['09:15', '11:00'],
  'Midday': ['11:00', '13:00'],
  'Afternoon': ['13:00', '15:30'],
};

function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

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
  return `rgba(${r},${g},0, 0.4)`;
}

function SignalsDashboard() {
  const { showToast } = useToast();
  const theme = useTheme();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [oiData, setOiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(true);
  
  // No session/min-strength filters (show all timeframes)

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

    // ── Python-parity enrichment (matches `engine.py` / `config.py`) ──
    const LEVELS = ['atm', 'otm_1', 'otm_2', 'otm_3', 'otm_4', 'otm_5', 'itm_1', 'itm_2', 'itm_3', 'itm_4', 'itm_5'];
    const SMART_MONEY_OI_PERCENTILE = 90;
    const TRAP_PRICE_THRESHOLD = 0.0;
    const REVERSAL_LOOKBACK = 4;
    const CONTINUATION_MIN_COUNT = 3;
    const W = {
      oi_magnitude: 0.25,
      pcr_alignment: 0.20,
      multi_level_confirmation: 0.20,
      smart_money: 0.15,
      trap_absence: 0.10,
      price_confirmation: 0.10,
    };

    // Group by date for diff calculations
    const dateGroups = {};
    oiData.forEach((row, idx) => {
      const d = row.date_time.slice(0, 10);
      if (!dateGroups[d]) dateGroups[d] = [];
      dateGroups[d].push(idx);
    });

    // OI and price deltas by level/side (same-day diff; first row of day = 0)
    const oi_changes = {};
    const px_changes = {};
    LEVELS.forEach((lv) => {
      ['ce', 'pe'].forEach((side) => {
        const oiKey = `${lv}_${side}_oi`;
        const pxKey = `${lv}_${side}_close`;
        const oiChgKey = `${lv}_${side}_oi_change`;
        const pxChgKey = `${lv}_${side}_close_change`;

        oi_changes[oiChgKey] = new Array(oiData.length).fill(0);
        px_changes[pxChgKey] = new Array(oiData.length).fill(0);

        Object.values(dateGroups).forEach((idxList) => {
          idxList.forEach((i, pos) => {
            if (pos === 0) return;
            const prev = oiData[idxList[pos - 1]];
            const curr = oiData[i];
            oi_changes[oiChgKey][i] = toNum(curr[oiKey]) - toNum(prev[oiKey]);
            px_changes[pxChgKey][i] = toNum(curr[pxKey]) - toNum(prev[pxKey]);
          });
        });
      });
    });

    // Smart money threshold from percentile of abs OI change
    const allAbs = [];
    LEVELS.forEach((lv) => {
      ['ce', 'pe'].forEach((side) => {
        const key = `${lv}_${side}_oi_change`;
        oi_changes[key].forEach((v) => allAbs.push(Math.abs(v)));
      });
    });
    allAbs.sort((a, b) => a - b);
    const pctIdx = Math.floor((SMART_MONEY_OI_PERCENTILE / 100) * allAbs.length);
    const SM_THRESHOLD = allAbs[pctIdx] ?? 0;

    // Acceleration = abs(change_now - change_prev) within day
    const oi_accel = {};
    LEVELS.forEach((lv) => {
      ['ce', 'pe'].forEach((side) => {
        const key = `${lv}_${side}_oi_change`;
        oi_accel[key] = new Array(oiData.length).fill(0);
        Object.values(dateGroups).forEach((idxList) => {
          idxList.forEach((i, pos) => {
            if (pos === 0) return;
            const prevIdx = idxList[pos - 1];
            oi_accel[key][i] = Math.abs(oi_changes[key][i] - oi_changes[key][prevIdx]);
          });
        });
      });
    });

    // ATM OI magnitude + within-day percentile rank (pandas rank(pct=True), average ties)
    const atmOiMags = oiData.map((_, i) =>
      Math.abs(oi_changes['atm_ce_oi_change'][i]) + Math.abs(oi_changes['atm_pe_oi_change'][i])
    );
    const atmOiRankArr = new Array(oiData.length).fill(0.5);
    Object.values(dateGroups).forEach((idxList) => {
      const mags = idxList.map((i) => atmOiMags[i]);
      idxList.forEach((i, pos) => {
        const v = mags[pos];
        let less = 0;
        let equal = 0;
        for (let k = 0; k < mags.length; k++) {
          if (mags[k] < v) less++;
          else if (mags[k] === v) equal++;
        }
        const avgRank = less + (equal + 1) / 2;
        atmOiRankArr[i] = avgRank / mags.length;
      });
    });

    // Action sets (same as `oi-analysis/index.js` and Python intent)
    const CE_BULLISH = new Set(['Call Buying', 'Short Covering']);
    const CE_BEARISH = new Set(['Call Writing', 'Long Unwinding']);
    const PE_BULLISH = new Set(['Put Writing', 'Long Unwinding']);
    const PE_BEARISH = new Set(['Put Buying', 'Short Covering']);
    const writing = new Set(['Call Writing', 'Put Writing']);
    const buying = new Set(['Call Buying', 'Put Buying']);

    const enriched = oiData.map((row, idx) => {
      const date = row.date_time.slice(0, 10);
      const dateIdxList = dateGroups[date];
      const posInDay = dateIdxList.indexOf(idx);
      const prevIdx = posInDay > 0 ? dateIdxList[posInDay - 1] : null;
      const prevRow = prevIdx !== null ? oiData[prevIdx] : null;

      const nifty = toNum(row.nifty);
      const nifty_change = prevRow ? nifty - toNum(prevRow.nifty) : 0;

      const totalCeOi = toNum(row.total_ce_oi);
      const totalPeOi = toNum(row.total_pe_oi);
      const pcr = totalCeOi ? totalPeOi / totalCeOi : 1.0;

      // Actions for all levels
      const actions = {};
      LEVELS.forEach((lv) => {
        const oiChg = oi_changes[`${lv}_ce_oi_change`][idx];
        const pxChg = px_changes[`${lv}_ce_close_change`][idx];
        let ce_act = 'Long Unwinding';
        if (oiChg > 0 && pxChg > 0) ce_act = 'Call Buying';
        else if (oiChg > 0 && pxChg <= 0) ce_act = 'Call Writing';
        else if (oiChg <= 0 && pxChg > 0) ce_act = 'Short Covering';
        actions[`${lv}_ce_action`] = ce_act;

        const peOiChg = oi_changes[`${lv}_pe_oi_change`][idx];
        const pePxChg = px_changes[`${lv}_pe_close_change`][idx];
        let pe_act = 'Short Covering';
        if (peOiChg > 0 && pePxChg > 0) pe_act = 'Put Buying';
        else if (peOiChg > 0 && pePxChg <= 0) pe_act = 'Put Writing';
        else if (peOiChg <= 0 && pePxChg > 0) pe_act = 'Long Unwinding';
        actions[`${lv}_pe_action`] = pe_act;
      });

      const atm_ce_action = actions['atm_ce_action'];
      const atm_pe_action = actions['atm_pe_action'];

      // Market bias scoring (same rules as oi-analysis page)
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

      // Trap detection
      let trap_type = '';
      if (nifty_change > TRAP_PRICE_THRESHOLD && atm_ce_action === 'Call Writing') trap_type = 'Bull Trap';
      else if (nifty_change < -TRAP_PRICE_THRESHOLD && atm_pe_action === 'Put Writing') trap_type = 'Bear Trap';

      // Smart money (percentile threshold + accel > 0)
      let sm_bull_count = 0;
      let sm_bear_count = 0;
      let smart_money_signal = false;

      LEVELS.forEach((lv) => {
        ['ce', 'pe'].forEach((side) => {
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

      // Strength factors (Python weights)
      const atmOiRank = atmOiRankArr[idx];
      const pcrAligned = (market_bias === 'Bullish' && pcr > 1.0) || (market_bias === 'Bearish' && pcr < 1.0);

      const nonAtmLevels = LEVELS.filter((lv) => lv !== 'atm');
      let matches = 0;
      nonAtmLevels.forEach((lv) => {
        if (actions[`${lv}_ce_action`] === atm_ce_action) matches++;
      });
      const confirmRatio = matches / nonAtmLevels.length;

      const noTrap = !trap_type || trap_type.trim() === '';
      const price_confirmed =
        (nifty_change > 0 && market_bias === 'Bullish') || (nifty_change < 0 && market_bias === 'Bearish');

      let score = 0;
      score += atmOiRank * W.oi_magnitude * 100;
      score += (pcrAligned ? 1 : 0) * W.pcr_alignment * 100;
      score += confirmRatio * W.multi_level_confirmation * 100;
      score += (smart_money_signal ? 1 : 0) * W.smart_money * 100;
      score += (noTrap ? 1 : 0) * W.trap_absence * 100;
      score += (price_confirmed ? 1 : 0) * W.price_confirmation * 100;
      const signal_strength = Math.round(Math.min(100, Math.max(0, score)) * 10) / 10;

      return {
        ...row,
        ...actions,
        nifty,
        nifty_change,
        pcr,
        market_bias,
        trap_type,
        smart_money_signal,
        sm_bull_count,
        sm_bear_count,
        signal_strength,

        // from Python timeline expectations (computed below if not provided)
        atm_oi_flip: Boolean(row.atm_oi_flip),
        atm_flip_direction: row.atm_flip_direction || '',
        reversal_signal: Boolean(row.reversal_signal),
        reversal_direction: row.reversal_direction || '',
        continuation_signal: Boolean(row.continuation_signal),
        continuation_count: toNum(row.continuation_count, 0),
      };
    });

    // ── Derive missing timeline flags (Python parity) ──
    // Continuation
    Object.values(dateGroups).forEach((idxList) => {
      let runCount = 0;
      let lastBias = null;
      idxList.forEach((i, p) => {
        const cur = enriched[i];
        const bias = cur.market_bias;
        if (p === 0 || bias !== lastBias) runCount = 1;
        else runCount += 1;
        lastBias = bias;

        const apiProvided = Boolean(cur.continuation_signal) || toNum(cur.continuation_count, 0) > 0;
        if (apiProvided) return;

        const ce_chg_total = toNum(cur.change_in_total_ce_oi);
        const pe_chg_total = toNum(cur.change_in_total_pe_oi);
        const oi_consistent =
          (bias === 'Bullish' && pe_chg_total > 0) ||
          (bias === 'Bearish' && ce_chg_total > 0) ||
          bias === 'Neutral';

        cur.continuation_count = runCount;
        cur.continuation_signal = runCount >= CONTINUATION_MIN_COUNT && oi_consistent;
      });
    });

    // ATM OI flip + direction
    Object.values(dateGroups).forEach((idxList) => {
      idxList.forEach((i, p) => {
        if (p === 0) return;
        const cur = enriched[i];
        const prev = enriched[idxList[p - 1]];

        const apiProvided = Boolean(cur.atm_oi_flip) || Boolean(cur.atm_flip_direction);
        if (apiProvided) return;

        const cePrev = prev.atm_ce_action;
        const ceCur = cur.atm_ce_action;
        const pePrev = prev.atm_pe_action;
        const peCur = cur.atm_pe_action;

        const ceFlip =
          (writing.has(cePrev) && buying.has(ceCur)) || (buying.has(cePrev) && writing.has(ceCur));
        const peFlip =
          (writing.has(pePrev) && buying.has(peCur)) || (buying.has(pePrev) && writing.has(peCur));

        cur.atm_oi_flip = Boolean(ceFlip || peFlip);

        let dir = '';
        if (ceFlip && writing.has(cePrev) && buying.has(ceCur)) dir = 'Bullish';
        else if (ceFlip && buying.has(cePrev) && writing.has(ceCur)) dir = 'Bearish';
        else if (peFlip && writing.has(pePrev) && buying.has(peCur)) dir = 'Bearish';
        else if (peFlip && buying.has(pePrev) && writing.has(peCur)) dir = 'Bullish';
        cur.atm_flip_direction = dir;
      });
    });

    // Reversal
    Object.values(dateGroups).forEach((idxList) => {
      idxList.forEach((i, p) => {
        const cur = enriched[i];
        const apiProvided = Boolean(cur.reversal_signal) || Boolean(cur.reversal_direction);
        if (apiProvided) return;
        if (p < REVERSAL_LOOKBACK) return;

        const prior = idxList.slice(p - REVERSAL_LOOKBACK, p).map((j) => enriched[j].market_bias);
        const priorBull = prior.filter((b) => b === 'Bullish').length;
        const priorBear = prior.filter((b) => b === 'Bearish').length;

        const bearish_rev =
          priorBull >= REVERSAL_LOOKBACK - 1 &&
          cur.market_bias === 'Bearish' &&
          (cur.atm_ce_action === 'Call Writing' || cur.atm_pe_action === 'Long Unwinding');

        const bullish_rev =
          priorBear >= REVERSAL_LOOKBACK - 1 &&
          cur.market_bias === 'Bullish' &&
          (cur.atm_pe_action === 'Put Writing' ||
            cur.atm_ce_action === 'Short Covering' ||
            cur.atm_ce_action === 'Call Buying');

        cur.reversal_signal = Boolean(bearish_rev || bullish_rev);
        cur.reversal_direction = bearish_rev ? 'Bearish' : bullish_rev ? 'Bullish' : '';
      });
    });

    return enriched;
  }, [oiData]);

  const timelineRecords = useMemo(() => {
    const records = [];

    enrichedData.forEach((row) => {
      // Use the same HH:MM formatting as Python to make session filtering stable.
      const time = new Date(row.date_time).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const common = {
        Time: time,
        CE_Action: row.atm_ce_action,
        PE_Action: row.atm_pe_action,
        Bias: row.market_bias,
        NIFTY: row.nifty.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
        Strength: row.signal_strength,
        raw_row: row
      };

      // Smart Money
      if (row.smart_money_signal) {
        records.push({
          ...common,
          Type: '💰 Smart Money',
          Detail: row.market_bias,
          sort_rank: 3
        });
      }

      // Trap
      if (row.trap_type) {
        records.push({
          ...common,
          Type: row.trap_type === 'Bull Trap' ? '⚠️ Bull Trap' : '⚠️ Bear Trap',
          Detail: `NIFTY Δ ${row.nifty_change > 0 ? '+' : ''}${row.nifty_change.toFixed(1)}`,
          sort_rank: 2
        });
      }

      // Reversal (Logic: check if bias changed from previous row)
      if (row.reversal_signal) {
          records.push({
              ...common,
              Type: '🔄 Reversal',
              Detail: row.reversal_direction || row.market_bias,
              sort_rank: 4
          });
      }
      
      // OI Flip
      if (row.atm_oi_flip) {
          records.push({
              ...common,
              Type: '⚡ OI Flip',
              Detail: row.atm_flip_direction || row.market_bias,
              sort_rank: 3
          });
      }

      // Continuation
      if (row.continuation_signal) {
          records.push({
              ...common,
              Type: '➡️ Continuation',
              Detail: `${row.market_bias} × ${toNum(row.continuation_count, 0)}`,
              sort_rank: 1
          });
      }
    });

    // Sort: Time (Ascending) then Rank (Descending)
    return records.sort((a, b) => {
        if (a.Time !== b.Time) return a.Time > b.Time ? -1 : 1; // Show newest first like in image
        return b.sort_rank - a.sort_rank;
    });
  }, [enrichedData]);

  const getRowStyle = (type) => {
    //   if (type.includes('Reversal')) return { bgcolor: '#a6e1f5ff' };
    //   if (type.includes('OI Flip')) return { bgcolor: '#f8e7a7ff' };
    // //   if (type.includes('Smart Money')) return { bgcolor: '#a9faccff' };
    //   if (type.includes('Trap')) return { bgcolor: '#eb8585ff' };
      return {};
  };

  return (
    <>
      <Head>
        <title>Signals - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 0 }}>
            Signals Timeline
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Signal Timeline — {selectedDate}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              🔄 Reversal = Trend flip · ⚡ OI Flip = Writing→Buying · 💰 Smart Money = High OI + acceleration · ⚠️ Trap = Price/OI mismatch · ➡️ Continuation = Sustained trend
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Detail</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>CE Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>PE Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Bias</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>NIFTY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Strength</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : timelineRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                        <Typography color="text.secondary">No signals found for the selected filters.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    timelineRecords.map((record, idx) => (
                      <TableRow key={idx} sx={{ ...getRowStyle(record.Type), '&:hover': { filter: 'brightness(0.95)' } }}>
                        <TableCell>{record.Time}</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>{record.Type}</TableCell>
                        <TableCell>{record.Detail}</TableCell>
                        <TableCell 
                          sx={{ 
                            bgcolor: ACTION_COLORS[record.CE_Action] || 'transparent',
                            color: ACTION_COLORS[record.CE_Action] !== 'transparent' ? '#000' : 'inherit',
                            fontWeight: '500'
                          }}
                        >
                          {record.CE_Action}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            bgcolor: ACTION_COLORS[record.PE_Action] || 'transparent',
                            color: ACTION_COLORS[record.PE_Action] !== 'transparent' ? '#000' : 'inherit',
                            fontWeight: '500'
                          }}
                        >
                          {record.PE_Action}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            bgcolor: BIAS_COLORS[record.Bias] || 'transparent',
                            color: '#000',
                            fontWeight: '500'
                          }}
                        >
                          {record.Bias}
                        </TableCell>
                        <TableCell>{record.NIFTY}</TableCell>
                        <TableCell 
                          sx={{ 
                            bgcolor: getSignalColor(record.Strength),
                            color: '#000',
                            fontWeight: 'bold',
                            textAlign: 'right',
                            pr: 4
                          }}
                        >
                          {record.Strength.toFixed(6)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

SignalsDashboard.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default SignalsDashboard;

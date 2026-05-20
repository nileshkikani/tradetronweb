const LEVELS = [
  'atm',
  'otm_1',
  'otm_2',
  'otm_3',
  'otm_4',
  'otm_5',
  'itm_1',
  'itm_2',
  'itm_3',
  'itm_4',
  'itm_5',
];

const CE_ROUTE = {
  'Call Buying': 'call_long',
  'Call Writing': 'call_short',
  'Short Covering': 'short_cov_ce',
  'Long Unwinding': 'long_unw_ce',
};

const PE_ROUTE = {
  'Put Buying': 'put_long',
  'Put Writing': 'put_short',
  'Short Covering': 'short_cov_pe',
  'Long Unwinding': 'long_unw_pe',
};

const CE_BULLISH = new Set(['Call Buying', 'Short Covering']);
const CE_BEARISH = new Set(['Call Writing', 'Long Unwinding']);
const PE_BULLISH = new Set(['Put Writing', 'Long Unwinding']);
const PE_BEARISH = new Set(['Put Buying', 'Short Covering']);

export function toNum(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Smart-money API: GET returns a JSON array of intraday rows. */
export function parseSmartMoneyRows(response) {
  const body = response?.data;

  if (Array.isArray(body)) {
    return sortByDateTime(body);
  }

  if (body && Array.isArray(body.data)) {
    return sortByDateTime(body.data);
  }

  if (body && Array.isArray(body.results)) {
    return sortByDateTime(body.results);
  }

  return [];
}

const SM_COMPARE_METRIC_KEYS = [
  'sm_ce_oi_cum',
  'sm_pe_oi_cum',
  'sm_cum_call_long',
  'sm_cum_put_short',
  'sm_cum_call_short',
  'sm_cum_put_long',
];

/** Smart-money vs FII compare API: GET returns { date, sm_* } or { error: string }. */
export function parseSmartMoneyCompare(response) {
  const body = response?.data;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: null, data: null };
  }
  if (body.error) {
    return { error: String(body.error), data: null };
  }
  const hasMetrics = SM_COMPARE_METRIC_KEYS.some((key) => body[key] != null);
  if (!hasMetrics) {
    return { error: null, data: null };
  }
  return { error: null, data: body };
}

export function formatCapturePercent(value) {
  const n = toNum(value);
  if (!Number.isFinite(n)) return '—';
  return `${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}%`;
}

/** Smart-money EOD API: GET returns [{ truncate_date, sm_net_position }, ...]. */
export function parseSmartMoneyEodRows(response) {
  const body = response?.data;
  const rows = Array.isArray(body)
    ? body
    : body && Array.isArray(body.data)
      ? body.data
      : [];
  return [...rows].sort(
    (a, b) =>
      new Date(a.truncate_date).getTime() - new Date(b.truncate_date).getTime()
  );
}

/** OI data API: GET returns { data: [...] }. */
export function parseOiDataRows(response) {
  const body = response?.data;
  if (body && Array.isArray(body.data)) {
    return sortByDateTime(body.data);
  }
  if (Array.isArray(body)) {
    return sortByDateTime(body);
  }
  return [];
}

function sortByDateTime(rows) {
  return [...rows].sort(
    (a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
  );
}

export function uniqueDates(dates = []) {
  return [...new Set(dates.filter(Boolean))];
}

export function formatOi(value) {
  const v = toNum(value);
  const a = Math.abs(v);
  if (a >= 10_000_000) return `${(v / 10_000_000).toFixed(2)}Cr`;
  if (a >= 100_000) return `${(v / 100_000).toFixed(2)}L`;
  if (a >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatTimeLabel(dateString) {
  try {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return dateString;
  }
}

/**
 * Resolve SM marker colour (matches Python `render_smart_money_chart`).
 * Priority: smart_money_direction → bull/bear level counts → market_bias.
 */
export function getSmartMoneyDirection(row) {
  const dir = String(row?.smart_money_direction || '').trim();
  if (dir === 'Bullish' || dir === 'Bearish' || dir === 'Neutral') {
    return dir;
  }

  const bull = toNum(row?.sm_bull_count);
  const bear = toNum(row?.sm_bear_count);
  if (bull > bear) return 'Bullish';
  if (bear > bull) return 'Bearish';

  const bias = String(row?.market_bias || '').trim();
  if (bias === 'Bullish' || bias === 'Bearish' || bias === 'Neutral') {
    return bias;
  }

  return 'Neutral';
}

/**
 * Build intraday NIFTY levels for charting.
 * API provides `nifty_change` + `max_pain_strike` (session anchor ≈ spot zone).
 * If `nifty` is present on a row, use it directly.
 */
export function buildChartData(smRows) {
  if (!smRows?.length) return [];

  const sessionAnchor =
    toNum(smRows.find((r) => toNum(r.nifty) > 1000)?.nifty) ||
    toNum(smRows.find((r) => toNum(r.max_pain_strike) > 0)?.max_pain_strike) ||
    0;

  let cumChange = 0;

  return smRows.map((row) => {
    cumChange += toNum(row.nifty_change);
    const apiNifty = toNum(row.nifty);

    let nifty;
    if (apiNifty > 1000) {
      nifty = apiNifty;
    } else if (sessionAnchor > 1000) {
      nifty = sessionAnchor + cumChange;
    } else {
      nifty = cumChange;
    }

    return { ...row, nifty };
  });
}

/** Tight Y-axis bounds for NIFTY overlay on dual-axis charts. */
export function getNiftyAxisRange(chartRows) {
  const vals = chartRows
    .map((r) => toNum(r.nifty))
    .filter((v) => Number.isFinite(v) && Math.abs(v) > 100);

  if (!vals.length) {
    return { min: undefined, max: undefined };
  }

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = Math.max((max - min) * 0.12, 30);

  return {
    min: Math.floor(min - pad),
    max: Math.ceil(max + pad),
  };
}

/** Scatter points for SM signals only (Python parity). */
export function buildSmMarkerGroups(chartRows) {
  const groups = { Bullish: [], Bearish: [], Neutral: [] };

  chartRows
    .filter((row) => row.smart_money_signal === true)
    .forEach((row) => {
      const direction = getSmartMoneyDirection(row);
      groups[direction].push({
        x: new Date(row.date_time).getTime(),
        y: toNum(row.nifty),
        bull: toNum(row.sm_bull_count),
        bear: toNum(row.sm_bear_count),
        ce: row.atm_ce_action || '',
        pe: row.atm_pe_action || '',
      });
    });

  return groups;
}

/** Bucket totals from smart-money API rows only (no oi-data). */
export function computeSmBucketsFromSmartMoney(smRows) {
  const empty = {
    call_long: 0,
    call_short: 0,
    put_long: 0,
    put_short: 0,
    short_cov_ce: 0,
    short_cov_pe: 0,
    long_unw_ce: 0,
    long_unw_pe: 0,
    net: 0,
    bias: 'Neutral',
  };

  if (!smRows?.length) {
    return { finals: { ...empty }, series: [] };
  }

  const buckets = {
    call_long: 0,
    call_short: 0,
    put_long: 0,
    put_short: 0,
    short_cov_ce: 0,
    short_cov_pe: 0,
    long_unw_ce: 0,
    long_unw_pe: 0,
  };

  const routeAction = (action, amount, isCe) => {
    const route = isCe ? CE_ROUTE : PE_ROUTE;
    const key = route[action];
    if (key && amount > 0) buckets[key] += amount;
  };

  smRows.forEach((row, i) => {
    if (!row.smart_money_signal) return;

    const prev = i > 0 ? smRows[i - 1] : row;
    const ceFlow = Math.abs(toNum(row.sm_ce_oi_cum) - toNum(prev.sm_ce_oi_cum));
    const peFlow = Math.abs(toNum(row.sm_pe_oi_cum) - toNum(prev.sm_pe_oi_cum));

    routeAction(row.atm_ce_action, ceFlow, true);
    routeAction(row.atm_pe_action, peFlow, false);

    LEVELS.forEach((lv) => {
      if (lv === 'atm') return;
      const ceAct = row[`${lv}_ce_action`];
      const peAct = row[`${lv}_pe_action`];
      if (ceAct) routeAction(ceAct, ceFlow / 2, true);
      if (peAct) routeAction(peAct, peFlow / 2, false);
    });
  });

  const bullish =
    buckets.call_long +
    buckets.put_short +
    buckets.short_cov_ce +
    buckets.long_unw_pe;
  const bearish =
    buckets.call_short +
    buckets.put_long +
    buckets.long_unw_ce +
    buckets.short_cov_pe;
  const net = toNum(smRows[smRows.length - 1]?.sm_net_position) || bullish - bearish;
  const last = smRows[smRows.length - 1];
  const bias = last?.market_bias || (net > 0 ? 'Bullish' : net < 0 ? 'Bearish' : 'Neutral');

  return {
    finals: { ...buckets, net, bias },
    series: [],
  };
}

export function computeSmBucketsFromOi(oiData) {
  if (!oiData?.length) {
    return {
      finals: {
        call_long: 0,
        call_short: 0,
        put_long: 0,
        put_short: 0,
        short_cov_ce: 0,
        short_cov_pe: 0,
        long_unw_ce: 0,
        long_unw_pe: 0,
        net: 0,
        bias: 'Neutral',
      },
      series: [],
    };
  }

  const dateGroups = {};
  oiData.forEach((row, idx) => {
    const d = row.date_time.slice(0, 10);
    if (!dateGroups[d]) dateGroups[d] = [];
    dateGroups[d].push(idx);
  });

  const oiChanges = {};
  const pxChanges = {};
  LEVELS.forEach((lv) => {
    ['ce', 'pe'].forEach((side) => {
      const oiKey = `${lv}_${side}_oi`;
      const pxKey = `${lv}_${side}_close`;
      const oiChgKey = `${lv}_${side}_oi_change`;
      const pxChgKey = `${lv}_${side}_close_change`;
      oiChanges[oiChgKey] = new Array(oiData.length).fill(0);
      pxChanges[pxChgKey] = new Array(oiData.length).fill(0);
      Object.values(dateGroups).forEach((idxList) => {
        idxList.forEach((i, pos) => {
          if (pos === 0) return;
          const prev = oiData[idxList[pos - 1]];
          const curr = oiData[i];
          oiChanges[oiChgKey][i] = toNum(curr[oiKey]) - toNum(prev[oiKey]);
          pxChanges[pxChgKey][i] = toNum(curr[pxKey]) - toNum(prev[pxKey]);
        });
      });
    });
  });

  const allAbs = [];
  LEVELS.forEach((lv) => {
    ['ce', 'pe'].forEach((side) => {
      oiChanges[`${lv}_${side}_oi_change`].forEach((v) => allAbs.push(Math.abs(v)));
    });
  });
  allAbs.sort((a, b) => a - b);
  const pctIdx = Math.floor(0.9 * allAbs.length);
  const smThreshold = allAbs[pctIdx] ?? 0;

  const oiAccel = {};
  LEVELS.forEach((lv) => {
    ['ce', 'pe'].forEach((side) => {
      const key = `${lv}_${side}_oi_change`;
      oiAccel[key] = new Array(oiData.length).fill(0);
      Object.values(dateGroups).forEach((idxList) => {
        idxList.forEach((i, pos) => {
          if (pos === 0) return;
          const prevIdx = idxList[pos - 1];
          oiAccel[key][i] = Math.abs(oiChanges[key][i] - oiChanges[key][prevIdx]);
        });
      });
    });
  });

  const bucketKeys = [
    'call_long',
    'call_short',
    'put_long',
    'put_short',
    'short_cov_ce',
    'short_cov_pe',
    'long_unw_ce',
    'long_unw_pe',
  ];
  const barFlows = bucketKeys.reduce((acc, k) => {
    acc[k] = new Array(oiData.length).fill(0);
    return acc;
  }, {});

  const actions = oiData.map((row, idx) => {
    const acts = {};
    LEVELS.forEach((lv) => {
      const oiChg = oiChanges[`${lv}_ce_oi_change`][idx];
      const pxChg = pxChanges[`${lv}_ce_close_change`][idx];
      let ceAct = 'Long Unwinding';
      if (oiChg > 0 && pxChg > 0) ceAct = 'Call Buying';
      else if (oiChg > 0 && pxChg <= 0) ceAct = 'Call Writing';
      else if (oiChg <= 0 && pxChg > 0) ceAct = 'Short Covering';
      acts[`${lv}_ce_action`] = ceAct;

      const peOiChg = oiChanges[`${lv}_pe_oi_change`][idx];
      const pePxChg = pxChanges[`${lv}_pe_close_change`][idx];
      let peAct = 'Short Covering';
      if (peOiChg > 0 && pePxChg > 0) peAct = 'Put Buying';
      else if (peOiChg > 0 && pePxChg <= 0) peAct = 'Put Writing';
      else if (peOiChg <= 0 && pePxChg > 0) peAct = 'Long Unwinding';
      acts[`${lv}_pe_action`] = peAct;
    });
    return acts;
  });

  oiData.forEach((row, idx) => {
    LEVELS.forEach((lv) => {
      ['ce', 'pe'].forEach((side) => {
        const oiChgKey = `${lv}_${side}_oi_change`;
        const absChg = Math.abs(oiChanges[oiChgKey][idx]);
        const isSm = absChg >= smThreshold && oiAccel[oiChgKey][idx] > 0;
        if (!isSm) return;
        const act = actions[idx][`${lv}_${side}_action`];
        const route = side === 'ce' ? CE_ROUTE : PE_ROUTE;
        const bucket = route[act];
        if (bucket) barFlows[bucket][idx] += absChg;
      });
    });
  });

  const cumByDate = {};
  Object.keys(dateGroups).forEach((date) => {
    cumByDate[date] = bucketKeys.reduce((acc, k) => {
      acc[k] = 0;
      return acc;
    }, {});
  });

  const series = oiData.map((row, idx) => {
    const date = row.date_time.slice(0, 10);
    bucketKeys.forEach((k) => {
      cumByDate[date][k] += barFlows[k][idx];
    });
    const c = cumByDate[date];
    const bullish =
      c.call_long + c.put_short + c.short_cov_ce + c.long_unw_pe;
    const bearish =
      c.call_short + c.put_long + c.long_unw_ce + c.short_cov_pe;
    const net = bullish - bearish;
    const total = bullish + bearish;
    const margin = total ? net / total : 0;
    const bias =
      margin > 0.05 ? 'Bullish' : margin < -0.05 ? 'Bearish' : 'Neutral';
    return {
      date_time: row.date_time,
      sm_cum_call_long: c.call_long,
      sm_cum_call_short: c.call_short,
      sm_cum_put_long: c.put_long,
      sm_cum_put_short: c.put_short,
      sm_cum_short_cov_ce: c.short_cov_ce,
      sm_cum_short_cov_pe: c.short_cov_pe,
      sm_cum_long_unw_ce: c.long_unw_ce,
      sm_cum_long_unw_pe: c.long_unw_pe,
      sm_cum_net: net,
      sm_intraday_bias: bias,
    };
  });

  const last = series[series.length - 1] || {};
  return {
    finals: {
      call_long: last.sm_cum_call_long || 0,
      call_short: last.sm_cum_call_short || 0,
      put_long: last.sm_cum_put_long || 0,
      put_short: last.sm_cum_put_short || 0,
      short_cov_ce: last.sm_cum_short_cov_ce || 0,
      short_cov_pe: last.sm_cum_short_cov_pe || 0,
      long_unw_ce: last.sm_cum_long_unw_ce || 0,
      long_unw_pe: last.sm_cum_long_unw_pe || 0,
      net: last.sm_cum_net || 0,
      bias: last.sm_intraday_bias || 'Neutral',
    },
    series,
  };
}

export function getSmKpis(smRows) {
  const smSignals = smRows.filter((r) => r.smart_money_signal);
  const bullish = smSignals.filter(
    (r) => (r.smart_money_direction || '').toLowerCase() === 'bullish'
  ).length;
  const bearish = smSignals.filter(
    (r) => (r.smart_money_direction || '').toLowerCase() === 'bearish'
  ).length;
  const last = smRows[smRows.length - 1] || {};
  const netEod = toNum(last.sm_net_eod);
  const prevNet = toNum(last.sm_prev_day_net);
  const trend =
    netEod > prevNet ? 'Building ↑' : netEod < prevNet ? 'Unwinding ↓' : 'Flat →';

  return {
    total: smSignals.length,
    bullish,
    bearish,
    neutral: smSignals.length - bullish - bearish,
    netEod,
    prevNet,
    trend,
    flips: smRows.filter((r) => r.sm_direction_change).length,
  };
}

export { LEVELS, CE_BULLISH, CE_BEARISH, PE_BULLISH, PE_BEARISH };

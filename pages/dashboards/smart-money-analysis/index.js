import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from 'src/utils/axios';
import useToast from 'src/hooks/useToast';
import {
    buildChartData,
    buildSmMarkerGroups,
    formatOi,
    getNiftyAxisRange,
    getSmKpis,
    formatCapturePercent,
    parseSmartMoneyCompare,
    parseSmartMoneyEodRows,
    parseSmartMoneyRows,
    toNum,
} from 'src/utils/smartMoney';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SM_DIR_COLORS = {
    Bullish: '#27ae60',
    Bearish: '#e74c3c',
    Neutral: '#f39c12',
};

const SM_COMPARE_METRICS = [
    { key: 'sm_ce_oi_cum', label: 'CE OI Cumulative' },
    { key: 'sm_pe_oi_cum', label: 'PE OI Cumulative' },
    { key: 'sm_cum_call_long', label: 'Call Long' },
    { key: 'sm_cum_put_short', label: 'Put Short' },
    { key: 'sm_cum_call_short', label: 'Call Short' },
    { key: 'sm_cum_put_long', label: 'Put Long' },
];

function formatEodDateLabel(dateStr, index, total) {
    const d = new Date(`${dateStr}T12:00:00`);
    const month = d.toLocaleDateString('en-IN', { month: 'short' });
    const day = d.getDate();
    const year = d.getFullYear();
    if (index === 0 || index === total - 1) {
        return `${month} ${day} ${year}`;
    }
    return `${month} ${day}`;
}

function MetricCard({ label, value, color, subValue }) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: color,
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {label}
                    </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                    {value}
                </Typography>
                {subValue != null && (
                    <Typography
                        variant="body2"
                        sx={{ color, fontWeight: 600, mt: 0.5 }}
                    >
                        {subValue}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

function SmartMoneyAnalysis() {
    const theme = useTheme();
    const { showToast } = useToast();
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [smData, setSmData] = useState([]);
    const [smEodData, setSmEodData] = useState([]);
    const [smCompare, setSmCompare] = useState(null);
    const [loading, setLoading] = useState(false);
    const [eodLoading, setEodLoading] = useState(false);
    const [compareLoading, setCompareLoading] = useState(false);
    const [datesLoading, setDatesLoading] = useState(true);

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

    const fetchSmartMoneyData = async (date) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(
                `/oi-data/smart-money/?date=${date}`
            );
            const rows = parseSmartMoneyRows(response);
            if (rows.length === 0) {
                showToast('No smart money data for this date', 'info');
            }
            setSmData(rows);
        } catch (error) {
            console.error('Error fetching smart money data:', error);
            showToast('Failed to fetch smart money data', 'error');
            setSmData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSmartMoneyEod = async (date) => {
        try {
            setEodLoading(true);
            const response = await axiosInstance.get(
                `/oi-data/smart-money-eod/?data=${date}`
            );
            setSmEodData(parseSmartMoneyEodRows(response));
        } catch (error) {
            console.error('Error fetching smart money EOD data:', error);
            showToast('Failed to fetch EOD smart money data', 'error');
            setSmEodData([]);
        } finally {
            setEodLoading(false);
        }
    };

    const fetchSmartMoneyCompare = async (date) => {
        try {
            setCompareLoading(true);
            const response = await axiosInstance.get(
                `/oi-data/compare/?date=${date}`
            );
            setSmCompare(parseSmartMoneyCompare(response));
        } catch (error) {
            console.error('Error fetching smart money compare data:', error);
            showToast('Failed to fetch SM vs FII compare data', 'error');
            setSmCompare(null);
        } finally {
            setCompareLoading(false);
        }
    };

    useEffect(() => {
        fetchDates();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchSmartMoneyData(selectedDate);
            fetchSmartMoneyEod(selectedDate);
            fetchSmartMoneyCompare(selectedDate);
        }
    }, [selectedDate]);

    const chartData = useMemo(() => buildChartData(smData), [smData]);

    const niftyYRange = useMemo(() => getNiftyAxisRange(chartData), [chartData]);

    const finals = useMemo(() => {
        const last = smData[smData.length - 1];
        if (!last) {
            return {
                call_long: 0,
                put_short: 0,
                call_short: 0,
                put_long: 0,
                short_cov_ce: 0,
                short_cov_pe: 0,
                long_unw_ce: 0,
                long_unw_pe: 0,
                net: 0,
                bias: 'Neutral',
            };
        }
        return {
            call_long: toNum(last.sm_cum_call_long),
            put_short: toNum(last.sm_cum_put_short),
            call_short: toNum(last.sm_cum_call_short),
            put_long: toNum(last.sm_cum_put_long),
            short_cov_ce: toNum(last.sm_cum_short_cov_ce),
            short_cov_pe: toNum(last.sm_cum_short_cov_pe),
            long_unw_ce: toNum(last.sm_cum_long_unw_ce),
            long_unw_pe: toNum(last.sm_cum_long_unw_pe),
            net: toNum(last.sm_net_position),
            bias: last.sm_intraday_bias || 'Neutral',
        };
    }, [smData]);

    const smKpis = useMemo(() => getSmKpis(smData), [smData]);

    const biasColor =
        finals.bias === 'Bullish'
            ? '#27ae60'
            : finals.bias === 'Bearish'
                ? '#e74c3c'
                : '#95a5a6';

    const smMarkers = useMemo(
        () => buildSmMarkerGroups(chartData),
        [chartData]
    );

    const isDark = theme.palette.mode === 'dark';

    const chartPalette = useMemo(
        () => ({
            niftyLine: isDark ? '#F1F5F9' : '#1a1a1a',
            netSmLine: isDark ? '#E2E8F0' : '#1a1a1a',
            netSmFill: isDark ? '#2ecc71' : '#27ae60',
            niftySecondary: '#e67e22',
            directionFlip: '#FF9800',
            zeroLine: isDark ? 'rgba(255, 255, 255, 0.45)' : '#888888',
            axis: theme.palette.text.secondary,
            grid: theme.palette.divider,
            bullish: SM_DIR_COLORS.Bullish,
            bearish: SM_DIR_COLORS.Bearish,
            neutral: SM_DIR_COLORS.Neutral,
            selectedDot: isDark ? theme.palette.primary.light : '#111111',
            selectedDotStroke: '#ffffff',
            dataLabel: theme.palette.text.primary,
        }),
        [isDark, theme]
    );

    const niftySmChartOptions = useMemo(
        () => ({
            chart: {
                type: 'line',
                height: 420,
                toolbar: { show: true },
                zoom: { enabled: true },
                foreColor: chartPalette.axis,
                fontFamily: theme.typography.fontFamily,
                background: 'transparent',
            },
            colors: [
                chartPalette.niftyLine,
                chartPalette.bearish,
                chartPalette.bullish,
                chartPalette.neutral,
            ],
            stroke: { width: [2.5, 0, 0, 0], curve: 'straight' },
            markers: {
                size: [0, 10, 11, 10],
                shape: ['circle', 'square', 'star', 'triangle'],
                strokeWidth: [0, 2, 2, 2],
                strokeColors: [
                    chartPalette.niftyLine,
                    '#ffffff',
                    '#ffffff',
                    '#1a1a1a',
                ],
                hover: { sizeOffset: 2 },
            },
            xaxis: {
                type: 'datetime',
                labels: { datetimeUTC: false, format: 'HH:mm', style: { colors: chartPalette.axis } },
                title: {
                    text: chartData[0]?.date_time?.slice(0, 10) || '',
                    style: { color: chartPalette.axis },
                },
                axisBorder: { color: chartPalette.grid },
                axisTicks: { color: chartPalette.grid },
            },
            yaxis: {
                labels: {
                    formatter: (v) => `${(v / 1000).toFixed(1)}k`,
                    style: { colors: chartPalette.niftyLine },
                },
                title: { text: 'NIFTY', style: { color: chartPalette.niftyLine } },
                axisBorder: { color: chartPalette.grid },
                axisTicks: { color: chartPalette.grid },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                labels: { colors: chartPalette.axis },
            },
            grid: {
                borderColor: chartPalette.grid,
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
            },
            tooltip: {
                theme: theme.palette.mode,
                shared: false,
                intersect: true,
                x: { format: 'HH:mm' },
                y: {
                    formatter: (val) =>
                        Math.abs(val) >= 1000
                            ? `${(val / 1000).toFixed(2)}k`
                            : val.toFixed(2),
                },
            },
        }),
        [chartData, chartPalette, theme]
    );

    const niftySmChartSeries = useMemo(
        () => [
            {
                name: 'NIFTY',
                type: 'line',
                data: chartData.map((r) => ({
                    x: new Date(r.date_time).getTime(),
                    y: toNum(r.nifty),
                })),
            },
            {
                name: 'SM Bearish',
                type: 'scatter',
                data: smMarkers.Bearish,
            },
            {
                name: 'SM Bullish',
                type: 'scatter',
                data: smMarkers.Bullish,
            },
            {
                name: 'SM Neutral',
                type: 'scatter',
                data: smMarkers.Neutral,
            },
        ],
        [chartData, smMarkers]
    );

    const flipPoints = useMemo(
        () =>
            chartData
                .filter((r) => r.sm_direction_change)
                .map((r) => ({
                    x: new Date(r.date_time).getTime(),
                    y: toNum(r.sm_net_position),
                })),
        [chartData]
    );

    const netSmChartOptions = useMemo(
        () => ({
            chart: {
                type: 'line',
                height: 360,
                toolbar: { show: true },
                foreColor: chartPalette.axis,
                fontFamily: theme.typography.fontFamily,
                background: 'transparent',
            },
            colors: [chartPalette.netSmLine, chartPalette.niftySecondary],
            stroke: { width: [2.6, 2], dashArray: [0, 5], curve: 'straight' },
            fill: {
                type: ['gradient', 'solid'],
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.35,
                    gradientToColors: [chartPalette.netSmFill],
                    opacityFrom: isDark ? 0.55 : 0.35,
                    opacityTo: 0.08,
                    stops: [0, 100],
                },
            },
            annotations: {
                yaxis: [
                    {
                        y: 0,
                        yAxisIndex: 0,
                        borderColor: chartPalette.zeroLine,
                        strokeDashArray: 4,
                        label: {
                            text: '0',
                            style: { color: chartPalette.axis, background: 'transparent' },
                        },
                    },
                ],
                points: flipPoints.map((pt) => ({
                    x: pt.x,
                    y: pt.y,
                    yAxisIndex: 0,
                    marker: {
                        size: 7,
                        shape: 'cross',
                        fillColor: chartPalette.directionFlip,
                        strokeColor: '#ffffff',
                        strokeWidth: 2,
                    },
                    label: { text: '' },
                })),
            },
            xaxis: {
                type: 'datetime',
                labels: { datetimeUTC: false, format: 'HH:mm', style: { colors: chartPalette.axis } },
                axisBorder: { color: chartPalette.grid },
                axisTicks: { color: chartPalette.grid },
            },
            // Two series only: [0] Net SM → left axis, [1] NIFTY → right axis
            yaxis: [
                {
                    title: {
                        text: 'Net SM (Bullish − Bearish OI)',
                        style: { color: chartPalette.netSmLine },
                    },
                    labels: {
                        style: { colors: chartPalette.netSmLine },
                        formatter: (v) => {
                            const a = Math.abs(v);
                            if (a >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
                            if (a >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
                            return v.toFixed(0);
                        },
                    },
                    axisBorder: { show: true, color: chartPalette.grid },
                    axisTicks: { color: chartPalette.grid },
                },
                {
                    opposite: true,
                    min: niftyYRange.min,
                    max: niftyYRange.max,
                    tickAmount: 6,
                    decimalsInFloat: 1,
                    title: {
                        text: 'NIFTY',
                        style: { color: chartPalette.niftySecondary },
                    },
                    labels: {
                        style: { colors: chartPalette.niftySecondary },
                        formatter: (v) => `${(v / 1000).toFixed(1)}k`,
                    },
                    axisBorder: { show: true, color: chartPalette.grid },
                    axisTicks: { color: chartPalette.grid },
                },
            ],
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                labels: { colors: chartPalette.axis },
            },
            grid: {
                borderColor: chartPalette.grid,
                strokeDashArray: 4,
                xaxis: { lines: { show: false } },
            },
            tooltip: {
                shared: true,
                theme: theme.palette.mode,
                x: { format: 'HH:mm' },
                y: {
                    formatter: (val, { seriesIndex }) => {
                        if (seriesIndex === 1) {
                            return `${(val / 1000).toFixed(2)}k`;
                        }
                        const a = Math.abs(val);
                        if (a >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
                        if (a >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
                        return val.toFixed(0);
                    },
                },
            },
        }),
        [chartPalette, flipPoints, isDark, niftyYRange, theme]
    );

    const netSmChartSeries = useMemo(
        () => [
            {
                name: 'Net SM Position',
                type: 'area',
                data: chartData.map((r) => ({
                    x: new Date(r.date_time).getTime(),
                    y: toNum(r.sm_net_position),
                })),
            },
            {
                name: 'NIFTY',
                type: 'line',
                data: chartData.map((r) => ({
                    x: new Date(r.date_time).getTime(),
                    y: toNum(r.nifty),
                })),
            },
        ],
        [chartData]
    );

    const standingBarOptions = useMemo(() => {
        const flows = [
            { label: 'Call Short', value: finals.call_short, side: 'bearish' },
            { label: 'Put Long', value: finals.put_long, side: 'bearish' },
            { label: 'Call Long', value: finals.call_long, side: 'bullish' },
            { label: 'Put Short', value: finals.put_short, side: 'bullish' },
        ].sort((a, b) => a.value - b.value);

        return {
            flows,
            options: {
                chart: {
                    type: 'bar',
                    height: 280,
                    toolbar: { show: false },
                    foreColor: chartPalette.axis,
                    fontFamily: theme.typography.fontFamily,
                    background: 'transparent',
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '55%',
                        distributed: true,
                    },
                },
                colors: flows.map((f) =>
                    f.side === 'bullish' ? chartPalette.bullish : chartPalette.bearish
                ),
                dataLabels: {
                    enabled: true,
                    formatter: (_, opts) => formatOi(flows[opts.dataPointIndex].value),
                    style: {
                        fontSize: '11px',
                        fontWeight: 600,
                        colors: [chartPalette.dataLabel],
                    },
                },
                xaxis: {
                    categories: flows.map((f) => f.label),
                    title: { text: 'OI Built (signed)', style: { color: chartPalette.axis } },
                    labels: {
                        style: { colors: chartPalette.axis },
                        formatter: (v) => {
                            const a = Math.abs(v);
                            if (a >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
                            return v;
                        },
                    },
                    axisBorder: { color: chartPalette.grid },
                    axisTicks: { color: chartPalette.grid },
                },
                yaxis: {
                    labels: { style: { colors: chartPalette.axis } },
                },
                legend: { show: false },
                grid: {
                    borderColor: chartPalette.grid,
                    strokeDashArray: 4,
                },
                tooltip: {
                    theme: theme.palette.mode,
                    y: {
                        formatter: (_, opts) => formatOi(flows[opts.dataPointIndex].value),
                    },
                },
            },
            series: [
                {
                    name: 'OI Built',
                    data: flows.map((f) =>
                        f.side === 'bearish' ? -Math.abs(f.value) : Math.abs(f.value)
                    ),
                },
            ],
        };
    }, [chartPalette, finals, theme]);

    const multidayChart = useMemo(() => {
        const categories = smEodData.map((d) => d.truncate_date);
        const labels = smEodData.map((d, i) =>
            formatEodDateLabel(d.truncate_date, i, smEodData.length)
        );
        const values = smEodData.map((d) => toNum(d.sm_net_position));
        const colors = values.map((v) =>
            v < 0 ? chartPalette.bearish : chartPalette.bullish
        );
        const selIdx = categories.indexOf(selectedDate);

        const pointAnnotations =
            selIdx >= 0
                ? [
                    {
                        x: labels[selIdx],
                        y: values[selIdx],
                        marker: {
                            size: 8,
                            fillColor: chartPalette.selectedDot,
                            strokeColor: chartPalette.selectedDotStroke,
                            strokeWidth: 2,
                        },
                    },
                ]
                : [];

        return {
            options: {
                chart: {
                    type: 'bar',
                    height: 360,
                    toolbar: { show: false },
                    foreColor: chartPalette.axis,
                    fontFamily: theme.typography.fontFamily,
                    background: 'transparent',
                },
                plotOptions: {
                    bar: {
                        columnWidth: '65%',
                        distributed: true,
                    },
                },
                colors,
                dataLabels: { enabled: false },
                xaxis: {
                    categories: labels,
                    labels: {
                        rotate: -45,
                        rotateAlways: true,
                        style: { colors: chartPalette.axis, fontSize: '11px' },
                    },
                    axisBorder: { color: chartPalette.grid },
                    axisTicks: { color: chartPalette.grid },
                },
                yaxis: {
                    title: {
                        text: 'Net OI (PE writers − CE writers)',
                        style: { color: chartPalette.axis },
                    },
                    labels: {
                        style: { colors: chartPalette.axis },
                        formatter: (v) => {
                            const a = Math.abs(v);
                            if (a >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
                            return v;
                        },
                    },
                },
                annotations: {
                    yaxis: [
                        {
                            y: 0,
                            borderColor: chartPalette.zeroLine,
                            strokeDashArray: 4,
                        },
                    ],
                    points: pointAnnotations,
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'left',
                    labels: { colors: chartPalette.axis },
                    customLegendItems: ['EOD Net Position', 'Selected Day'],
                    markers: {
                        fillColors: [chartPalette.bullish, chartPalette.selectedDot],
                    },
                },
                grid: {
                    borderColor: chartPalette.grid,
                    strokeDashArray: 4,
                },
                tooltip: {
                    theme: theme.palette.mode,
                    x: {
                        formatter: (_, { dataPointIndex }) =>
                            categories[dataPointIndex] || '',
                    },
                    y: { formatter: (v) => v.toLocaleString('en-IN') },
                },
            },
            series: [{ name: 'EOD Net Position', data: values }],
        };
    }, [chartPalette, selectedDate, smEodData, theme]);

    return (
        <>
            <Head>
                <title>Smart Money Analysis - Dashboard</title>
            </Head>
            <PageTitleWrapper>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Typography variant="h3" component="h3" sx={{ mb: 0 }}>
                        Smart Money Analysis
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center">
                        {datesLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <FormControl
                                size="small"
                                sx={{ minWidth: 200, bgcolor: 'background.paper' }}
                            >
                                <InputLabel id="sm-date-label">Select Date</InputLabel>
                                <Select
                                    labelId="sm-date-label"
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
                ) : smData.length === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 10, textAlign: 'center' }}>
                            <Typography variant="h4" color="text.secondary">
                                No smart money data for this date
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Intraday Direction — NIFTY + SM Signals
                                </Typography>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    NIFTY with Smart Money Signals (coloured by direction)
                                </Typography>
                                <Chart
                                    options={niftySmChartOptions}
                                    series={niftySmChartSeries}
                                    type="line"
                                    height={420}
                                />
                            </CardContent>
                        </Card>
                        <Box
                            display="flex"
                            gap={2}
                            flexWrap="wrap"
                            sx={{ mb: 3 }}
                        >
                            <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                                <MetricCard
                                    label="Call Long"
                                    value={formatOi(finals.call_long)}
                                    color="#27ae60"
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                                <MetricCard
                                    label="Put Short"
                                    value={formatOi(finals.put_short)}
                                    color="#27ae60"
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                                <MetricCard
                                    label="Call Short"
                                    value={formatOi(finals.call_short)}
                                    color="#e74c3c"
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                                <MetricCard
                                    label="Put Long"
                                    value={formatOi(finals.put_long)}
                                    color="#e74c3c"
                                />
                            </Box>
                            <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                                <MetricCard
                                    label="SM Bias"
                                    value={finals.bias}
                                    color={biasColor}
                                    subValue={
                                        finals.net !== 0
                                            ? `${finals.net >= 0 ? '+' : ''}${finals.net.toLocaleString('en-IN')}`
                                            : null
                                    }
                                />
                            </Box>
                        </Box>

                        <Accordion sx={{ mb: 3 }} disableGutters elevation={1}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight={600}>
                                    Show unwind buckets (short covering &amp; long unwinding)
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <MetricCard
                                            label="CE Short Cov"
                                            value={formatOi(finals.short_cov_ce)}
                                            color="#27ae60"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <MetricCard
                                            label="PE Long Unw"
                                            value={formatOi(finals.long_unw_pe)}
                                            color="#27ae60"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <MetricCard
                                            label="CE Long Unw"
                                            value={formatOi(finals.long_unw_ce)}
                                            color="#e74c3c"
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={3}>
                                        <MetricCard
                                            label="PE Short Cov"
                                            value={formatOi(finals.short_cov_pe)}
                                            color="#e74c3c"
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>


                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Net SM Position over Day — single line, crosses zero = bias
                                    flipped
                                </Typography>
                                <Chart
                                    options={netSmChartOptions}
                                    series={netSmChartSeries}
                                    type="line"
                                    height={360}
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    SM Bias: {finals.bias} ({formatOi(finals.net)} net OI) ·
                                    Direction flips today: {smKpis.flips}
                                    {smKpis.prevNet !== 0
                                        ? ` · vs Prev EOD: ${smKpis.prevNet >= 0 ? '+' : ''}${smKpis.prevNet.toLocaleString('en-IN')}`
                                        : ''}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Final SM Standing Today — Bearish ◄──── 0 ────► Bullish
                                </Typography>
                                <Chart
                                    options={standingBarOptions.options}
                                    series={standingBarOptions.series}
                                    type="bar"
                                    height={280}
                                />
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Day-over-Day SM Net Position (Last 20 Sessions)
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    gutterBottom
                                >
                                    Smart Money EOD Net Position — Last 20 Days
                                </Typography>
                                {eodLoading ? (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        py={6}
                                    >
                                        <CircularProgress />
                                    </Box>
                                ) : smEodData.length === 0 ? (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ py: 4, textAlign: 'center' }}
                                    >
                                        No EOD smart money data available
                                    </Typography>
                                ) : (
                                    <Chart
                                        options={multidayChart.options}
                                        series={multidayChart.series}
                                        type="bar"
                                        height={360}
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Smart Money vs FII — Capture Analysis
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    gutterBottom
                                >
                                    SM flow vs FII positioning ({selectedDate})
                                </Typography>
                                {compareLoading ? (
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        py={6}
                                    >
                                        <CircularProgress />
                                    </Box>
                                ) : !smCompare ? (
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ py: 4, textAlign: 'center' }}
                                    >
                                        No compare data available for this date
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        bgcolor: 'action.hover',
                                                    }}
                                                >
                                                    <TableCell
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        Metric
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        SM Value
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        FII Value
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ fontWeight: 700 }}
                                                    >
                                                        Capture %
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {SM_COMPARE_METRICS.map(
                                                    ({ key, label }) => {
                                                        const row =
                                                            smCompare[key] || {};
                                                        const smVal = toNum(
                                                            row.sm_value
                                                        );
                                                        const fiiVal = toNum(
                                                            row.fii_value
                                                        );
                                                        const valueColor = (
                                                            v
                                                        ) =>
                                                            v < 0
                                                                ? SM_DIR_COLORS.Bearish
                                                                : v > 0
                                                                  ? SM_DIR_COLORS.Bullish
                                                                  : 'text.primary';

                                                        return (
                                                            <TableRow
                                                                key={key}
                                                                hover
                                                            >
                                                                <TableCell
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {label}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        color: valueColor(
                                                                            smVal
                                                                        ),
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {formatOi(
                                                                        smVal
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        color: valueColor(
                                                                            fiiVal
                                                                        ),
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {formatOi(
                                                                        fiiVal
                                                                    )}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    {formatCapturePercent(
                                                                        row.capture_percent
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </Container>
        </>
    );
}

SmartMoneyAnalysis.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default SmartMoneyAnalysis;

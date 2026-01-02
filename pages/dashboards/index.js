import Head from "next/head";
import {
    Box,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    useTheme,
    alpha
} from "@mui/material";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import dynamic from "next/dynamic";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Dashboard() {
    const theme = useTheme();

    const stats = [
        {
            title: "Total P&L",
            value: "₹45,234.50",
            change: "+12.5%",
            isPositive: true,
            icon: AccountBalanceWalletIcon,
            color: theme.palette.success.main,
        },
        {
            title: "Active Trades",
            value: "23",
            change: "+3",
            isPositive: true,
            icon: ShowChartIcon,
            color: theme.palette.primary.main,
        },
        {
            title: "Win Rate",
            value: "68.5%",
            change: "+2.3%",
            isPositive: true,
            icon: AssessmentIcon,
            color: theme.palette.info.main,
        },
        {
            title: "Total Strategies",
            value: "12",
            change: "+1",
            isPositive: true,
            icon: TrendingUpIcon,
            color: theme.palette.warning.main,
        },
    ];

    const recentTrades = [
        {
            strategy: "EMA Scalping",
            entry: "2026-01-02 10:30",
            exit: "2026-01-02 11:45",
            pnl: 1250.5,
            status: "Win",
        },
        {
            strategy: "Order Block",
            entry: "2026-01-02 09:15",
            exit: "2026-01-02 10:20",
            pnl: -450.25,
            status: "Loss",
        },
        {
            strategy: "Breakout",
            entry: "2026-01-02 11:00",
            exit: "2026-01-02 12:30",
            pnl: 890.75,
            status: "Win",
        },
        {
            strategy: "EMA Scalping",
            entry: "2026-01-02 13:15",
            exit: "2026-01-02 14:00",
            pnl: 320.0,
            status: "Win",
        },
        {
            strategy: "Volume Spike",
            entry: "2026-01-02 14:30",
            exit: "2026-01-02 15:15",
            pnl: -180.5,
            status: "Loss",
        },
    ];

    const pnlTrendOptions = {
        chart: {
            type: "line",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
                formatter: (value) => `₹${value.toFixed(0)}`,
            },
        },
        grid: {
            borderColor: theme.palette.divider,
        },
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (value) => `₹${value.toFixed(2)}`,
            },
        },
        dataLabels: {
            enabled: false,
        },
    };

    const pnlTrendSeries = [
        {
            name: "P&L",
            data: [2500, 3200, 2800, 4100, 3500, 4800, 5200],
        },
    ];

    const strategyPerformanceOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "55%",
                borderRadius: 4,
            },
        },
        colors: [theme.palette.success.main, theme.palette.error.main],
        xaxis: {
            categories: ["EMA Scalping", "Order Block", "Breakout", "Volume Spike"],
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
                formatter: (value) => `₹${value.toFixed(0)}`,
            },
        },
        grid: {
            borderColor: theme.palette.divider,
        },
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (value) => `₹${value.toFixed(2)}`,
            },
        },
        legend: {
            position: "top",
            labels: {
                colors: theme.palette.text.primary,
            },
        },
        dataLabels: {
            enabled: false,
        },
    };

    const strategyPerformanceSeries = [
        {
            name: "Profit",
            data: [12500, 8900, 15200, 6700],
        },
        {
            name: "Loss",
            data: [-3200, -5400, -2100, -4800],
        },
    ];

    const winLossOptions = {
        chart: {
            type: "donut",
        },
        colors: [theme.palette.success.main, theme.palette.error.main],
        labels: ["Wins", "Losses"],
        legend: {
            position: "bottom",
            labels: {
                colors: theme.palette.text.primary,
            },
        },
        tooltip: {
            theme: theme.palette.mode,
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: "14px",
                fontWeight: "bold",
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total Trades",
                            fontSize: "16px",
                            color: theme.palette.text.primary,
                        },
                    },
                },
            },
        },
    };

    const winLossSeries = [68, 32];

    const monthlyPerformanceOptions = {
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 90, 100],
            },
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
                formatter: (value) => `₹${value.toFixed(0)}`,
            },
        },
        grid: {
            borderColor: theme.palette.divider,
        },
        tooltip: {
            theme: theme.palette.mode,
            y: {
                formatter: (value) => `₹${value.toFixed(2)}`,
            },
        },
        dataLabels: {
            enabled: false,
        },
    };

    const monthlyPerformanceSeries = [
        {
            name: "Monthly P&L",
            data: [25000, 32000, 28000, 41000, 35000, 45234],
        },
    ];

    return (
        <>
            <Head>
                <title>Dashboard - Trading Analytics</title>
            </Head>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Overview of your trading performance and analytics
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        background:
                                            theme.palette.mode === "dark"
                                                ? alpha(stat.color, 0.1)
                                                : alpha(stat.color, 0.05),
                                        border: `1px solid ${alpha(stat.color, 0.2)}`,
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 2,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    backgroundColor: alpha(stat.color, 0.2),
                                                    color: stat.color,
                                                    width: 56,
                                                    height: 56,
                                                }}
                                            >
                                                <IconComponent fontSize="large" />
                                            </Avatar>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    color: stat.isPositive
                                                        ? theme.palette.success.main
                                                        : theme.palette.error.main,
                                                }}
                                            >
                                                {stat.isPositive ? (
                                                    <TrendingUpIcon sx={{ mr: 0.5 }} />
                                                ) : (
                                                    <TrendingDownIcon sx={{ mr: 0.5 }} />
                                                )}
                                                <Typography variant="body2" fontWeight="600">
                                                    {stat.change}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="h4" fontWeight="700" gutterBottom>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {stat.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="600">
                                    P&L Trend (Last 7 Days)
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chart
                                        options={pnlTrendOptions}
                                        series={pnlTrendSeries}
                                        type="line"
                                        height={300}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="600">
                                    Win/Loss Distribution
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chart
                                        options={winLossOptions}
                                        series={winLossSeries}
                                        type="donut"
                                        height={300}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="600">
                                    Strategy Performance
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chart
                                        options={strategyPerformanceOptions}
                                        series={strategyPerformanceSeries}
                                        type="bar"
                                        height={300}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontWeight="600">
                                    Monthly Performance
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Chart
                                        options={monthlyPerformanceOptions}
                                        series={monthlyPerformanceSeries}
                                        type="area"
                                        height={300}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom fontWeight="600">
                            Recent Trades
                        </Typography>
                        <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                        <TableCell sx={{ fontWeight: 600 }}>Strategy</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Entry Time</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Exit Time</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>P&L</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentTrades.map((trade, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                "&:nth-of-type(odd)": {
                                                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                                                },
                                                "&:hover": {
                                                    backgroundColor: alpha(theme.palette.action.hover, 0.1),
                                                },
                                            }}
                                        >
                                            <TableCell>{trade.strategy}</TableCell>
                                            <TableCell>{trade.entry}</TableCell>
                                            <TableCell>{trade.exit}</TableCell>
                                            <TableCell
                                                sx={{
                                                    color:
                                                        trade.pnl > 0
                                                            ? theme.palette.success.main
                                                            : theme.palette.error.main,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                ₹{trade.pnl.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        color:
                                                            trade.status === "Win"
                                                                ? theme.palette.success.main
                                                                : theme.palette.error.main,
                                                    }}
                                                >
                                                    {trade.status === "Win" ? (
                                                        <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    ) : (
                                                        <CancelIcon sx={{ mr: 1, fontSize: 20 }} />
                                                    )}
                                                    {trade.status}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

Dashboard.getLayout = (page) => (
    <Authenticated>
        <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
    </Authenticated>
);

export default Dashboard;

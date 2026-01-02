import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import {
  Button,
  Select,
  MenuItem,
  Paper,
  Box,
  Typography,
  Chip,
  Pagination,
  FormControl,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TradingViewChart from './TradingViewChart';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axiosInstance from 'src/utils/axios';
import useToast from 'src/hooks/useToast';
import CustomDatePicker from 'src/components/DatePicker';
import MarketTrendCard from 'src/components/MarketTrendCard';
import SearchIcon from '@mui/icons-material/Search';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false
});

function VolumeSpikeTradesPage({ tradeType = 'active' }) {
  const baseUrl = process.env.EMA_SCALPING_URL;
  const { showToast } = useToast();

  // Get current date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // State management
  const [strategy, setStrategy] = useState('volume-spike'); // 'volume-spike', 'breakout', 'order-block'
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getTodayDate());
  const [searchSymbol, setSearchSymbol] = useState('');
  const [debouncedSearchSymbol, setDebouncedSearchSymbol] = useState('');

  const [volumeSpikeData, setVolumeSpikeData] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    pageSize: 20,
    totalOrders: 0,
    hasNext: false,
    hasPrevious: false
  });
  const [pageSize, setPageSize] = useState(20);
  const [marketTrend, setMarketTrend] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const [tradeDetails, setTradeDetails] = useState(null);

  // Debounce search symbol
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchSymbol(searchSymbol);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchSymbol]);

  // Get API endpoint based on selected strategy
  const getApiEndpoint = () => {
    switch (strategy) {
      case 'order-block':
        return 'ema-scalping/order-block-order/';
      case 'breakout':
        return 'ema-scalping/volume-spike-order/';
      case 'volume-spike':
      default:
        return 'ema-scalping/volume-spike-order/';
    }
  };

  // Fetch data based on selected strategy
  const fetchData = async (page = 1, size = pageSize) => {
    setLoading(true);

    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: size.toString()
    });

    // Add trade_type parameter for closed trades
    tradeType === 'closed' ? params.append('order_status', 'CLOSED') : params.append('order_status', 'OPEN');

    // Add date range filter
    if (dateRange === 'today') {
      params.append('date_range', 'today');
    } else if (dateRange === 'this_month') {
      params.append('date_range', 'this_month');
    } else if (dateRange === 'custom') {
      if (!startDate || !endDate) {
        showToast('Please select both start and end dates', 'warning');
        setLoading(false);
        return;
      }

      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date(getTodayDate());

      if (start > today || end > today) {
        showToast('Future dates are not allowed', 'warning');
        setLoading(false);
        return;
      }

      if (start > end) {
        showToast('Start date cannot be after end date', 'warning');
        setLoading(false);
        return;
      }

      params.append('date_range', 'custom');
      params.append('start_date', startDate);
      params.append('end_date', endDate);
    }

    // Add symbol filter if provided
    if (debouncedSearchSymbol.trim()) {
      params.append('symbol', debouncedSearchSymbol.trim());
    }
    if (strategy === 'breakout') {
      params.append('strategy_name', 'breakout');
    }
    if (strategy === 'volume-spike') {
      params.append('strategy_name', 'volume_spike');
    }
    // Get the appropriate API endpoint
    const apiEndpoint = getApiEndpoint();

    axiosInstance
      .get(`${baseUrl}${apiEndpoint}?${params.toString()}`)
      .then((res) => {
        if (res?.data?.data?.length === 0) {
          showToast(`No ${tradeType} ${strategy.replace('-', ' ')} data found`, 'info');
          setVolumeSpikeData([]);
          setPagination({
            totalPages: 1,
            currentPage: 1,
            pageSize: size,
            totalOrders: 0,
            hasNext: false,
            hasPrevious: false
          });
          return;
        }
        setVolumeSpikeData(res.data.data);
        setPagination({
          totalPages: res.data.pagination.total_pages,
          currentPage: res.data.pagination.current_page,
          pageSize: res.data.pagination.page_size,
          totalOrders: res.data.pagination.total_orders,
          hasNext: res.data.pagination.has_next,
          hasPrevious: res.data.pagination.has_previous
        });
        setPageSize(res.data.pagination.page_size);
      })
      .catch((error) => {
        showToast(error?.response?.data?.error || 'Something went wrong', 'error');
        console.log(error?.response?.data?.error || error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const fetchMarketTrend = async () => {
  //   axiosInstance
  //     .get(`${baseUrl}ema-scalping/getmarket?symbol=${debouncedSearchSymbol || 'BTCUSD'}`)
  //     .then((res) => {
  //       if (res?.data.length === 0) {
  //         return;
  //       }
  //       setMarketTrend(res.data);
  //     })
  //     .catch((error) => {
  //       console.log(error?.response?.data?.error || error.message);
  //     });
  // };

  // Fetch data when filters change
  useEffect(() => {
    fetchData(1);
  }, [dateRange, startDate, endDate, debouncedSearchSymbol, strategy]);



  const handleStrategyChange = (event) => {
    const value = event.target.value;
    setStrategy(value);
  };

  const handleDateRangeChange = (event) => {
    const value = event.target.value;
    setDateRange(value);

    if (value === 'today') {
      const today = getTodayDate();
      setStartDate(today);
      setEndDate(today);
    } else if (value === 'this_month') {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    } else if (value === 'custom') {
      // Set default to last 7 days for custom range
      const today = new Date(getTodayDate());
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today

      setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const handleStartDateChange = (event) => {
    const dateString = event.target.value;
    const selectedDate = new Date(dateString);
    const today = new Date(getTodayDate());

    if (selectedDate > today) {
      showToast('Start date cannot be in the future', 'warning');
    } else if (dateString > endDate) {
      showToast('Start date cannot be after end date', 'warning');
    } else {
      setStartDate(dateString);
    }
  };

  const handleEndDateChange = (event) => {
    const dateString = event.target.value;
    const selectedDate = new Date(dateString);
    const today = new Date(getTodayDate());

    if (selectedDate > today) {
      showToast('End date cannot be in the future', 'warning');
    } else if (dateString < startDate) {
      showToast('End date cannot be before start date', 'warning');
    } else {
      setEndDate(dateString);
    }
  };

  const handleRefresh = () => {
    fetchData();
    // fetchMarketTrend();
  };

  const handlePageChange = (event, value) => {
    fetchData(value);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    fetchData(1, newSize);
  };

  const handleSearchChange = (event) => {
    setSearchSymbol(event.target.value.toUpperCase());
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleViewClick = async (row) => {
    setOpenModal(true);
    setLoadingChart(true);
    setSelectedSymbol(row.symbol);
    setChartData(null);

    const IST_OFFSET = 5.5 * 60 * 60;

    const toIST = (dateString) => {
      if (!dateString) return null;
      return Math.floor(new Date(dateString).getTime() / 1000) + IST_OFFSET;
    };

    setHighlightedBlock({
      block_high: row.ob_high_price,
      block_low: row.ob_low_price,
      start_time: row.ob_start_time ? toIST(row.ob_start_time) * 1000 : null,
      end_time: row.ob_end_time ? toIST(row.ob_end_time) * 1000 : null
    });

    setTradeDetails({
      entryTime: row.entry_time ? new Date(toIST(row.entry_time) * 1000).toISOString() : null,
      exitTime: row.exit_time ? new Date(toIST(row.exit_time) * 1000).toISOString() : null,
      entryPrice: row.entry_price,
      exitPrice: row.exit_price,
      orderType: row.order_type
    });

    try {
      const response = await axiosInstance.post('https://scalping.tradeonair.com/api/ema-scalping/improved-smc-analysis/', {
        symbol: row.symbol,
        num_candles: 150
      });

      if (response.data.success) {
        const rawData = response.data.data;

        const candles = rawData.candles.map(c => ({
          time: toIST(c.x),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume
        }));

        const orderBlocks = (strategy === 'breakout' || strategy === 'volume-spike') ? [] : rawData.order_blocks.map(ob => ({
          start: ob.start,
          end: ob.end,
          startTime: toIST(ob.start),
          endTime: toIST(ob.end),
          high: ob.high,
          low: ob.low,
          type: ob.type,
          is_broken: ob.is_broken
        }));

        const bosMarkers = rawData.bos_points.map(bos => ({
          time: toIST(bos.x),
          price: bos.y,
          type: bos.type
        }));

        const chochMarkers = rawData.choch_points.map(choch => ({
          time: toIST(choch.x),
          price: choch.y,
          type: choch.type
        }));

        setChartData({
          candles,
          orderBlocks,
          bosMarkers,
          chochMarkers
        });
      } else {
        showToast('Failed to fetch chart data', 'error');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      showToast('Error fetching chart data', 'error');
    } finally {
      setLoadingChart(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setChartData(null);
  };

  const getPageTitle = () => {
    return tradeType === 'active' ? 'Active Trades' : 'Closed Trades';
  };

  const getStrategyDisplayName = () => {
    switch (strategy) {
      case 'volume-spike':
        return 'Volume-Spike';
      case 'breakout':
        return 'Breakout';
      case 'order-block':
        return 'OrderBlock';
      default:
        return 'Volume-Spike';
    }
  };

  const getOrderStatusColor = (status) => {
    if (!status) return 'default';
    switch (status.toUpperCase()) {
      case 'CLOSED':
        return 'success';
      case 'ACTIVE':
        return 'primary';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOrderStatusDisplay = (status) => {
    if (!status) return 'PENDING';
    return status.toUpperCase();
  };

  const formatPNL = (pnl) => {
    if (pnl === null || pnl === undefined || pnl === 'N/A') return 'N/A';
    const pnlValue = parseFloat(pnl);
    return `${pnlValue >= 0 ? '+' : ''}${pnlValue.toFixed(2)}`;
  };

  const getPNLColor = (pnl) => {
    if (pnl === null || pnl === undefined || pnl === 'N/A') return 'text.secondary';
    const pnlValue = parseFloat(pnl);
    return pnlValue >= 0 ? 'success.main' : 'error.main';
  };

  const calculateColSpan = () => {
    let baseColSpan = 15;
    if (strategy === 'order-block') {
      baseColSpan += 1;
    }
    if (strategy === 'breakout' || strategy === 'volume-spike') {
      baseColSpan += 1; // Added View column
    }
    if (tradeType === 'active') {
      baseColSpan -= 3;
    }

    return baseColSpan;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>{getPageTitle()}</h1>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search symbol..."
            value={searchSymbol}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={strategy} onChange={handleStrategyChange} displayEmpty>
              <MenuItem value="volume-spike">Volume-Spike</MenuItem>
              <MenuItem value="breakout">Breakout</MenuItem>
              <MenuItem value="order-block">OrderBlock</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={dateRange} onChange={handleDateRangeChange} displayEmpty>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="custom">Custom Date Range</MenuItem>
            </Select>
          </FormControl>

          {dateRange === 'custom' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <CustomDatePicker value={startDate} onChange={handleStartDateChange} size="small" sx={{ width: 150 }} />
              </Box>

              <Typography variant="body1" sx={{ mx: 1 }}>
                to
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <CustomDatePicker value={endDate} onChange={handleEndDateChange} size="small" sx={{ width: 150 }} />
              </Box>
            </Box>
          )}

          {dateRange === 'this_month' && (
            <Typography variant="body2" color="text.secondary">
              {startDate} to {endDate}
            </Typography>
          )}
        </Box>

        <Box>
          <Button onClick={handleRefresh} variant="contained" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Show active filters */}
      {/* <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Active filters:
          {` | Strategy: ${getStrategyDisplayName()}`}
          {dateRange === 'today' && ' | Today'}
          {dateRange === 'this_month' && ` | This month (${startDate} to ${endDate})`}
          {dateRange === 'custom' && ` | Custom range: ${startDate} to ${endDate}`}
          {debouncedSearchSymbol && ` | Symbol: ${debouncedSearchSymbol}`}
          {` | Trade Type: ${tradeType}`}
        </Typography>
      </Box> */}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '70vh',
          overflow: 'hidden',
          paddingTop: '10px'
        }}
      >
        <div
          style={{
            flexGrow: 1,
            overflow: 'auto',
            borderRadius: '8px'
          }}
        >
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
            {volumeSpikeData.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderBottom: '1px solid rgb(161, 153, 153)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Typography variant="subtitle1" fontWeight="600">
                  Total {getStrategyDisplayName()} Records: {pagination.totalOrders}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  Page: {pagination.currentPage} of {pagination.totalPages}
                </Typography>
              </Box>
            )}

            <Table sx={{ minWidth: 650 }} aria-label="volume spike table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Direction</TableCell>
                  {strategy !== 'order-block' && <TableCell sx={{ fontWeight: 600 }}>Volume</TableCell>}
                  {strategy === 'order-block' && (
                    <>
                      <TableCell sx={{ fontWeight: 600 }}>OB High</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>OB Low</TableCell>
                    </>
                  )}
                  <TableCell sx={{ fontWeight: 600 }}>Entry Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Target Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stop Loss</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Order Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Current Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{tradeType === 'closed' ? 'P&L' : 'Live P&L'}</TableCell>
                  {tradeType === 'closed' && (
                    <>
                      <TableCell sx={{ fontWeight: 600 }}>Exit Price</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Exit Time</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Exit Reason</TableCell>
                    </>
                  )}
                  {(strategy === 'order-block' || strategy === 'breakout' || strategy === 'volume-spike') && <TableCell sx={{ fontWeight: 600 }}>View</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={calculateColSpan()}
                      align="center"
                      sx={{
                        py: 8,
                        width: '100%',
                        textAlign: 'center'
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        Loading {getStrategyDisplayName()} data...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : volumeSpikeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={calculateColSpan()} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No {getStrategyDisplayName().toLowerCase()} {tradeType} data found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  volumeSpikeData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(0, 0, 0, 0.01)'
                        },
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell>{formatDateTime(row.entry_time)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={getStrategyDisplayName()}
                          color="primary"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {row.symbol}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor:
                              row.order_type?.toUpperCase() === 'BULLISH'
                                ? 'rgba(76, 175, 80, 0.1)'
                                : row.order_type?.toUpperCase() === 'BEARISH'
                                  ? 'rgba(244, 67, 54, 0.1)'
                                  : 'transparent'
                          }}
                        >
                          {row.order_type?.toUpperCase() === 'BULLISH' ? (
                            <TrendingUpIcon color="success" />
                          ) : row.order_type?.toUpperCase() === 'BEARISH' ? (
                            <TrendingDownIcon color="error" />
                          ) : (
                            <Typography variant="body2">-</Typography>
                          )}
                        </Box>
                      </TableCell>
                      {strategy !== 'order-block' && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="600">
                              {parseFloat(row.volume || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      {strategy === 'order-block' && (
                        <>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {row.ob_high_price || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {row.ob_low_price || 'N/A'}
                            </Typography>
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {row.entry_price || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="success.main">
                          {row.target_price || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600" color="error.main">
                          {row.stop_loss || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={getOrderStatusDisplay(row.order_status)}
                          color={getOrderStatusColor(row.order_status)}
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {row.current_price || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color={tradeType === 'closed' ? getPNLColor(row.pnl) : getPNLColor(row.live_pnl)}
                        >
                          {tradeType === 'closed' ? formatPNL(row.pnl) : formatPNL(row.live_pnl)}
                        </Typography>
                      </TableCell>
                      {tradeType === 'closed' && (
                        <>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {row.exit_price || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {formatDateTime(row.exit_time)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600">
                              {row.exit_reason || 'N/A'}
                            </Typography>
                          </TableCell>
                        </>
                      )}
                      {(strategy === 'order-block' || strategy === 'breakout' || strategy === 'volume-spike') && (
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewClick(row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {volumeSpikeData.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rows per page:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select value={pageSize} onChange={handlePageSizeChange} displayEmpty sx={{ height: 36 }}>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary">
                    {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1}-
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalOrders)} of{' '}
                    {pagination.totalOrders}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          </TableContainer>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {selectedSymbol} - {strategy === 'order-block' ? 'Order Block' : strategy === 'breakout' ? 'Breakout' : 'Volume Spike'} Analysis
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {loadingChart ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
              <Typography>Loading chart data...</Typography>
            </Box>
          ) : chartData ? (
            <Box sx={{ width: '100%', height: '100%', minHeight: 600 }}>
              <TradingViewChart
                data={chartData.candles}
                orderBlocks={chartData.orderBlocks}
                bosMarkers={chartData.bosMarkers}
                chochMarkers={chartData.chochMarkers}
                height={750}
                showBrokenBlocks={true}
                highlightedOrderBlock={highlightedBlock}
                tradeDetails={tradeDetails}
                strategy={strategy}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
              <Typography>No data available</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div >
  );
}

VolumeSpikeTradesPage.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default VolumeSpikeTradesPage;

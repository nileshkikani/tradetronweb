import Head from 'next/head';
import { useRouter } from 'next/router';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import {
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Switch,
  TablePagination,
  InputAdornment,
  Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axiosInstance from 'src/utils/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

function StrategyDetail() {
  const baseUrl = process.env.EMA_SCALPING_URL;
  const router = useRouter();
  const { name, filter, startDate, endDate } = router.query;

  const [isLiveTrade, setIsLiveTrade] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(filter || 'today');
  const [customStartDate, setCustomStartDate] = useState(startDate || '');
  const [customEndDate, setCustomEndDate] = useState(endDate || '');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total_orders: 0, total_profit: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'error'
  });

  // Define which columns to show in the main table
  const mainTableColumns = [
    // { key: 'id', label: 'ID', width: 80 },
    // { key: 'created_at', label: 'Created At', width: 180 },

    { key: 'entry_time', label: 'Entry Time', width: 180 },
    { key: 'symbol', label: 'Symbol', width: 120 },
    { key: 'order_type', label: 'Order Type', width: 120 },
    { key: 'entry_price', label: 'Entry Price', width: 120 },
    { key: 'exit_time', label: 'Exit Time', width: 180 },
    { key: 'position_size', label: 'Position Size', width: 120 },
    { key: 'stop_loss', label: 'Stop Loss', width: 120 },
    { key: 'risk_reward_ratio', label: 'Risk/Reward Ratio', width: 120 },
    { key: 'target_price', label: 'Target Price', width: 120 },
    { key: 'exit_price', label: 'Exit Price', width: 120 },
    { key: 'pnl', label: 'PNL', width: 120 },
    { key: 'order_status', label: 'Status', width: 120 },
    { key: 'exit_reason', label: 'Exit Reason', width: 150 },
    // { key: 'details', label: 'Details', width: 100 }
  ];

  const handleBack = () => {
    router.push('/dashboards/stock-reports');
  };

  const showToast = (message, type = 'error') => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: '', type: 'error' });
    }, 3000);
  };

  const validateDates = () => {
    if (selectedDateRange === 'custom') {
      if (!customStartDate || !customEndDate) {
        showToast('Please select both start and end dates', 'error');
        return false;
      }

      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const today = new Date();

      if (start > end) {
        showToast('Start date cannot be greater than end date', 'error');
        return false;
      }

      if (start > today || end > today) {
        showToast('Future dates are not allowed', 'error');
        return false;
      }
    }
    return true;
  };

  const buildQueryParams = (page, size) => {
    const params = new URLSearchParams();

    if (name) params.append('strategy_name', name);

    // Add search term if it exists
    if (searchTerm.trim()) {
      params.append('symbol', searchTerm.trim());
    }

    if (selectedDateRange === 'custom') {
      if (customStartDate) params.append('start_date', customStartDate);
      if (customEndDate) params.append('end_date', customEndDate);
      params.append('date_range', selectedDateRange);
    } else {
      params.append('date_range', selectedDateRange);
    }

    params.append('page', page + 1);
    params.append('page_size', size);

    return params.toString();
  };

  const fetchOrders = async (page = 0, size = pageSize) => {
    if (selectedDateRange === 'custom' && !validateDates()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = buildQueryParams(page, size);
      let url = `${baseUrl}ema-scalping/volume-details`;

      const response = await axiosInstance.get(`${url}/?${queryParams}`);
      const data = response.data; // Access the nested data object
      setOrders(data.data || []);
      setSummary(data.summary || { total_orders: 0, total_profit: 0 });
      setTotalOrders(data.pagination?.total_trade_entries || 0);
      setCurrentPage(page);
      setPageSize(size);
      
      // Reset expanded rows when new data is fetched
      setExpandedRows({});
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Add debounce for search
  useEffect(() => {
    if (name && router.isReady) {
      const timer = setTimeout(() => {
        fetchOrders(0, pageSize);
      }, 500); // 500ms debounce delay

      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (name && router.isReady && selectedDateRange !== 'custom') {
      fetchOrders(0, pageSize);
    }
  }, [selectedDateRange]);

  useEffect(() => {
    if (name && router.isReady) {
      if (selectedDateRange === 'custom') {
        if (customStartDate && customEndDate) {
          fetchOrders(0, pageSize);
        }
      } else {
        fetchOrders(0, pageSize);
      }
    }
  }, [name, isLiveTrade, router.isReady]);

  const handlePageChange = (event, newPage) => {
    fetchOrders(newPage, pageSize);
  };

  const handleRowsPerPageChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    fetchOrders(0, newPageSize);
  };

  const handleFilterClick = () => {
    fetchOrders(0, pageSize);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when search changes
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchOrders(0, pageSize);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CLOSED':
        return 'success';
      case 'OPEN':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getOrderTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'BULLISH':
        return 'success';
      case 'BEARISH':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPnlColor = (pnl) => {
    return pnl >= 0 ? 'success' : 'error';
  };

  // Get all field names from the first order to display all fields in expanded view
  const getAllFieldNames = () => {
    if (orders.length === 0) return [];
    const firstOrder = orders[0];
    return Object.keys(firstOrder).sort();
  };

  const isCustomInvalid = selectedDateRange === 'custom' && (!customStartDate || !customEndDate);

  return (
    <>
      <Head>
        <title>Strategy Details - {name}</title>
      </Head>
      <Box sx={{ padding: '32px 25px 0px' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Reports
        </Button>
      </Box>
      <h1 style={{ margin: '23px 38px 26px 21px' }}>Strategy: {name || 'Loading...'}</h1>

      {toast.open && (
        <Box sx={{ padding: '0 25px 16px' }}>
          <Alert severity={toast.type} onClose={() => setToast({ ...toast, open: false })}>
            {toast.message}
          </Alert>
        </Box>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'calc(100% - 50px)',
          padding: '16px',
          borderRadius: '8px',
          paddingBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap'
          }}
        >
          {/* Search Input */}
          <TextField
            placeholder="Search Symbols..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            style={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <ClearIcon onClick={handleClearSearch} style={{ cursor: 'pointer' }} />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            style={{ minWidth: 200 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="this_year">This Year</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>

          {selectedDateRange === 'custom' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                error={
                  (customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate)) ||
                  (customStartDate && new Date(customStartDate) > new Date())
                }
                helperText={
                  customStartDate && new Date(customStartDate) > new Date()
                    ? 'Start date cannot be in the future'
                    : customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate)
                    ? 'Start date cannot be greater than end date'
                    : ''
                }
              />

              <TextField
                label="End Date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0]
                }}
                error={
                  (customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate)) ||
                  (customEndDate && new Date(customEndDate) > new Date())
                }
                helperText={
                  customEndDate && new Date(customEndDate) > new Date()
                    ? 'End date cannot be in the future'
                    : customStartDate && customEndDate && new Date(customStartDate) > new Date(customEndDate)
                    ? 'End date cannot be less than start date'
                    : ''
                }
              />

              <Button
                onClick={handleFilterClick}
                variant="contained"
                style={{ width: '150px', height: '44px' }}
                disabled={loading || isCustomInvalid}
              >
                {loading ? <CircularProgress size={24} /> : 'Filter'}
              </Button>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Showing {orders.length} of {totalOrders} trades
          </Typography>
        </div>
      </div>

      {!loading && orders.length > 0 && (
        <div style={{ padding: '0 25px 16px' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              padding: '16px',
              borderRadius: '8px',
              flexWrap: 'wrap'
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Total Trades: {summary.total_orders || totalOrders}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Page {currentPage + 1} of { Math.ceil(totalOrders / pageSize)}
              </Typography>
            </Box>
          </Box>
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ margin: '0 25px 16px' }}>
          {error}
        </Alert>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 25px 25px'
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
            <Table sx={{ minWidth: 1200 }} aria-label="order table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                  {mainTableColumns.map((column) => (
                    <TableCell 
                      key={column.key} 
                      sx={{ 
                        fontWeight: 600,
                        width: column.width,
                        minWidth: column.width
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={mainTableColumns.length} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (
                    <>
                      <TableRow key={order.id}>
                        {/* <TableCell>{index + 1}</TableCell> */}
                        {/* <TableCell>{formatDateTime(order.created_at)}</TableCell> */}
                        <TableCell>{formatDateTime(order.entry_time)}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {order.symbol}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.order_type} 
                            size="small" 
                            color={getOrderTypeColor(order.order_type)}
                          />
                        </TableCell>
                        <TableCell>{order.entry_price?.toFixed(2)}</TableCell>
                        <TableCell>{formatDateTime(order.exit_time)}</TableCell>
                        <TableCell>{order.position_size}</TableCell>
                        <TableCell>{order.risk_reward_ratio?.toFixed(2)}</TableCell>
                        <TableCell>{order.stop_loss?.toFixed(2)}</TableCell>
                        <TableCell>{order.target_price?.toFixed(2)}</TableCell>
                        <TableCell>{order.exit_price?.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.pnl?.toFixed(3)} 
                            size="small" 
                            color={getPnlColor(order.pnl)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.order_status} 
                            size="small" 
                            color={getStatusColor(order.order_status)}
                          />
                        </TableCell>
                        <TableCell>{order.exit_reason || '-'}</TableCell>
                        {/* <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => toggleRowExpansion(order.id)}
                          >
                            {expandedRows[order.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                      
                      {/* Expanded row for all fields */}
                      {/* <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={mainTableColumns.length}>
                          <Collapse in={expandedRows[order.id]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1, padding: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                              <Typography variant="h6" gutterBottom component="div">
                                Complete Order Details
                              </Typography>
                              <Table size="small" aria-label="all-fields-table">
                                <TableBody>
                                  {getAllFieldNames().map((fieldName) => {
                                    if (!mainTableColumns.find(col => col.key === fieldName)) {
                                      return (
                                        <TableRow key={fieldName}>
                                          <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                            {fieldName.replace(/_/g, ' ').toUpperCase()}
                                          </TableCell>
                                          <TableCell>
                                            {fieldName.includes('time') || fieldName.includes('date') || fieldName.includes('at')
                                              ? formatDateTime(order[fieldName])
                                              : typeof order[fieldName] === 'number'
                                              ? order[fieldName].toFixed(3)
                                              : order[fieldName] || '-'}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                    return null;
                                  })}
                                  
                              
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                      RISK
                                    </TableCell>
                                    <TableCell>
                                      {order.entry_price && order.stop_loss 
                                        ? Math.abs(order.entry_price - order.stop_loss).toFixed(3)
                                        : '-'}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                      REWARD
                                    </TableCell>
                                    <TableCell>
                                      {order.target_price && order.entry_price 
                                        ? Math.abs(order.target_price - order.entry_price).toFixed(3)
                                        : '-'}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                                      DURATION (MINUTES)
                                    </TableCell>
                                    <TableCell>
                                      {order.entry_time && order.exit_time
                                        ? Math.round((new Date(order.exit_time) - new Date(order.entry_time)) / (1000 * 60))
                                        : '-'} mins
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow> */}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={mainTableColumns.length} align="center">
                      <Typography sx={{ padding: '20px' }}>
                        No orders found{searchTerm ? ` for "${searchTerm}"` : ''}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {orders.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50]}
            component="div"
            count={totalOrders}
            rowsPerPage={pageSize}
            page={currentPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{ marginTop: 2 }}
          />
        )}
      </div>
    </>
  );
}

StrategyDetail.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default StrategyDetail;
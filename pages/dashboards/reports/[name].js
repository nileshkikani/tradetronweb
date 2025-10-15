import Head from "next/head";
import { useRouter } from "next/router";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";

import {
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Skeleton,
  Alert,
  Switch,
  TablePagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function StrategyDetail() {
  const baseUrl = process.env.EMA_SCALPING_URL;
  const router = useRouter();
  const { name, filter, startDate, endDate } = router.query;

  const [isLiveTrade, setIsLiveTrade] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("ALL");
  const [selectedDateRange, setSelectedDateRange] = useState(filter || "today");
  const [customStartDate, setCustomStartDate] = useState(startDate || "");
  const [customEndDate, setCustomEndDate] = useState(endDate || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ total_orders: 0, total_profit: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "error",
  });

  const handleBack = () => {
    router.push("/dashboards/reports");
  };

  const showToast = (message, type = "error") => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: "", type: "error" });
    }, 3000);
  };

  const validateDates = () => {
    if (selectedDateRange === "custom") {
      if (!customStartDate || !customEndDate) {
        showToast("Please select both start and end dates", "error");
        return false;
      }

      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      const today = new Date();

      if (start > end) {
        showToast("Start date cannot be greater than end date", "error");
        return false;
      }

      if (start > today || end > today) {
        showToast("Future dates are not allowed", "error");
        return false;
      }
    }
    return true;
  };

  const buildQueryParams = (page, size) => {
    const params = new URLSearchParams();

    if (name) params.append("strategy_name", name);
    if (selectedIndex && selectedIndex !== "ALL") {
      params.append("index_name", selectedIndex);
    }

    params.append("trade_type", isLiveTrade ? "live_trade" : "paper_trade");

    if (selectedDateRange === "custom") {
      if (customStartDate) params.append("start_date", customStartDate);
      if (customEndDate) params.append("end_date", customEndDate);
      params.append("date_range", selectedDateRange);
    } else {
      params.append("date_range", selectedDateRange);
    }

    params.append("page", page + 1);
    params.append("page_size", size);

    return params.toString();
  };

  const fetchOrders = async (page = 0, size = pageSize) => {
    if (selectedDateRange === "custom" && !validateDates()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const queryParams = buildQueryParams(page, size);
      let url = `${baseUrl}paper_trade/strategy-details`;

      const response = await axios.get(`${url}/?${queryParams}`);

      const data = response.data;
      setOrders(data.orders || []);
      setSummary(data.summary || { total_orders: 0, total_profit: 0 });
      setTotalOrders(data.pagination?.total_orders || 0);
      setCurrentPage(page);
      setPageSize(size);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name && router.isReady && selectedDateRange !== "custom") {
      fetchOrders(0, pageSize);
    }
  }, [selectedDateRange]);

  useEffect(() => {
    if (name && router.isReady) {
      if (selectedDateRange === "custom") {
        if (customStartDate && customEndDate) {
          fetchOrders(0, pageSize);
        }
      } else {
        fetchOrders(0, pageSize);
      }
    }
  }, [name, selectedIndex, isLiveTrade, router.isReady]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isCustomInvalid =
    selectedDateRange === "custom" && (!customStartDate || !customEndDate);

  return (
    <>
      <Head>
        <title>Strategy Details - {name}</title>
      </Head>
      <Box sx={{ padding: "32px 25px 0px" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Reports
        </Button>
      </Box>
      <h1 style={{ margin: "23px 38px 26px 21px" }}>Reports Detail</h1>

      {toast.open && (
        <Box sx={{ padding: "0 25px 16px" }}>
          <Alert
            severity={toast.type}
            onClose={() => setToast({ ...toast, open: false })}
          >
            {toast.message}
          </Alert>
        </Box>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "calc(100% - 50px)",
          padding: "16px",
          borderRadius: "8px",
          paddingBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <Select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(e.target.value)}
            labelId="index-label"
            style={{ minWidth: 150 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="NIFTY">NIFTY</MenuItem>
            <MenuItem value="BANKNIFTY">BANKNIFTY</MenuItem>
            <MenuItem value="SENSEX">SENSEX</MenuItem>
            <MenuItem value="CRUDEOIL">CRUDEOIL</MenuItem>
            <MenuItem value="GOLD">GOLD</MenuItem>
          </Select>

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

          {selectedDateRange === "custom" && (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                error={
                  (customStartDate &&
                    customEndDate &&
                    new Date(customStartDate) > new Date(customEndDate)) ||
                  (customStartDate && new Date(customStartDate) > new Date())
                }
                helperText={
                  customStartDate && new Date(customStartDate) > new Date()
                    ? "Start date cannot be in the future"
                    : customStartDate &&
                      customEndDate &&
                      new Date(customStartDate) > new Date(customEndDate)
                    ? "Start date cannot be greater than end date"
                    : ""
                }
              />

              <TextField
                label="End Date"
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                error={
                  (customStartDate &&
                    customEndDate &&
                    new Date(customStartDate) > new Date(customEndDate)) ||
                  (customEndDate && new Date(customEndDate) > new Date())
                }
                helperText={
                  customEndDate && new Date(customEndDate) > new Date()
                    ? "End date cannot be in the future"
                    : customStartDate &&
                      customEndDate &&
                      new Date(customStartDate) > new Date(customEndDate)
                    ? "End date cannot be less than start date"
                    : ""
                }
              />

              <Button
                onClick={handleFilterClick}
                variant="contained"
                style={{ width: "150px", height: "44px" }}
                disabled={loading || isCustomInvalid}
              >
                {loading ? <CircularProgress size={24} /> : "Filter"}
              </Button>
            </>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {isLiveTrade ? "Live Trade" : "Paper Trade"}
          </Typography>
          <Switch
            checked={isLiveTrade}
            onChange={(e) => setIsLiveTrade(e.target.checked)}
            color="primary"
          />
        </div>
      </div>

      {!loading && (
        <div style={{ padding: "0 25px 16px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              padding: "16px",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="body2">
                Total Orders : {summary.total_orders}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
              }}
            >
              Total Profit : &nbsp;&nbsp;
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: summary.total_profit >= 0 ? "green" : "red",
                }}
              >
                {summary.total_profit}
              </Typography>
            </Box>
          </Box>
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ margin: "0 25px 16px" }}>
          {error}
        </Alert>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 25px 25px",
        }}
      >
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: "8px",
          }}
        >
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "8px", overflow: "hidden" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="order table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Entry Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Close Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Profit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Option Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>In Market</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>{order.order_type}</TableCell>
                      <TableCell>{order.open_price}</TableCell>
                      <TableCell>{order.close_price}</TableCell>
                      <TableCell
                        sx={{
                          color: order.profit >= 0 ? "green" : "red",
                          fontWeight: 500,
                        }}
                      >
                        {order.profit}
                      </TableCell>
                      <TableCell>{order.symbol}</TableCell>
                      <TableCell>{order.index_name}</TableCell>
                      <TableCell>{order.order_status}</TableCell>
                      <TableCell>{order.strategy_name}</TableCell>
                      <TableCell>{order.in_market ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <Typography sx={{ padding: "20px" }}>
                        No orders found
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

import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import {
  Button,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Box,
  Typography,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axiosInstance from "src/utils/axios";
import useToast from "src/hooks/useToast";
import CustomDatePicker from "src/components/DatePicker";
import MarketTrendCard from "src/components/MarketTrendCard";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function VolumeSpikePage() {
  const baseUrl = process.env.EMA_SCALPING_URL;
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSD");

  const [volumeSpikeData, setVolumeSpikeData] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    pageSize: 20,
    totalOrders: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [pageSize, setPageSize] = useState(20);

  const fetchVolumeSpikes = async (page = 1, size = pageSize) => {
    axiosInstance
      .get(
        // `${baseUrl}ema-scalping/crypto_trade/getorder?symbol=${selectedSymbol}&date=${selectedDate}`
        `${baseUrl}ema-scalping/volume-spike-order/?page=${page}&page_size=${size}`
      )
      .then((res) => {
        if (res?.data?.data?.length === 0) {
          showToast("No volume spikes found", "info");
          setVolumeSpikeData([]);
          setPagination({
            totalPages: 1,
            currentPage: 1,
            pageSize: size,
            totalOrders: 0,
            hasNext: false,
            hasPrevious: false,
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
          hasPrevious: res.data.pagination.has_previous,
        });
        setPageSize(res.data.pagination.page_size);
      })
      .catch((error) => {
        showToast(
          error?.response?.data?.error || "Something went wrong",
          "error"
        );
        console.log(error?.response?.data?.error || error.message);
      });
  };

  const [marketTrend, setMarketTrend] = useState([]);

  const fetchMarketTrend = async () => {
    axiosInstance
      .get(`${baseUrl}ema-scalping/getmarket?symbol=${selectedSymbol}`)
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No orders found", "info");
          setVolumeSpikeData([]);
          return;
        }
        setMarketTrend(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        showToast(
          error?.response?.data?.error || "Something went wrong",
          "error"
        );
        console.log(error?.response?.data?.error || error.message);
      });
  };

  useEffect(() => {
    fetchVolumeSpikes();
    fetchMarketTrend();
  }, [selectedSymbol, selectedDate]);

  // const handleDateChange = (event) => {
  //   const dateString = event.target.value;
  //   console.log(dateString);
  //   setSelectedDate(dateString);
  // };

  const handleDateChange = (event) => {
    const dateString = event.target.value;
    const selectedDate = new Date(dateString);
    const today = new Date();

    if (selectedDate > today) {
      showToast("Future dates are not allowed", "warning");
    } else {
      // console.log(dateString);
      setSelectedDate(dateString);
    }
  };

  const handlePreviousDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    const newDate = date.toISOString().split("T")[0];
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    const newDate = date.toISOString().split("T")[0];

    // Don't allow selecting future dates
    const today = new Date(getTodayDate());
    if (date <= today) {
      setSelectedDate(newDate);
    } else {
      showToast("Cannot select future dates", "warning");
    }
  };

  const handleRefresh = () => {
    fetchVolumeSpikes();
    fetchMarketTrend();
  };

  const handlePageChange = (event, value) => {
    fetchVolumeSpikes(value);
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    setPageSize(newSize);
    fetchVolumeSpikes(1, newSize);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Calculate the price difference from spike close to target
  const calculatePotentialGain = (spikeClose, targetPrice) => {
    if (!spikeClose || !targetPrice) return "N/A";
    const close = parseFloat(spikeClose);
    const target = parseFloat(targetPrice);
    const difference = target - close;
    const percentage = ((difference / close) * 100).toFixed(2);
    return `${difference.toFixed(2)} (${percentage}%)`;
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>Volume Spike </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: "10px",
          }}
        >
          <Select
            labelId="my-strategies-label"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            displayEmpty
            style={{ minWidth: 200 }}
          >
            <MenuItem value="BTCUSD">BTCUSD</MenuItem>
            <MenuItem value="ETHUSD">ETHUSD</MenuItem>
          </Select>
          <Button
            onClick={handleRefresh}
            variant="contained"
            style={{ marginLeft: 6 }}
          >
            Refresh
          </Button>
        </div> */}
        {/* <CustomDatePicker value={selectedDate} onChange={handleDateChange} /> */}
        {/* <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton onClick={handlePreviousDay} color="primary">
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          <CustomDatePicker value={selectedDate} onChange={handleDateChange} />

          <IconButton
            onClick={handleNextDay}
            color="primary"
            style={{ marginLeft: "8px" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div> */}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "70vh",
          overflow: "hidden",
          paddingTop: "10px",
        }}
      >
        {/* <MarketTrendCard marketData={marketTrend}></MarketTrendCard> */}
        <div
          style={{
            flexGrow: 1,
            overflow: "auto",
            borderRadius: "8px",
            paddingTop: "25px",
          }}
        >
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ borderRadius: "8px", overflow: "hidden" }}
          >
            {volumeSpikeData.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 24px",
                  borderBottom: "1px solid rgb(161, 153, 153)",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                }}
              >
                <Typography variant="subtitle1" fontWeight="600">
                  Total Records: {pagination.totalOrders}
                </Typography>
                <Typography variant="subtitle1" fontWeight="600">
                  Page: {pagination.currentPage} of {pagination.totalPages}
                </Typography>
              </Box>
            )}

            <Table sx={{ minWidth: 650 }} aria-label="volume spike table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Direction</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Volume</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Spike Close</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Target Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Stop Loss</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Potential Gain</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Spike Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {volumeSpikeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No volume spike data found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  volumeSpikeData.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.01)",
                        },
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>{formatDateTime(row.created_at)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={row.breakout_strategy}
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
                        <Chip
                          size="small"
                          label={row.direction}
                          color={
                            row.direction?.toUpperCase() === "BULLISH"
                              ? "success"
                              : row.direction?.toUpperCase() === "BEARISH"
                              ? "error"
                              : "default"
                          }
                          sx={{
                            fontWeight: 600,
                            backgroundColor:
                              row.direction?.toUpperCase() === "BULLISH"
                                ? "rgba(76, 175, 80, 0.1)"
                                : row.direction?.toUpperCase() === "BEARISH"
                                ? "rgba(244, 67, 54, 0.1)"
                                : "transparent",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" fontWeight="600">
                            {parseFloat(row.volume).toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {row.spike_close}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="success.main"
                        >
                          {row.target_price}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color="error.main"
                        >
                          {row.stop_loss}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          sx={{
                            color: (theme) => {
                              const gain = calculatePotentialGain(
                                row.spike_close,
                                row.target_price
                              );
                              if (gain === "N/A")
                                return theme.palette.text.secondary;
                              return gain.includes("(-")
                                ? theme.palette.error.main
                                : theme.palette.success.main;
                            },
                          }}
                        >
                          {calculatePotentialGain(
                            row.spike_close,
                            row.target_price
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatTime(row.date_time)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {volumeSpikeData.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rows per page:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      displayEmpty
                      sx={{ height: 36 }}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary">
                    {pagination.currentPage * pagination.pageSize -
                      pagination.pageSize +
                      1}
                    -
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalOrders
                    )}{" "}
                    of {pagination.totalOrders}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="medium"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

VolumeSpikePage.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default VolumeSpikePage;
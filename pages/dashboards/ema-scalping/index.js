import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import DashboardExistingBrokersContent from "../../../src/content/DashboardPages/existing-brokers/index";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import {
  Button,
  ListItem,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import TradingViewChart from "src/components/TradingViewChart";

import useToast from "src/hooks/useToast";
import CustomDatePicker from "src/components/DatePicker";
import MarketTrendCard from "src/components/MarketTrendCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ClearIcon from "@mui/icons-material/Clear";
import Footer from "src/components/Footer";
import Paper from "@mui/material/Paper";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function DashboardReports() {
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
  const [selectedSymbol, setSelectedSymbol] = useState("NIFTY");
  const [orderData, setOrderData] = useState([]);
  const [daywisePnL, setDaywisePnL] = useState({});
  const [calendarMonthYear, setCalendarMonthYear] = useState(new Date());
  
  // Chart modal states
  const [openModal, setOpenModal] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [selectedChartSymbol, setSelectedChartSymbol] = useState("");
  const [tradeDetails, setTradeDetails] = useState(null);

  const fetchOrder = async () => {
    axiosInstance
      .get(
        `${baseUrl}ema-scalping/getorder?symbol=${selectedSymbol}&date=${selectedDate}`
      )
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No orders found", "info");
          setOrderData([]);
          return;
        }
        setOrderData(res.data);
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
      .get(
        `${baseUrl}ema-scalping/getmarket?symbol=${selectedSymbol}`
      )
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No market data found", "info");
          setMarketTrend([]);
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

  const fetchDaywisePnL = async (month, year) => {
    try {
      const startDate = new Date(year, month - 2, 1);
      startDate.setDate(startDate.getDate() - startDate.getDay());

      const endDate = new Date(year, month + 1, 0);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      const response = await axiosInstance.get(
        `${baseUrl}ema-scalping/daywise-pnl/`,
        {
          params: {
            index_name: selectedSymbol,
            start_date: formattedStart,
            end_date: formattedEnd,
          },
        }
      );

      const pnlMap = {};
      if (response.data.daywise_pnl) {
        response.data.daywise_pnl.forEach((item) => {
          pnlMap[item.date] = item.total_pnl;
        });
      }
      setDaywisePnL(pnlMap);
    } catch (error) {
      console.log("Error fetching daywise PnL:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchMarketTrend();
  }, [selectedSymbol, selectedDate]);

  useEffect(() => {
    const month = calendarMonthYear.getMonth() + 1;
    const year = calendarMonthYear.getFullYear();
    fetchDaywisePnL(month, year);
  }, [calendarMonthYear, selectedSymbol]);

  const handleDateChange = (date) => {
    if (!date) return;

    const today = new Date();

    if (date > today) {
      showToast("Future dates are not allowed", "warning");
      return;
    }

    const day = date.getDay();
    let selectedDate = new Date(date);

    if (day === 6) {
      selectedDate.setDate(selectedDate.getDate() + 2);
    } else if (day === 0) {
      selectedDate.setDate(selectedDate.getDate() + 1);
    }

    const adjustedDate = selectedDate.toISOString().split("T")[0];

    setSelectedDate(adjustedDate);
  };

  const handlePreviousDay = () => {
    let date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);

    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() - 1);
    }

    const newDate = date.toISOString().split("T")[0];
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    let date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);

    while (date.getDay() === 0 || date.getDay() === 6) {
      date.setDate(date.getDate() + 1);
    }

    const today = new Date(getTodayDate());

    if (date <= today) {
      const newDate = date.toISOString().split("T")[0];
      setSelectedDate(newDate);
    } else {
      showToast("Cannot select future dates", "warning");
    }
  };

  const handleRefesh = () => {
    fetchOrder();
    fetchMarketTrend();
  };

  const getPLData = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;
    return daywisePnL[key] || null;
  };

  const handleMonthChange = (date) => {
    setCalendarMonthYear(date);
  };

  const handleViewClick = async (symbol, orderRow) => {
    setOpenModal(true);
    setLoadingChart(true);
    setSelectedChartSymbol(symbol);
    setChartData(null);
    setTradeDetails(null);

    const IST_OFFSET = 5.5 * 60 * 60;

    // For candle data timestamps (UTC) - add IST offset
    const toIST = (dateString) => {
      if (!dateString) return null;
      return Math.floor(new Date(dateString).getTime() / 1000) + IST_OFFSET;
    };

    // For order timestamps (already in IST) - convert directly AND add offset to match candle face value
    const toUnixTimestampWithOffset = (dateString) => {
      if (!dateString) return null;
      // Get real UTC timestamp
      const realUtc = Math.floor(new Date(dateString).getTime() / 1000);
      // Add IST offset to match the "Face Value" timestamps used by candles
      return realUtc + IST_OFFSET;
    };

    // Set trade details for the specific order only
    if (orderRow) {
      const tradeDetail = {
        entryTime: orderRow.created_at ? new Date(toUnixTimestampWithOffset(orderRow.created_at) * 1000).toISOString() : null,
        exitTime: orderRow.updated_at && orderRow.index_close_price ? new Date(toUnixTimestampWithOffset(orderRow.updated_at) * 1000).toISOString() : null,
        entryPrice: null, // Let chart determine price from candle data
        exitPrice: null, // Let chart determine price from candle data
        orderType: orderRow.order_type,
      };
      
      setTradeDetails(tradeDetail);
    }

    try {
      const response = await axiosInstance.post(
        `${baseUrl}ema-scalping/get-index-candles/`,
        {
          symbol: symbol,
          num_candles: 400,
        }
      );

      if (response.data.success) {
        const rawData = response.data.data;

        const candles = rawData.map((c) => ({
          time: toIST(c.x),
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume,
        }));

        setChartData({
          candles,
          orderBlocks: [],
          bosMarkers: [],
          chochMarkers: [],
        });
      } else {
        showToast("Failed to fetch chart data", "error");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      showToast("Error fetching chart data", "error");
    } finally {
      setLoadingChart(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setChartData(null);
    setTradeDetails(null);
  };

  return (
    <>
      <h1 style={{ margin: "32px 25px 16px" }}>EMA Scalping</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "calc(100% - 50px)",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Select
            labelId="my-strategies-label"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            displayEmpty
            style={{ minWidth: 200 }}
          >
            <MenuItem value="NIFTY">NIFTY</MenuItem>
            <MenuItem value="BANKNIFTY">BANKNIFTY</MenuItem>
            <MenuItem value="SENSEX">SENSEX</MenuItem>
            <MenuItem value="CRUDEOIL">CRUDEOIL</MenuItem>
            <MenuItem value="GOLD">GOLD</MenuItem>
          </Select>
          <Button
            onClick={handleRefesh}
            variant="contained"
            style={{ marginLeft: 8 }}
          >
            Refresh
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handlePreviousDay}
            color="primary"
            style={{ marginRight: "6px" }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          <DatePicker
            toggleCalendarOnIconClick
            selected={selectedDate ? new Date(selectedDate) : null}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            customInput={
              <div
                style={{
                  border: "1px solid #44a574",
                  borderRadius: "8px",
                  padding: "15px",
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  minWidth: "140px",
                  transition: "all 0.2s ease",
                  width: "250px",
                }}
              >
                <span>
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Select Date"}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginLeft: "8px", opacity: 0.7 }}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            }
            renderDayContents={(day, d) => {
              const pnl = getPLData(d);
              const isCurrentMonth =
                d.getMonth() === calendarMonthYear.getMonth();

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                    fontSize: "12px",
                    width: "100%",
                    height: "70px",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: 600 }}>
                    {day}
                  </span>
                  {pnl !== null && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: pnl >= 0 ? "#4caf50" : "#f44336",
                        }}
                      >
                        {pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              );
            }}
          />

          <IconButton
            onClick={handleNextDay}
            color="primary"
            style={{ marginLeft: "8px" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "70vh",
          padding: "0 25px 25px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <MarketTrendCard marketData={marketTrend} />
        </div>

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
            {orderData.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "12px 24px",
                  borderBottom: "1px solid rgb(161, 153, 153)",
                }}
              >
                <Typography variant="subtitle1" fontWeight="600">
                  Total P/L:
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      color: (theme) => {
                        const totalPL = orderData.reduce(
                          (total, row) =>
                            total + (parseFloat(row?.profit) || 0),
                          0
                        );
                        return totalPL >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main;
                      },
                    }}
                  >
                    {orderData
                      .reduce(
                        (total, row) => total + (parseFloat(row?.profit) || 0),
                        0
                      )
                      .toFixed(2)}
                  </Box>
                </Typography>
              </Box>
            )}
            <Table sx={{ minWidth: 650 }} aria-label="order table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Order Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Entry Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Close Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Profit</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Lot Size</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Option Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>In Market</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.map((row) => (
                  <TableRow
                    key={row.uuid}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0, 0, 0, 0.01)",
                      },
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      {new Date(row?.created_at).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                    <TableCell
                      sx={{
                        color:
                          row?.order_type?.toLowerCase() === "buy"
                            ? "success.main"
                            : row?.order_type?.toLowerCase() === "sell"
                            ? "error.main"
                            : "inherit",
                      }}
                    >
                      {row?.order_type}
                    </TableCell>
                    <TableCell>{row?.open_price}</TableCell>
                    <TableCell>{row?.close_price}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          parseFloat(row?.profit) > 0
                            ? "success.main"
                            : parseFloat(row?.profit) < 0
                            ? "error.main"
                            : "inherit",
                        fontWeight: 500,
                      }}
                    >
                      {row?.profit}
                    </TableCell>
                    <TableCell>{row?.symbol}</TableCell>
                    <TableCell>{row?.lots}</TableCell>
                    <TableCell>{row?.symbol?.slice(-2)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row?.order_status}
                        color={
                          row?.order_status?.toLowerCase() === "completed"
                            ? "success"
                            : row?.order_status?.toLowerCase() === "pending"
                            ? "warning"
                            : row?.order_status?.toLowerCase() === "cancelled"
                            ? "error"
                            : "default"
                        }
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>{row?.strategy_name}</TableCell>
                    <TableCell>
                      {row?.in_market ? (
                        <CurrencyRupeeIcon
                          color="success"
                          sx={{ fontSize: "1.1rem" }}
                        />
                      ) : (
                        <ClearIcon color="error" sx={{ fontSize: "1.1rem" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {["NIFTY", "BANKNIFTY", "SENSEX"].includes(selectedSymbol) ? (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewClick(selectedSymbol, row)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" color="text.disabled">
                          -
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            minHeight: "80vh",
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {selectedChartSymbol} - Candlestick Chart
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
        <DialogContent
          dividers
          sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}
        >
          {loadingChart ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: 400,
              }}
            >
              <Typography>Loading chart data...</Typography>
            </Box>
          ) : chartData ? (
            <Box sx={{ width: "100%", height: "100%", minHeight: 600 }}>
              <TradingViewChart
                data={chartData.candles}
                orderBlocks={chartData.orderBlocks}
                bosMarkers={chartData.bosMarkers}
                chochMarkers={chartData.chochMarkers}
                height={750}
                showBrokenBlocks={false}
                strategy="index"
                tradeDetails={tradeDetails}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: 400,
              }}
            >
              <Typography>No data available</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

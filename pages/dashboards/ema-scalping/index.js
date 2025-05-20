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
} from "@mui/material";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import useToast from "src/hooks/useToast";
import CustomDatePicker from "src/components/DatePicker";
import MarketTrendCard from "src/components/MarketTrendCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ClearIcon from "@mui/icons-material/Clear";
import Footer from "src/components/Footer";
import Paper from "@mui/material/Paper";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  const fetchOrder = async () => {
    axios
      .get(
        `${baseUrl}paper_trade/getorder?symbol=${selectedSymbol}&date=${selectedDate}`
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
    axios
      .get(`${baseUrl}paper_trade/getmarket?symbol=${selectedSymbol}`)
      .then((res) => {
        if (res?.data.length === 0) {
          showToast("No orders found", "info");
          setOrderData([]);
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
    fetchOrder();
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

  const handleRefesh = () => {
    fetchOrder();
    fetchMarketTrend();
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
        {/* <CustomDatePicker value={selectedDate} onChange={handleDateChange} /> */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        {/* <MarketTrendCard marketData={marketTrend}></MarketTrendCard> */}

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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;

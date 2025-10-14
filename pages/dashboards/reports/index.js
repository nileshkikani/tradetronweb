import Head from "next/head";

import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import { useRouter } from "next/router";

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

function DashboardReports() {
  const router = useRouter();
  const baseUrl = process.env.EMA_SCALPING_URL;

  const [selectFilter, setSelectedFilter] = useState("Today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [totalPnl, setTotalPnl] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [appliedFilter, setAppliedFilter] = useState("Today");
  const [appliedDate, setAppliedDate] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDetailClick = async (strategyName) => {
    const queryParams = {
      filter: appliedFilter.replace(/\s+/g, "_").toLowerCase(),
    };

    if (appliedFilter === "Custom") {
      queryParams.startDate = appliedDate.startDate;
      queryParams.endDate = appliedDate.endDate;
    }

    router.push({
      pathname: `reports/${strategyName}`,
      query: queryParams,
    });
  };

  const showToast = (message, type = "error") => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast({ open: false, message: "", type: "error" });
    }, 3000);
  };

  const validateDates = () => {
    if (selectFilter === "Custom") {
      if (!startDate || !endDate) {
        showToast("Please select both start and end dates", "error");
        return false;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
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

  const handleFilter = async () => {
    if (!validateDates()) {
      return;
    }

    setLoading(true);

    try {
      let url = `${baseUrl}paper_trade/strategy-pnl-report/?`;

      if (selectFilter === "Custom") {
        url += `date_range=custom&start_date=${startDate}&end_date=${endDate}`;
      } else {
        const dateRangeMap = {
          Today: "today",
          "This Month": "this_month",
          "This Year": "this_year",
        };
        url += `date_range=${dateRangeMap[selectFilter]}`;
      }

      const response = await axios.get(url);

      if (response.data.strategies && Array.isArray(response.data.strategies)) {
        setFilterData(response.data.strategies);
      }

      if (response.data.total_pnl !== undefined) {
        setTotalPnl(response.data.total_pnl);
      }
      if (selectFilter == "Custom") {
        setAppliedDate({ startDate, endDate });
      }
      setAppliedFilter(selectFilter);
      setLoading(false);
    } catch (error) {
      showToast("Error fetching data. Please try again.", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width="80%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="60%" />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );

  const isCustomInvalid = selectFilter === "Custom" && (!startDate || !endDate);

  return (
    <>
      <Head>
        <title>Reports Dashboard</title>
      </Head>
      <h1 style={{ margin: "32px 25px 16px" }}>Reports</h1>

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
          paddingBottom: "50px",
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
            labelId="my-strategies-label"
            value={selectFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{ minWidth: 300 }}
          >
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Month">This Month</MenuItem>
            <MenuItem value="This Year">This Year</MenuItem>
            <MenuItem value="Custom">Custom</MenuItem>
          </Select>

          {selectFilter === "Custom" && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                error={
                  (startDate &&
                    endDate &&
                    new Date(startDate) > new Date(endDate)) ||
                  (startDate && new Date(startDate) > new Date())
                }
                helperText={
                  startDate && new Date(startDate) > new Date()
                    ? "Start date cannot be in the future"
                    : startDate &&
                      endDate &&
                      new Date(startDate) > new Date(endDate)
                    ? "Start date cannot be greater than end date"
                    : ""
                }
              />

              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split("T")[0],
                }}
                error={
                  (startDate &&
                    endDate &&
                    new Date(startDate) > new Date(endDate)) ||
                  (endDate && new Date(endDate) > new Date())
                }
                helperText={
                  endDate && new Date(endDate) > new Date()
                    ? "End date cannot be in the future"
                    : startDate &&
                      endDate &&
                      new Date(startDate) > new Date(endDate)
                    ? "End date cannot be less than start date"
                    : ""
                }
              />
            </div>
          )}

          <Button
            onClick={handleFilter}
            variant="contained"
            style={{ marginLeft: 8, width: "150px", height: "44px" }}
            disabled={loading || isCustomInvalid}
          >
            {loading ? <CircularProgress size={24} /> : "Filter"}
          </Button>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "12px 24px",
                borderBottom: "1px solid rgb(161, 153, 153)",
              }}
            >
              {loading ? (
                <Skeleton variant="text" width={150} height={32} />
              ) : (
                <>
                  Total P/L: &nbsp;&nbsp;
                  <Typography
                    sx={{
                      color:
                        parseFloat(totalPnl) > 0
                          ? "success.main"
                          : parseFloat(totalPnl) < 0
                          ? "error.main"
                          : "inherit",
                      fontWeight: 500,
                    }}
                    fontWeight="600"
                  >
                    {totalPnl.toFixed(2)}
                  </Typography>
                </>
              )}
            </Box>
            <Table sx={{ minWidth: 650 }} aria-label="order table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Strategy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>PnL</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <LoadingSkeleton />
                ) : filterData.length > 0 ? (
                  filterData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(0, 0, 0, 0.01)",
                        },
                        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        {row?.strategy_name || row?.strategyName}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            parseFloat(row?.pnl) > 0
                              ? "success.main"
                              : parseFloat(row?.pnl) < 0
                              ? "error.main"
                              : "inherit",
                          fontWeight: 500,
                        }}
                      >
                        {typeof row?.pnl === "number"
                          ? row.pnl.toFixed(2)
                          : row?.pnl}
                      </TableCell>
                      <TableCell
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() =>
                          handleDetailClick(
                            row?.strategy_name || row?.strategyName
                          )
                        }
                      >
                        Detail
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
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

import React, { useState, useEffect } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import {
  Container,
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import axiosInstance from "src/utils/axios";
import useToast from "src/hooks/useToast";

// ─── Sentiment Logic ────────────────────────────────────────────────────────
//
// Reverse-engineered from Sensibull — verified against all 12 data rows:
//
// STEP 1 — Direction:
//   (a) Net OI and Change agree in sign  → direction = Net OI sign
//   (b) They disagree AND |Change| >= 5k → direction = Change sign (Change overrides)
//   (c) They disagree AND |Change| < 5k  → INDECISIVE
//
// STEP 2 — Intensity:
//   Case (a): use |Net OI| with per-segment thresholds
//   Case (b): use |Change| with change-based thresholds
//
// STEP 3 — Put inversion:
//   For Put sub-rows: flip the direction (positive put net OI = Bearish)
//
// ────────────────────────────────────────────────────────────────────────────

const INDECISIVE_CHANGE_MIN = 5_000;

// Net OI thresholds per segment (Mild < mild, Medium mild–medium, Strong > medium)
const NET_OI_THRESHOLDS = {
  "Index Futures": { mild: 100_000, medium: 180_000 },
  "Stock Futures": { mild: 1_500_000, medium: 2_500_000 },
  "Index Options": { mild: 200_000, medium: 500_000 },
  "Stock Options": { mild: 200_000, medium: 500_000 },
  "Call Options": { mild: 200_000, medium: 500_000 },
  "Put Options": { mild: 200_000, medium: 500_000 },
  "Long Futures": { mild: 100_000, medium: 180_000 },
  "Short Futures": { mild: 100_000, medium: 180_000 },
};

// Change thresholds used when Change overrides (case b)
const CHANGE_THRESHOLDS = { mild: 20_000, medium: 50_000 };

function getIntensity(absVal, { mild, medium }) {
  if (absVal > medium) return "Strong";
  if (absVal > mild) return "Medium";
  return "Mild";
}

/**
 * Returns { label: string, type: 'bullish' | 'bearish' | 'neutral' }
 */
function getSentiment(netOI, change, segmentLabel) {
  const noNet = netOI == null || isNaN(netOI);
  const noChange = change == null || isNaN(change);

  if (noNet && noChange) return { label: "Indecisive", type: "neutral" };

  const isPut = segmentLabel.toLowerCase().includes("put");
  const thresholds =
    NET_OI_THRESHOLDS[segmentLabel] || NET_OI_THRESHOLDS["Index Futures"];

  // Only Net OI available
  if (noChange) {
    const val = isPut ? -netOI : netOI;
    if (Math.abs(val) < 2_000) return { label: "Indecisive", type: "neutral" };
    const intensity = getIntensity(Math.abs(val), thresholds);
    const type = val > 0 ? "bullish" : "bearish";
    return {
      label: `${intensity} ${type === "bullish" ? "Bullish" : "Bearish"}`,
      type,
    };
  }

  // Only Change available
  if (noNet) {
    const val = isPut ? -change : change;
    if (Math.abs(val) < INDECISIVE_CHANGE_MIN)
      return { label: "Indecisive", type: "neutral" };
    const intensity = getIntensity(Math.abs(val), CHANGE_THRESHOLDS);
    const type = val > 0 ? "bullish" : "bearish";
    return {
      label: `${intensity} ${type === "bullish" ? "Bullish" : "Bearish"}`,
      type,
    };
  }

  // Both available — apply put inversion
  const eff_net = isPut ? -netOI : netOI;
  const eff_change = isPut ? -change : change;

  const netDir = Math.sign(eff_net);
  const changeDir = Math.sign(eff_change);
  const disagree = netDir !== 0 && changeDir !== 0 && netDir !== changeDir;

  // Case (c): disagree + tiny change → Indecisive
  if (disagree && Math.abs(eff_change) < INDECISIVE_CHANGE_MIN) {
    return { label: "Indecisive", type: "neutral" };
  }

  // Case (b): disagree + large change → Change wins
  if (disagree) {
    const intensity = getIntensity(Math.abs(eff_change), CHANGE_THRESHOLDS);
    const type = eff_change > 0 ? "bullish" : "bearish";
    return {
      label: `${intensity} ${type === "bullish" ? "Bullish" : "Bearish"}`,
      type,
    };
  }

  // Case (a): agree → Net OI drives intensity
  const primary = eff_net !== 0 ? eff_net : eff_change;
  if (Math.abs(primary) < 2_000)
    return { label: "Indecisive", type: "neutral" };
  const intensity = getIntensity(Math.abs(primary), thresholds);
  const type = primary > 0 ? "bullish" : "bearish";
  return {
    label: `${intensity} ${type === "bullish" ? "Bullish" : "Bearish"}`,
    type,
  };
}

const SENTIMENT_COLOR = {
  "Strong Bullish": "#1b5e20",
  "Medium Bullish": "#2e7d32",
  "Mild Bullish": "#43a047",
  "Strong Bearish": "#b71c1c",
  "Medium Bearish": "#c62828",
  "Mild Bearish": "#e53935",
};

const SENTIMENT_WIDTH = { Strong: "85%", Medium: "60%", Mild: "35%" };

function ParticipantsData() {
  const { showToast } = useToast();
  const theme = useTheme();

  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [datesLoading, setDatesLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (participant, segment) => {
    const id = `${participant}-${segment}`;
    const next = new Set(expandedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRows(next);
  };

  useEffect(() => {
    fetchDates();
  }, []);
  useEffect(() => {
    if (selectedDate) fetchData(selectedDate);
  }, [selectedDate]);

  const fetchDates = async () => {
    try {
      setDatesLoading(true);
      const res = await axiosInstance.get("/oi-data/participant/dates/");
      if (res.data?.dates?.length) {
        setDates(res.data.dates);
        setSelectedDate(res.data.dates[0]);
      }
    } catch {
      showToast("Failed to fetch available dates", "error");
    } finally {
      setDatesLoading(false);
    }
  };

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/oi-data/participant/?date=${date}`);
      setData(res.data?.data || []);
    } catch {
      showToast("Failed to fetch participant data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (num) => {
    if (num == null || num === "" || isNaN(num)) return "--";
    if (Math.abs(num) >= 100_000) return `${(num / 100_000).toFixed(2)}L`;
    return num.toLocaleString();
  };

  // Row background based on sentiment
  const rowBg = (net, change, label) => {
    const s = getSentiment(net, change, label);
    if (s.type === "neutral") return "transparent";
    return s.type === "bullish"
      ? alpha(theme.palette.success.main, 0.05)
      : alpha(theme.palette.error.main, 0.05);
  };

  // The coloured bar rendered inside the Bearish or Bullish cell
  const SentimentBar = ({ net, change, label, side }) => {
    const s = getSentiment(net, change, label);

    if (s.type === "neutral") {
      if (side === "bearish") return null;
      return (
        <Box display="flex" justifyContent="center" width="100%">
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            Indecisive
          </Typography>
        </Box>
      );
    }

    if (s.type !== side) return null;

    const color =
      SENTIMENT_COLOR[s.label] ||
      (s.type === "bullish" ? "#43a047" : "#e53935");
    const width = SENTIMENT_WIDTH[s.label.split(" ")[0]] || "35%";

    return (
      <Box
        sx={{
          width,
          height: 24,
          bgcolor: color,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: side === "bullish" ? 0.5 : "auto",
          mr: side === "bearish" ? 0.5 : "auto",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.6rem",
            whiteSpace: "nowrap",
            px: 1,
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          {s.label}
        </Typography>
      </Box>
    );
  };

  const cellSx = {
    head: {
      fontWeight: "bold",
      color: "text.secondary",
      textTransform: "uppercase",
      fontSize: "0.75rem",
    },
    divL: { borderLeft: `1px solid ${theme.palette.divider}` },
    divR: { borderRight: `1px solid ${theme.palette.divider}` },
  };

  return (
    <>
      <Head>
        <title>Participant Wise Data - Dashboard</title>
      </Head>
      <PageTitleWrapper>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          <Box />
          <Box display="flex" gap={2} alignItems="center">
            {datesLoading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl
                size="small"
                sx={{ minWidth: 200, bgcolor: "background.paper" }}
              >
                <InputLabel id="date-sel">Select Date</InputLabel>
                <Select
                  labelId="date-sel"
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
        ) : data.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 10, textAlign: "center" }}>
              <Typography variant="h4" color="text.secondary">
                No Data Available for this date
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined" sx={{ borderRadius: 1 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow
                    sx={{ bgcolor: alpha(theme.palette.background.paper, 0.8) }}
                  >
                    <TableCell align="center" sx={{ ...cellSx.head, py: 1.5 }}>
                      Participant
                    </TableCell>
                    <TableCell align="left" sx={cellSx.head}>
                      Segment
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ ...cellSx.head, width: "20%" }}
                    >
                      Bearish
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ ...cellSx.head, width: "20%" }}
                    >
                      Bullish
                    </TableCell>
                    <TableCell align="center" sx={cellSx.head}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        Net OI <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={cellSx.head}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        Change <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {["FII", "DII", "Pro", "Client"].map((clientType) => {
                    const p =
                      data.find((d) => d.client_type === clientType) || {};

                    const stockOptNet =
                      p.option_stock_call_long -
                      p.option_stock_call_short -
                      (p.option_stock_put_long - p.option_stock_put_short);

                    const segments = [
                      {
                        label: "Index Futures",
                        net: p.future_index_net_oi,
                        change: p.net_oi_change_in_future_index,
                        hasIcon: true,
                        subRows: [
                          {
                            label: "Long Futures",
                            net: p.future_index_long,
                            change: null,
                          },
                          {
                            label: "Short Futures",
                            net: -(p.future_index_short ?? 0),
                            change: null,
                          },
                        ],
                      },
                      {
                        label: "Stock Futures",
                        net: p.future_stock_net_oi,
                        change: p.net_oi_change_in_future_stock,
                        hasIcon: false,
                      },
                      {
                        label: "Index Options",
                        net: p.option_index_net_oi,
                        change: p.net_oi_change_option_index,
                        hasIcon: true,
                        subRows: [
                          {
                            label: "Call Options",
                            net: p.option_index_call_net_oi,
                            change: p.net_oi_change_option_index_call,
                          },
                          {
                            label: "Put Options",
                            net: p.option_index_put_net_oi,
                            change: p.net_oi_change_option_index_put,
                          },
                        ],
                      },
                      {
                        label: "Stock Options",
                        net: isNaN(stockOptNet) ? null : stockOptNet,
                        change: null,
                        hasIcon: false,
                      },
                    ];

                    // rowSpan = how many <tr> this participant spans
                    let totalRows = 0;
                    segments.forEach((seg) => {
                      totalRows += 1;
                      if (
                        seg.subRows &&
                        expandedRows.has(`${clientType}-${seg.label}`)
                      ) {
                        totalRows += seg.subRows.length;
                      }
                    });

                    return (
                      <React.Fragment key={clientType}>
                        {segments.map((seg, si) => {
                          const isExpanded = expandedRows.has(
                            `${clientType}-${seg.label}`,
                          );
                          const bg = rowBg(seg.net, seg.change, seg.label);

                          return (
                            <React.Fragment key={seg.label}>
                              <TableRow hover>
                                {si === 0 && (
                                  <TableCell
                                    rowSpan={totalRows}
                                    align="center"
                                    sx={{
                                      fontWeight: "bold",
                                      ...cellSx.divR,
                                      verticalAlign: "middle",
                                      bgcolor: alpha(
                                        theme.palette.background.default,
                                        0.5,
                                      ),
                                      color: "text.secondary",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    {clientType}
                                  </TableCell>
                                )}

                                <TableCell
                                  sx={{
                                    ...cellSx.divR,
                                    py: 0.75,
                                    cursor: seg.hasIcon ? "pointer" : "default",
                                  }}
                                  onClick={() =>
                                    seg.hasIcon &&
                                    toggleRow(clientType, seg.label)
                                  }
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {seg.label}
                                    </Typography>
                                    {seg.hasIcon && (
                                      <ChevronRightIcon
                                        sx={{
                                          fontSize: 16,
                                          color: "text.secondary",
                                          transform: isExpanded
                                            ? "rotate(90deg)"
                                            : "none",
                                          transition: "transform 0.2s",
                                        }}
                                      />
                                    )}
                                  </Box>
                                </TableCell>

                                {/* Bearish cell */}
                                <TableCell
                                  align="right"
                                  sx={{
                                    bgcolor: bg,
                                    borderRight: "none",
                                    width: "20%",
                                    px: 0.5,
                                  }}
                                >
                                  <SentimentBar
                                    net={seg.net}
                                    change={seg.change}
                                    label={seg.label}
                                    side="bearish"
                                  />
                                </TableCell>

                                {/* Bullish cell */}
                                <TableCell
                                  align="left"
                                  sx={{ bgcolor: bg, width: "20%", px: 0.5 }}
                                >
                                  <SentimentBar
                                    net={seg.net}
                                    change={seg.change}
                                    label={seg.label}
                                    side="bullish"
                                  />
                                </TableCell>

                                <TableCell
                                  align="center"
                                  sx={{ ...cellSx.divL, fontWeight: 600 }}
                                >
                                  {fmt(seg.net)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{
                                    ...cellSx.divL,
                                    fontWeight: 500,
                                    color:
                                      seg.change > 0
                                        ? "#2e7d32"
                                        : seg.change < 0
                                        ? "#d32f2f"
                                        : "text.primary",
                                  }}
                                >
                                  {fmt(seg.change)}
                                </TableCell>
                              </TableRow>

                              {/* Expanded sub-rows */}
                              {isExpanded &&
                                seg.subRows?.map((sub) => {
                                  const subBg = rowBg(
                                    sub.net,
                                    sub.change,
                                    sub.label,
                                  );
                                  return (
                                    <TableRow
                                      key={sub.label}
                                      sx={{
                                        bgcolor: alpha(
                                          theme.palette.background.default,
                                          0.3,
                                        ),
                                      }}
                                    >
                                      <TableCell
                                        sx={{ ...cellSx.divR, py: 0.5, pl: 4 }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontWeight: 500,
                                            color: "text.secondary",
                                          }}
                                        >
                                          {sub.label}
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          bgcolor: subBg,
                                          borderRight: "none",
                                          px: 0.5,
                                        }}
                                      >
                                        <SentimentBar
                                          net={sub.net}
                                          change={sub.change}
                                          label={sub.label}
                                          side="bearish"
                                        />
                                      </TableCell>
                                      <TableCell
                                        align="left"
                                        sx={{ bgcolor: subBg, px: 0.5 }}
                                      >
                                        <SentimentBar
                                          net={sub.net}
                                          change={sub.change}
                                          label={sub.label}
                                          side="bullish"
                                        />
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          ...cellSx.divL,
                                          fontSize: "0.75rem",
                                          color: "text.secondary",
                                        }}
                                      >
                                        {fmt(sub.net)}
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        sx={{
                                          ...cellSx.divL,
                                          fontSize: "0.75rem",
                                          color:
                                            sub.change > 0
                                              ? "#2e7d32"
                                              : sub.change < 0
                                              ? "#d32f2f"
                                              : "text.secondary",
                                        }}
                                      >
                                        {fmt(sub.change)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Container>
    </>
  );
}

ParticipantsData.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ParticipantsData;

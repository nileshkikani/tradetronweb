import React, { useEffect, useState } from "react";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import {
  Button,
  ListItem,
  FormControl,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  Box,
  Slide,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { useSnackbar } from "notistack";
import { TOAST_ALERTS, TOAST_TYPES } from "src/constants/keywords";
import axiosInstance from "src/utils/axios";
import { API_ROUTER } from "src/services/routes";
import { useSelector } from "react-redux";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

function DashboardStrategyBuilderContent() {
  const { enqueueSnackbar } = useSnackbar();
  const authState = useSelector((state) => state.auth.authState);
  const [symbol, setSymbol] = useState([]);
  const [segment, setSegment] = useState("futures");
  const [index, setIndex] = useState("BANKNIFTY");
  const [expiryDate, setExpiryDate] = useState([]);
  const [selectedExpiryDate, setSelectedExpiryDate] = useState(null);
  const [strikePrice, setStrikePrice] = useState([]);
  const [selectedStrikePrice, setSelectedStrikePrice] = useState();
  const [selectedOptionType, setSelectedOptionType] = useState("ce");
  const [optionPrice, setOptionPrice] = useState();

  const getSymbolList = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.SYMBOLS, {
        headers: { Authorization: `Bearer ${authState}` },
      });
      const symbollist = response.data?.symbols;
      setSymbol(symbollist);
    } catch (error) {
      enqueueSnackbar(TOAST_ALERTS.GENERAL_ERROR, {
        variant: TOAST_TYPES.ERROR,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        autoHideDuration: 2000,
        TransitionComponent: Slide,
      });
    }
  };

  const getExpiryDate = async () => {
    try {
      const response = await axiosInstance.get(
        `/stocks/get-expiry/?segment=${segment}&symbol=${index}`,
        {
          headers: { Authorization: `Bearer ${authState}` },
        }
      );
      const expiryDateRespone = response.data?.expiry_dates;
      setExpiryDate(expiryDateRespone);
    } catch (error) {}
  };
  const getStrikePrice = async () => {
    try {
      const response = await axiosInstance.get(
        `/stocks/get-strike-price/?symbol=${index}&expiry_date=${selectedExpiryDate}&date=${selectedExpiryDate}`,
        {
          headers: { Authorization: `Bearer ${authState}` },
        }
      );
      const strikePriceResponse = response.data?.strike_price;
      setStrikePrice(strikePriceResponse);
    } catch (error) {}
  };

  const getOptionPrice = async () => {
    try {
      const response = await axiosInstance.get(
        `/stocks/get-option-price/?symbol=${index}&expiry_date=${selectedExpiryDate}&strike_price=${selectedStrikePrice}&option_type=${selectedOptionType}&date=${selectedExpiryDate}&segment=${segment}`,
        {
          headers: { Authorization: `Bearer ${authState}` },
        }
      );

      const optionPriceResponse = response.data;
      console.log("op :>> ", optionPriceResponse);
      setOptionPrice(optionPriceResponse);
    } catch (error) {}
  };

  useEffect(() => {
    getSymbolList();
    getExpiryDate();
    if (selectedExpiryDate) {
      getStrikePrice();
      getOptionPrice();
    }
  }, [
    index,
    segment,
    selectedExpiryDate,
    selectedStrikePrice,
    selectedOptionType,
  ]);

  useEffect(() => {
    setSelectedExpiryDate(expiryDate[0]);
    setSelectedStrikePrice(strikePrice[0]);
  }, [expiryDate, strikePrice]);

  const addPosition = async () => {
    try {
      const response = await axiosInstance.post(
        API_ROUTER.ADD_POSITION,
        JSON.stringify({
          current_price,
          entry_price,
          exit_price,
          pnl,
          expiry,
          strike,
          option_type,
          action,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Position added successfully:", response.data);
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <>
      <PageTitleWrapper>
        <h1>Strategy-Builder (Opstra)</h1>
      </PageTitleWrapper>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        >
          <MenuItem disabled value="">
            <em>Select Index/Stock</em>
          </MenuItem>
          {symbol?.map((symbol, index) => (
            <MenuItem key={index} value={symbol}>
              {symbol}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Index/Stock</FormHelperText>
        <Select
          labelId="segment-select-label"
          id="segment-select"
          onChange={(event) => setSegment(event.target.value)}
          value={segment}
        >
          <MenuItem disabled value="">
            <em>Select Segment</em>
          </MenuItem>
          <MenuItem value="futures">Future</MenuItem>
          <MenuItem value="options">Options</MenuItem>
        </Select>
        <FormHelperText>Select Segment</FormHelperText>
        <Select
          labelId="expiry-select-label"
          id="expiry-select"
          onChange={(event) => setSelectedExpiryDate(event.target.value)}
          value={selectedExpiryDate}
        >
          <MenuItem disabled value="">
            <em>Select Expiry</em>
          </MenuItem>
          {expiryDate?.map((expiryDate, index) => (
            <MenuItem key={index} value={expiryDate}>
              {expiryDate}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Expiry</FormHelperText>
        {/* Conditional rendering based on segment selection */}
        {segment === "options" && (
          <>
            <Select
              labelId="strike-select-label"
              id="strike-select"
              value={selectedStrikePrice}
              onChange={(event) => setSelectedStrikePrice(event.target.value)}
            >
              <MenuItem disabled value="">
                <em>Placeholder</em>
              </MenuItem>
              {strikePrice?.map((strikePrice, index) => (
                <MenuItem key={index} value={strikePrice}>
                  {strikePrice}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Option Strike</FormHelperText>

            <Select
              labelId="type-select-label"
              id="type-select"
              value={selectedOptionType}
              onChange={(event) => setSelectedOptionType(event.target.value)}
            >
              <MenuItem disabled value="">
                <em>Placeholder</em>
              </MenuItem>
              <MenuItem value="ce">CE</MenuItem>
              <MenuItem value="pe">PE</MenuItem>
            </Select>
            <FormHelperText>Select Option Type</FormHelperText>
          </>
        )}
        <br />
        Option Price
        <TextField
          id="outlined-disabled"
          value={optionPrice?.futureprice || ""} // Safely access futureprice, default to empty if undefined
          variant="outlined"
        />
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          defaultValue="buy"
        >
          <FormControlLabel value="buy" control={<Radio />} label="Buy" />
          <FormControlLabel value="sell" control={<Radio />} label="Sell" />
        </RadioGroup>
      </FormControl>
    </>
  );
}

DashboardStrategyBuilderContent.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardStrategyBuilderContent;

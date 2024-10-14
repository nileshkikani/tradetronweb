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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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
  const [allPosition, setAllPosition] = useState();

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
    const formData = new FormData();
    formData.append("current_price", optionPrice.futureprice);
    formData.append("entry_price", optionPrice.futureprice);
    formData.append("expiry", selectedExpiryDate);
    formData.append("strike", selectedStrikePrice);
    formData.append("option_type", "CE");
    formData.append("action", "Buy");

    const response = await axiosInstance.post(
      API_ROUTER.ADD_POSITION,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authState}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    getAllPosition();
  };
  console.log("optionPrice :>> ", optionPrice);

  const getAllPosition = async () => {
    try {
      const response = await axiosInstance.get(API_ROUTER.ALL_POSITION, {
        headers: { Authorization: `Bearer ${authState}` },
      });
      const allPositionList = response.data;
      setAllPosition(allPositionList);
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

  const handleDelete = async (uuid) => {
    try {
      const response = await axiosInstance.delete(`/stocks/position/${uuid}/`, {
        headers: { Authorization: `Bearer ${authState}` },
      });
      getAllPosition();
    } catch (error) {}
  };

  useEffect(() => {
    getAllPosition();
  }, []);
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
        <Button variant="contained" onClick={addPosition}>
          Add Position
        </Button>
      </FormControl>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Option Type</TableCell>
              <TableCell>Strike Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allPosition?.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.Position}</TableCell>
                <TableCell>{row.action}</TableCell>
                <TableCell>{row.entry_price}</TableCell>
                <TableCell>{row.current_price}</TableCell>
                <TableCell>{row.expiry}</TableCell>
                <TableCell>{row.option_type}</TableCell>
                <TableCell>{row.strike}</TableCell>

                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(row.uuid)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    // onClick={() => handleUpdate(row.uuid)}
                  >
                    <ModeEditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

DashboardStrategyBuilderContent.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardStrategyBuilderContent;

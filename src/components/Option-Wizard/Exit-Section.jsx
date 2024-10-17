"use client";
import React from "react";
import { useFormikContext, Field, ErrorMessage } from "formik";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  FormHelperText,
  Switch,
  Slide
} from "@mui/material";
import { useSnackbar } from 'notistack';
import { TOAST_ALERTS, TOAST_TYPES,TOAST_PLACE } from "src/constants/keywords";
// import { toast } from "react-hot-toast";


const Exitsection = () => {
  const { setFieldValue, values, errors, touched } = useFormikContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleProfitMTMChange = (e) => {
    const value = e.target.value;
    setFieldValue("take_profit_type", value);
    if (value === "none") {
      setFieldValue("take_profit_value", null);
    }
  };

  const handleProfitMTMInputChange = (e) => {
    const value = e.target.value;
    setFieldValue("take_profit_value", value);
  };

  const handleStoplossMTMChange = (e) => {
    const value = e.target.value;
    setFieldValue("stop_loss_type", value);
    if (value === "none") {
      setFieldValue("stop_loss_value", null);
    }
  };

  const handleStoplossMTMInputChange = (e) => {
    const value = e.target.value;
    const stopLossType = values.stop_loss_type;
    if (
      (stopLossType === "percentage_capital" ||
        stopLossType === "percentage_margin") &&
      value > 100
    ) {
      enqueueSnackbar(TOAST_ALERTS.SL_PERCENTAGE_EXCEED, {
        variant: TOAST_TYPES.ERROR,
        anchorOrigin: TOAST_PLACE,
        autoHideDuration: 2000,
        TransitionComponent: Slide
    });
      return;
    }

    if (stopLossType === "amount" && value > values.capital) {
      enqueueSnackbar(TOAST_ALERTS.SL_VALUE_EXCEED, {
        variant: TOAST_TYPES.ERROR,
        anchorOrigin: TOAST_PLACE,
        autoHideDuration: 2000,
        TransitionComponent: Slide
    });
      return;
    }
    setFieldValue("stop_loss_value", value);
  };

  const handleSwitchChange = (event) => {
    setFieldValue("do_repeat", event.target.checked);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    setFieldValue(name, value);
    const exit_HH = name === "exit_HH" ? value : values.exit_HH;
    const exit_MM = name === "exit_MM" ? value : values.exit_MM;
    if (exit_HH && exit_MM) {
      const exitTime = `${exit_HH}:${exit_MM}`;
      setFieldValue("exit_time", exitTime);
    }
  };

  const hourOptions =
    values.index_name === "CRUDEOIL" || values.index_name === "CRUDEOILM"
      ? Array.from({ length: 15 }, (_, i) => i + 9)
      : Array.from({ length: 7 }, (_, i) => i + 9);

  const minuteOptions =
    values.exit_HH === 15 &&
    !(values.index_name === "CRUDEOIL" || values.index_name === "CRUDEOILM")
      ? Array.from({ length: 30 }, (_, i) => i)
      : Array.from({ length: 60 }, (_, i) => i);

  return (
    <Box
      border={2}
      sx={{
        borderColor: "primary.main",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px",
      }}
    >
      <h1 className="titles">Exit Setting</h1>
      <Box display="flex" flexDirection="row" gap={5}>
        <FormControl
          variant="outlined"
          error={touched.take_profit_type && Boolean(errors.take_profit_type)}
        >
          <InputLabel>Profit MTM</InputLabel>
          <Field
            as={Select}
            name="take_profit_type"
            label="Profit MTM"
            onChange={handleProfitMTMChange}
            value={values.take_profit_type}
            style={{ width: "200px" }}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="percentage_capital">% of Capital</MenuItem>
            <MenuItem value="percentage_margin">% of Margin</MenuItem>
            <MenuItem value="percentage_entry">% of Entry</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </Field>
          <FormHelperText>
            <ErrorMessage name="take_profit_type" component="span" className="error" />
          </FormHelperText>
        </FormControl>

        <TextField
          type="number"
          name="take_profit_value"
          label="Value"
          disabled={values.take_profit_type === "none"}
          onChange={handleProfitMTMInputChange}
          value={
            values.take_profit_value ||
            (values.take_profit_type === "none" ? 0 : "")
          }
          error={touched.take_profit_value && Boolean(errors.take_profit_value)}
          helperText={
            <ErrorMessage name="take_profit_value" component="span" className="error" />
          }
          style={{ width: "100px" }}
        />

        <FormControl
          variant="outlined"
          error={touched.stop_loss_type && Boolean(errors.stop_loss_type)}
          // style={{ width: "100px" }}
        >
          <InputLabel>Stoploss MTM</InputLabel>
          <Field
            as={Select}
            name="stop_loss_type"
            label="Stoploss MTM"
            onChange={handleStoplossMTMChange}
            value={values.stop_loss_type }
            style={{ width: "200px" }}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="percentage_capital">% of Capital</MenuItem>
            <MenuItem value="percentage_margin">% of Margin</MenuItem>
            <MenuItem value="percentage_entry">% of Entry</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </Field>
          <FormHelperText>
            <ErrorMessage name="stop_loss_type" component="span" className="error" />
          </FormHelperText>
        </FormControl>

        <TextField
          type="number"
          name="stop_loss_value"
          label="Value"
          disabled={values.stop_loss_type === "none"}
          onChange={handleStoplossMTMInputChange}
          value={values.stop_loss_type === "none" ? 0 : ""}
          error={touched.stop_loss_value && Boolean(errors.stop_loss_value)}
          helperText={<ErrorMessage name="stop_loss_value" component="span" />}
          style={{ width: "100px" }}
        />
      </Box>

      <Box display="flex" flexDirection="row" gap={2} marginTop={2}>
        <Box
          className="time-div"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* <label>Exit Time</label> */}
          <Box display="flex" gap={1}>
            <FormControl
              variant="outlined"
              error={touched.exit_HH && Boolean(errors.exit_HH)}
              style={{ width: "100px" }}
            >
              <InputLabel>Hours</InputLabel>
              <Field
                as={Select}
                name="exit_HH"
                label="Hours"
                value={values.exit_HH || ""}
                onChange={handleTimeChange}
              >
                <MenuItem value="" disabled>
                  hours
                </MenuItem>
                {hourOptions.map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Field>
              <FormHelperText>
                <ErrorMessage name="exit_HH" component="span" className="error"/>
              </FormHelperText>
            </FormControl>

            <FormControl
              variant="outlined"
              error={touched.exit_MM && Boolean(errors.exit_MM)}
              style={{ width: "100px" }}
            >
              <InputLabel>Minutes</InputLabel>
              <Field
                as={Select}
                name="exit_MM"
                label="Minutes"
                value={values.exit_MM || ""}
                onChange={handleTimeChange}
              >
                <MenuItem value="" disabled>
                  minutes
                </MenuItem>
                {minuteOptions.map((minute) => (
                  <MenuItem key={minute} value={minute}>
                    {minute}
                  </MenuItem>
                ))}
              </Field>
              <FormHelperText>
                <ErrorMessage name="exit_MM" component="span" className="error"/>
              </FormHelperText>
            </FormControl>
          </Box>
        </Box>

        <FormControl component="fieldset">
          <label>Do you want to Repeat?</label>
          <Box display="flex" alignItems="center">
            <label>No</label>
            <Switch checked={values.do_repeat} onChange={handleSwitchChange} />
            <label>Yes</label>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Exitsection;

"use client";
import React from "react";
import Switch from "@mui/material/Switch";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { toast } from "react-hot-toast";

const Exitsection = () => {
  const { setFieldValue, values, errors, touched } = useFormikContext();

  const handleProfitMTMChange = (e) => {
    const value = e.target.value;
    setFieldValue("take_profit_type", value);
    if (value === 'none') {
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
    if (value === 'none') {
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
      toast.error("Stop loss cannot exceed 100%");
      return;
    }

    if (stopLossType === "amount" && value > values.capital) {
      toast.error(`Stop loss cannot be more than capital`);
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
    values.index_name === 'CRUDEOIL' || values.index_name === 'CRUDEOILM'
      ? Array.from({ length: 15 }, (_, i) => i + 9)
      : Array.from({ length: 7 }, (_, i) => i + 9);

  const minuteOptions =
    values.exit_HH == 15 && 
    !(values.index_name === 'CRUDEOIL' || values.index_name === 'CRUDEOILM')
      ? Array.from({ length: 30 }, (_, i) => i) 
      : Array.from({ length: 60 }, (_, i) => i); 
    

  return (
    <section className="exit-section">
      <h1 className="titles">Exit Setting</h1>
      <div className="exit-section-dropdowns-1">
        <div className="dropdown-container">
          <label>Profit MTM</label>
          <Field
            as="select"
            name="take_profit_type"
            className={`segment ${
              touched.take_profit_type && errors.take_profit_type
                ? "redField"
                : ""
            }`}
            onChange={handleProfitMTMChange}
            value={values.take_profit_type}
          >
            <option value="none">None</option>
            <option value="percentage_capital">% of Capital</option>
            <option value="percentage_margin">% of Margin</option>
            <option value="percentage_entry">% of Entry</option>
            <option value="amount">Amount</option>
          </Field>
          <ErrorMessage
            name="take_profit_type"
            component="div"
            className="error"
          />
        </div>
        <div>
          <Field
            type="number"
            name="take_profit_value"
            className={`value ${
              touched.take_profit_value && errors.take_profit_value
                ? "redField"
                : ""
            }`}
            disabled={values.take_profit_type === "none"}
            onChange={handleProfitMTMInputChange}
            value={
              values.take_profit_type === "none" ? 0 : values.take_profit_value
            }
          />
          <ErrorMessage
            name="take_profit_value"
            component="div"
            className="error"
          />
        </div>
        <div className="dropdown-container">
          <label>Stoploss MTM</label>
          <Field
            as="select"
            name="stop_loss_type"
            className={`strike-selection ${
              touched.stop_loss_type && errors.stop_loss_type
                ? "redField"
                : ""
            }`}
            onChange={handleStoplossMTMChange}
            value={values.stop_loss_type}
          >
            <option value="none">None</option>
            <option value="percentage_capital">% of Capital</option>
            <option value="percentage_margin">% of Margin</option>
            <option value="percentage_entry">% of Entry</option>
            <option value="amount">Amount</option>
          </Field>
          <ErrorMessage
            name="stop_loss_type"
            component="div"
            className="error"
          />
        </div>
        <div>
          <Field
            type="number"
            name="stop_loss_value"
            className={`value ${
              touched.stop_loss_value && errors.stop_loss_value
                ? "redField"
                : ""
            }`}
            disabled={values.stop_loss_type === "none"}
            onChange={handleStoplossMTMInputChange}
            value={
              values.stop_loss_type === "none" ? 0 : values.stop_loss_value
            }
          />
          <ErrorMessage
            name="stop_loss_value"
            component="div"
            className="error"
          />
        </div>
      </div>

      <div className="exit-section-dropdowns-3">
        <div className="time-div">
          <label>Exit Time</label>
          <div>
            <Field
              as="select"
              name="exit_HH"
              className={`hour ${
                touched.exit_HH && errors.exit_HH ? "redField" : ""
              }`}
              value={values.exit_HH || ""}
              onChange={handleTimeChange}
            >
              <option value="" disabled>
                hours
              </option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Field>
            <ErrorMessage name="exit_HH" component="div" className="error" />
            <Field
              as="select"
              name="exit_MM"
              className={`minutes ${
                touched.exit_MM && errors.exit_MM ? "redField" : ""
              }`}
              value={values.exit_MM || ""}
              onChange={handleTimeChange}
            >
              <option value="" disabled>
                minutes
              </option>
              {minuteOptions.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </Field>
            <ErrorMessage name="exit_MM" component="div" className="error" />
          </div>
        </div>
        <div className="dropdown-container">
          <label>Do you want to Repeat?</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label>No</label>
            <Switch checked={values.do_repeat} onChange={handleSwitchChange} />
            <label>Yes</label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exitsection;

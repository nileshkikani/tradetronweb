'use client';
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { positionSchema } from "@/schemas/strategySchema";

const PositionSection = ({ push }) => {
  const { values, setFieldError, errors, touched } = useFormikContext();

  const getOptionSegmentType = () => {
    const itmOptions = Array.from(
      { length: 20 },
      (_, i) => `ITM_${(20 - i).toString()}`
    );
    const otmOptions = Array.from(
      { length: 20 },
      (_, i) => `OTM_${(i + 1).toString()}`
    );

    if (values.option_type === "CE") {
      return [...itmOptions, "ATM_0", ...otmOptions];
    } else if (values.option_type === "PE") {
      const reversedOtmOptions = [...otmOptions].reverse();
      const reversedItmOptions = [...itmOptions].reverse();
      return [...reversedOtmOptions, "ATM_0", ...reversedItmOptions];
    } else {
      return null;
    }
  };

  const handleAddPosition = async () => {
    const positionValues = {
      option_type: values.option_type,
      order_type: values.order_type,
      strike_selection: values.strike_selection,
      value: values.value,
      expiry: values.expiry,
      lots: values.lots,
    };

    try {
      await positionSchema.validate(positionValues, { abortEarly: false });
      push(positionValues);
    } catch (err) {
      if (err.inner) {
        err.inner.forEach((error) => {
          setFieldError(error.path, error.message);
        });
      }
    }
  };

  const lotSizes = {
    BANKNIFTY: 15,
    NIFTY: 25,
    FINNIFTY: 40,
    CRUDEOIL: 100,
    CRUDEOILM: 10,
    MIDCPNIFTY: 75,
  };

  const lotsDisplay = lotSizes[values.index_name];

  return (
    <div className="position-section-dropdowns">
      <div className="dropdown-container">
        <label>Segment</label>
        <Field
          as="select"
          name="option_type"
          className={`segment ${
            touched.option_type && errors.option_type
              ? "redField"
              : "border-gray-500"
          }`}
          disabled={!values.index_name}
          value={values.option_type || ""}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="CE">CE</option>
          <option value="PE">PE</option>
        </Field>
        <ErrorMessage name="option_type" component="div" className="error" />
      </div>

      <div className="dropdown-container">
        <label>B/S</label>
        <Field
          as="select"
          name="order_type"
          className={`bs ${
            touched.order_type && errors.option_type
              ? "redField"
              : "border-gray-500"
          }`}
          disabled={!values.option_type}
          value={values.order_type || ""}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </Field>
        <ErrorMessage name="order_type" component="div" className="error" />
      </div>

      <div className="dropdown-container">
        <label>Strike Selection</label>
        <Field
          as="select"
          name="strike_selection"
          className={`strike-selection ${
            touched.strike_selection && errors.strike_selection
              ? "redField"
              : "border-gray-500"
          }`}
          disabled={!values.option_type}
          value={values.strike_selection || ""}
        >
          {values.index_name === "CRUDEOIL" ||
          values.index_name === "CRUDEOILM" ? (
            <>
              <option value="" disabled>
                Select
              </option>
              <option value="ATM_SPOT">ATM Spot</option>
            </>
          ) : (
            <>
              <option value="" disabled>
                Select
              </option>
              <option value="ATM_SPOT">ATM Spot</option>
              <option value="ATM_FUTURE">ATM Futures</option>
              <option value="DELTA_LT">Delta &lt;</option>
              <option value="DELTA_GT">Delta &gt;</option>
            </>
          )}
        </Field>
        <ErrorMessage
          name="strike_selection"
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>Value</label>
        {(values.strike_selection === "ATM_FUTURE" ||
          values.strike_selection === "ATM_SPOT") &&
        (values.option_type === "CE" || values.option_type === "PE") ? (
          <Field
            name="value"
            as="select"
            className={`value ${
              touched.value && errors.value ? "redField" : ""
            }`}
            disabled={!values.strike_selection}
            value={values.value || ""}
          >
            <option value="" disabled>
              Select value
            </option>
            {getOptionSegmentType() &&
              getOptionSegmentType().map((option) => (
                <option key={option} value={option}>
                  {option
                    .replace(
                      /ITM_|OTM_/,
                      (match) => `${match.replace("_", "")} `
                    )
                    .replace("ATM_0", "ATM")}
                </option>
              ))}
          </Field>
        ) : (
          <Field
            name="value"
            type="number"
            className={`value ${
              touched.value && errors.value ? "redField" : ""
            }`}
            disabled={!values.strike_selection}
            value={values.value || ""}
          />
        )}
        <ErrorMessage name="value" component="div" className="error" />
      </div>

      <div className="dropdown-container">
        <label>Expiry</label>
        <Field
          as="select"
          name="expiry"
          className={`expiry ${
            touched.expiry && errors.expiry ? "redField" : ""
          }`}
          value={values.expiry || ""}
        >
          <option value="" disabled>
            Select
          </option>
          {values.index_name === "CRUDEOIL" ||
          values.index_name === "CRUDEOILM" ? (
            <>
              <option value="CURRENT_MONTH">Current Month</option>
            </>
          ) : (
            <>
              <option value="CURRENT_WEEK">Current Week</option>
              <option value="NEXT_WEEK">Next Week</option>
              <option value="CURRENT_MONTH">Current Month</option>
              <option value="NEXT_MONTH">Next Month</option>
            </>
          )}
        </Field>
        <ErrorMessage name="expiry" component="div" className="error" />
      </div>

      <div className="dropdown-container">
        <label>
          Lots
          {values.index_name &&
            ` (lot = ${lotsDisplay !== undefined && lotsDisplay})`}
        </label>
        <Field
          as="select"
          name="lots"
          className={`lots${
            touched.lots && errors.lots ? "redField" : ""
          }`}
          value={values.lots || ""}
        >
          <option value="" disabled>
            Select
          </option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Field>
        <ErrorMessage name="lots" component="div" className="error" />
      </div>

      <div className="add-remove">
        <button type="button" onClick={handleAddPosition} className="create-own-strategy-btn">
          Add
        </button>
      </div>
    </div>
  );
};

export default PositionSection;

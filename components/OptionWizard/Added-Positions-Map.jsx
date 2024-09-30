"use client";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { Field, ErrorMessage, useFormikContext } from "formik";

const AddedPositions = ({ position, index, remove }) => {
  const { values } = useFormikContext();

  const getOptionSegmentType = () => {
    const itmOptions = Array.from(
      { length: 20 },
      (_, i) => `ITM_${(20 - i).toString()}`
    );
    const otmOptions = Array.from(
      { length: 20 },
      (_, i) => `OTM_${(i + 1).toString()}`
    );

    if (position.option_type === "CE") {
      return [...itmOptions, "ATM_0", ...otmOptions];
    } else if (position.option_type === "PE") {
      const reversedOtmOptions = [...otmOptions].reverse();
      const reversedItmOptions = [...itmOptions].reverse();
      return [...reversedOtmOptions, "ATM_0", ...reversedItmOptions];
    } else {
      return null;
    }
  };

  const underlying = values.index_name;

  return (
    <div key={index} className="position-section-dropdowns">
      <div className="dropdown-container">
        <label>Segment</label>
        <Field
          as="select"
          name={`positions[${index}].option_type`}
          className="segment"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="CE">CE</option>
          <option value="PE">PE</option>
        </Field>
        <ErrorMessage
          name={`positions[${index}].option_type`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>B/S</label>
        <Field
          as="select"
          name={`positions[${index}].order_type`}
          className="bs"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </Field>
        <ErrorMessage
          name={`positions[${index}].order_type`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>Strike Selection</label>
        <Field
          as="select"
          name={`positions[${index}].strike_selection`}
          className="strike-selection"
        >
          <option value="" disabled>
            Select
          </option>
          {underlying === "CRUDEOIL" || underlying === "CRUDEOILM" ? (
            <option value="ATM_SPOT">ATM Spot</option>
          ) : (
            <>
              <option value="ATM_SPOT">ATM Spot</option>
              <option value="ATM_FUTURE">ATM Futures</option>
              <option value="DELTA_LT">Delta &lt;</option>
              <option value="DELTA_GT">Delta &gt;</option>
            </>
          )}
        </Field>
        <ErrorMessage
          name={`positions[${index}].strike_selection`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>Value</label>
        {position.strike_selection === "ATM_FUTURE" ||
        position.strike_selection === "ATM_SPOT" ? (
          <Field
            as="select"
            name={`positions[${index}].value`}
            className="value"
          >
            <option value="" disabled>
              Select Segment first
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
            name={`positions[${index}].value`}
            type="number"
            className="value"
          />
        )}
        <ErrorMessage
          name={`positions[${index}].value`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>Expiry</label>
        <Field
          as="select"
          name={`positions[${index}].expiry`}
          className="expiry"
        >
          <option value="" disabled>
            Select
          </option>
          {underlying === "CRUDEOIL" || underlying === "CRUDEOILM" ? (
            <option value="CURRENT_MONTH">Current Month</option>
          ) : (
            <>
              <option value="CURRENT_WEEK">Current Week</option>
              <option value="NEXT_WEEK">Next Week</option>
              <option value="CURRENT_MONTH">Current Month</option>
              <option value="NEXT_MONTH">Next Month</option>
            </>
          )}
        </Field>
        <ErrorMessage
          name={`positions[${index}].expiry`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
        <label>Lots</label>
        <Field as="select" name={`positions[${index}].lots`} className="lots">
          <option value="" disabled>
            Select
          </option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name={`positions[${index}].lots`}
          component="div"
          className="error"
        />
      </div>

      <div className="dropdown-container">
                <label>Take Profit Value</label>
                <Field
                    name={`positions[${index}].order_take_profit_value`}
                    type="number"
                    className="value"
                />
                <ErrorMessage
                    name={`positions[${index}].order_take_profit_value`}
                    component="div"
                    className="error"
                />
            </div>

            <div className="dropdown-container">
                <label>Stop Loss Value</label>
                <Field
                    name={`positions[${index}].order_stop_loss_value`}
                    type="number"
                    className="value"
                />
                <ErrorMessage
                    name={`positions[${index}].order_stop_loss_value`}
                    component="div"
                    className="error"
                />
            </div>

      <div className="add-remove">
        <RiDeleteBinLine
          className="delete-position-btn"
          size={22}
          onClick={() => remove(index)}
        />
      </div>
    </div>
  );
};

export default AddedPositions;

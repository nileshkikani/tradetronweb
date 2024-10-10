"use client";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, FormHelperText, Grid, IconButton } from "@mui/material";

const AddedPositions = ({ position, index, remove }) => {
  const { values } = useFormikContext();

  const getOptionSegmentType = () => {
    const itmOptions = Array.from({ length: 20 }, (_, i) => `ITM_${(20 - i).toString()}`);
    const otmOptions = Array.from({ length: 20 }, (_, i) => `OTM_${(i + 1).toString()}`);

    if (position.option_type === "CE") {
      return [...itmOptions, "ATM_0", ...otmOptions];
    } else if (position.option_type === "PE") {
      return [...otmOptions.reverse(), "ATM_0", ...itmOptions.reverse()];
    }
    return null;
  };

  const underlying = values.index_name;

  return (
    <Box
      key={index}
      className="position-section-dropdowns"
      display="flex"
      flexWrap="wrap"
      gap={2}
      sx={{
        border: 1,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      {[
        { name: `positions[${index}].option_type`, label: 'Segment', options: ['CE', 'PE'] },
        { name: `positions[${index}].order_type`, label: 'B/S', options: ['BUY', 'SELL'] },
        { 
          name: `positions[${index}].strike_selection`, 
          label: 'Strike Selection', 
          options: underlying === "CRUDEOIL" || underlying === "CRUDEOILM" 
            ? ['ATM_SPOT'] 
            : ['ATM_SPOT', 'ATM_FUTURE', 'DELTA_LT', 'DELTA_GT'] 
        },
        { 
          name: `positions[${index}].expiry`, 
          label: 'Expiry', 
          options: underlying === "CRUDEOIL" || underlying === "CRUDEOILM" 
            ? ['CURRENT_MONTH'] 
            : ['CURRENT_WEEK', 'NEXT_WEEK', 'CURRENT_MONTH', 'NEXT_MONTH'] 
        },
      ].map(({ name, label, options }) => (
        <Box key={name} display="flex" flexDirection="column" flex={1} minWidth="100px">
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Field as={Select} name={name} label={label} fullWidth>
              <MenuItem value="" disabled>Select</MenuItem>
              {options.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Field>
            <FormHelperText>
              <ErrorMessage name={name} component="span" />
            </FormHelperText>
          </FormControl>
        </Box>
      ))}

      {/* Option Segment Type Dropdown */}
      <Box display="flex" flexDirection="column" flex={1} style={{ width: "100px" }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Option Segment Type</InputLabel>
          <Field as={Select} name={`positions[${index}].value`} label="Option Segment Type" fullWidth>
            <MenuItem value="" disabled>Select Segment first</MenuItem>
            {position.strike_selection === "ATM_FUTURE" || position.strike_selection === "ATM_SPOT" ? (
              getOptionSegmentType()?.map(option => (
                <MenuItem key={option} value={option}>
                  {option.replace(/ITM_|OTM_/, match => `${match.replace("_", "")} `).replace("ATM_0", "ATM")}
                </MenuItem>
              ))
            ) : null}
          </Field>
          <FormHelperText>
            <ErrorMessage name={`positions[${index}].value`} component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Lots Field */}
      <Box display="flex" flexDirection="column" flex={1} minWidth="100px">
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Lots</InputLabel>
          <Field as={Select} name={`positions[${index}].lots`} label="Lots" fullWidth>
            <MenuItem value="" disabled>Select</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(e => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Field>
          <FormHelperText>
            <ErrorMessage name={`positions[${index}].lots`} component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Order Take Profit Value */}
      <Box display="flex" flexDirection="column" flex={1} minWidth="100px">
        <FormControl variant="outlined" fullWidth>
          {/* <InputLabel>Take Profit Value</InputLabel> */}
          <Field
            name={`positions[${index}].order_take_profit_value`}
            label='take profit value'
            type="number"
            as={TextField}
            variant="outlined"
            fullWidth
          />
          <FormHelperText>
            <ErrorMessage name={`positions[${index}].order_take_profit_value`} component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      {/* Order Stop Loss Value */}
      <Box display="flex" flexDirection="column" flex={1} minWidth="100px">
        <FormControl variant="outlined" fullWidth>
          {/* <InputLabel>Stop Loss Value</InputLabel> */}
          <Field
            name={`positions[${index}].order_stop_loss_value`}
            label='take stop loss value'
            type="number"
            as={TextField}
            variant="outlined"
            fullWidth
          />
          <FormHelperText>
            <ErrorMessage name={`positions[${index}].order_stop_loss_value`} component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      <Grid item>
        <IconButton 
          onClick={() => remove(index)} 
          sx={{ color: 'red' }} 
        >
          <RiDeleteBinLine size={22} />
        </IconButton>
      </Grid>
    </Box>
  );
};

export default AddedPositions;

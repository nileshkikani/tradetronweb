import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { positionSchema } from 'src/validation-schema/strategySchema';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box, FormHelperText } from '@mui/material';

const PositionSection = ({ push, indexAndStocksNames }) => {
  const { values, setFieldError, errors, touched } = useFormikContext();

  const lotsDisplay = indexAndStocksNames[values.index_name];

  const getOptionSegmentType = () => {
    const itmOptions = Array.from({ length: 50 }, (_, i) => `ITM_${(50 - i).toString()}`);
    const otmOptions = Array.from({ length: 50 }, (_, i) => `OTM_${(i + 1).toString()}`);

    if (values.option_type === 'CE') {
      return [...itmOptions, 'ATM_0', ...otmOptions];
    } else if (values.option_type === 'PE') {
      return [...otmOptions.reverse(), 'ATM_0', ...itmOptions.reverse()];
    }
    return null;
  };

  const handleAddPosition = async () => {
    const positionValues = {
      option_type: values.option_type,
      order_type: values.order_type,
      strike_selection: values.strike_selection,
      value: values.value,
      expiry: values.expiry,
      lots: values.lots
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

  const allowedIndexNames = [
    // "BANKNIFTY",
    'NIFTY',
    'SENSEX'
    // "FINNIFTY",
    // "MIDCPNIFTY",
    // "CRUDEOIL",
    // "CRUDEOILM",
  ];

  // define expiry options based on index_name
  const expiryOptions = allowedIndexNames.includes(values.index_name)
    ? ['CURRENT_WEEK', 'NEXT_WEEK', 'CURRENT_MONTH', 'NEXT_MONTH']
    : ['CURRENT_MONTH'];

  return (
    <Box className="position-section-dropdowns" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {[
        {
          name: 'option_type',
          label: 'Segment',
          options: ['CE', 'PE'],
          disabled: !values.index_name
        },
        {
          name: 'order_type',
          label: 'B/S',
          options: ['BUY', 'SELL'],
          disabled: !values.option_type
        },
        {
          name: 'strike_selection',
          label: 'Strike Selection',
          options:
            values.index_name === 'CRUDEOIL' || values.index_name === 'CRUDEOILM'
              ? ['ATM_SPOT']
              : ['ATM_SPOT', 'ATM_FUTURE', 'DELTA_LT', 'DELTA_GT', 'PREMIUM_GT', 'PREMIUM_LT'],
          disabled: !values.option_type
        },
        {
          name: 'expiry',
          label: 'Expiry',
          options: expiryOptions
        }
      ].map(({ name, label, options, disabled }) => (
        <Box key={name} display="flex" flexDirection="row" flex={1} minWidth="100px">
          <FormControl variant="outlined" error={touched[name] && Boolean(errors[name])} fullWidth>
            <InputLabel>{label}</InputLabel>
            <Field as={Select} name={name} label={label} disabled={disabled} fullWidth>
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Field>
            <FormHelperText>
              <ErrorMessage name={name} component="span" />
            </FormHelperText>
          </FormControl>
        </Box>
      ))}

      <Box display="flex" flexDirection="row" flex={1} minWidth="200px">
        <FormControl error={touched.value && Boolean(errors.value)} fullWidth>
          <InputLabel>Value</InputLabel>
          {['ATM_FUTURE', 'ATM_SPOT'].includes(values.strike_selection) && ['CE', 'PE'].includes(values.option_type) ? (
            <Field name="value" as={Select} label="Value" disabled={!values.strike_selection} fullWidth>
              <MenuItem value="" disabled>
                Select value
              </MenuItem>
              {getOptionSegmentType() &&
                getOptionSegmentType().map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.replace(/ITM_|OTM_/, (match) => `${match.replace('_', '')} `).replace('ATM_0', 'ATM')}
                  </MenuItem>
                ))}
            </Field>
          ) : (
            <Field
              name="value"
              as={TextField}
              type="number"
              variant="outlined"
              label="Value"
              disabled={!values.strike_selection}
              error={touched.value && Boolean(errors.value)}
              fullWidth
            />
          )}
          <FormHelperText>
            <ErrorMessage name="value" component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      <Box display="flex" flexDirection="row" flex={1} minWidth="200px">
        <FormControl error={touched.lots && Boolean(errors.lots)} fullWidth>
          <InputLabel>
            {lotsDisplay && `Lots ( 1 lot=${lotsDisplay !== undefined ? lotsDisplay : 'Loading...'})`}
          </InputLabel>
          <Field
            as={Select}
            name="lots"
            fullWidth
            label={`Lots ( 1 lot=${lotsDisplay !== undefined ? lotsDisplay : 'Loading...'})`}
            disabled={!lotsDisplay}
          >
            <MenuItem value="" disabled>
              Select Lot
            </MenuItem>
            {lotsDisplay ? (
              Array.from({ length: 10 }, (_, index) => index + 1).map((lot) => (
                <MenuItem key={lot} value={lot}>
                  {lot}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No lot sizes available
              </MenuItem>
            )}
          </Field>
          <FormHelperText>
            <ErrorMessage name="lots" component="span" />
          </FormHelperText>
        </FormControl>
      </Box>

      <Box display="flex" justifyContent="center">
        <Button variant="contained" onClick={handleAddPosition} className="create-own-strategy-btn">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default PositionSection;

import React from "react";
import { useFormikContext, Field, ErrorMessage } from "formik";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  FormHelperText,
} from '@mui/material';

const Entrysection = () => {
  const { setFieldValue, values, errors, touched } = useFormikContext();

  const options = [
    { value: "MON", label: "Mon" },
    { value: "TUE", label: "Tue" },
    { value: "WED", label: "Wed" },
    { value: "THU", label: "Thu" },
    { value: "FRI", label: "Fri" },
  ];

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);

    if (values.entry_HH && values.entry_MM) {
      const entryTime = `${values.entry_HH}:${values.entry_MM}`;
      setFieldValue("start_time", entryTime);
    }
  };

  const handleDayChange = (event) => {
    const selectedDays = event.target.value;
    setFieldValue("days", selectedDays);
  };

  const hourOptions = Array.from({ length: 7 }, (_, i) => i + 9); // Adjust as needed
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i); // Adjust as needed

  return (
    <Box border={2} sx={{ borderColor: 'primary.main', borderRadius: '8px', padding: '16px', margin: '16px' }}>
      <h1 className="titles">Entry Settings</h1>
      <Box display="flex" flexDirection="row" gap={2}>
        <FormControl variant="outlined" error={touched.entry_HH && Boolean(errors.entry_HH)} style={{ width: '100px' }}>
          <InputLabel>Hours</InputLabel>
          <Field as={Select} name="entry_HH" label="Hours" value={values.entry_HH || ""} onChange={handleTimeChange}>
            <MenuItem value="" disabled>hours</MenuItem>
            {hourOptions.map((hour) => (
              <MenuItem key={hour} value={hour}>{hour}</MenuItem>
            ))}
          </Field>
          <FormHelperText>
            <ErrorMessage name="entry_HH" component="span" />
          </FormHelperText>
        </FormControl>

        <FormControl variant="outlined" error={touched.entry_MM && Boolean(errors.entry_MM)} style={{ width: '100px' }}>
          <InputLabel>Minutes</InputLabel>
          <Field as={Select} name="entry_MM" label="Minutes" value={values.entry_MM || ""} onChange={handleTimeChange}>
            <MenuItem value="" disabled>minutes</MenuItem>
            {minuteOptions.map((minute) => (
              <MenuItem key={minute} value={minute}>{minute}</MenuItem>
            ))}
          </Field>
          <FormHelperText>
            <ErrorMessage name="entry_MM" component="span" />
          </FormHelperText>
        </FormControl>

        <FormControl variant="outlined" error={touched.days && Boolean(errors.days)} style={{ width: '250px' }}>
          <InputLabel>Days</InputLabel>
          <Field as={Select} multiple name="days" value={values.days || []} onChange={handleDayChange} renderValue={(selected) => selected.join(', ')} label="Days">
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={values.days?.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Field>
          <FormHelperText>
            <ErrorMessage name="days" component="span" />
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
};

export default Entrysection;

"use client";
import React from "react";
import { useFormikContext, Field, ErrorMessage } from "formik";
import Select from "react-select";

const Entrysection = () => {
  const { setFieldValue, values,errors, touched } = useFormikContext();

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

    const entry_HH = name === "entry_HH" ? value : values.entry_HH;
    const entry_MM = name === "entry_MM" ? value : values.entry_MM;

    if (entry_HH && entry_MM) {
      const entryTime = `${entry_HH}:${entry_MM}`;
      setFieldValue("start_time", entryTime);  
    }
  };

  const handleDayChange = (selectedOptions) => {
    const selectedDays = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setFieldValue("days", selectedDays);
  };

  return (
    <section className="entry-section">
      <h1 className="titles">Entry Settings</h1>
      <div className="entry-section-dropdowns">
        <div className="time-div">
          <label>Entry Time</label>
          <div>
            <Field
              as="select"
              name="entry_HH"
              className={`hour ${
                touched.entry_HH && errors.entry_HH
                  ? "redField"
                  : ""
              }`}
              value={values.entry_HH || ""}
              onChange={handleTimeChange}
            >
              <option value="" disabled>
                hours
              </option>
              {[9, 10, 11, 12, 13, 14, 15].map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </Field>
            <ErrorMessage name="entry_HH" component="div" className="error" />
            <Field
              as="select"
              name="entry_MM"
              className={`minutes ${
                touched.entry_MM && errors.entry_MM
                  ? "redField"
                  : ""
              }`}
              value={values.entry_MM || ""}
              onChange={handleTimeChange}
            >
              <option value="" disabled>
                minutes
              </option>
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </Field>
          </div>
          <ErrorMessage name="entry_MM" component="div" className="error" />
        </div>

        <div>
          <label>Enter On Days</label>
          <Select
            options={options}
            name="days"
            isMulti
            className={`day-picker ${
              touched.days && errors.days
                ? "redField"
                : ""
            }`}
            onChange={handleDayChange}
            value={options.filter((option) =>
              values.days?.includes(option.value)
            )}
          />
          <ErrorMessage name="days" component="div" className="error" />
        </div>
      </div>
    </section>
  );
};

export default Entrysection;

import React from "react";


const CustomDatePicker = ({ value, onChange }) => {
  return (
    <input
      type="date"
      className="date-picker"
      value={value || ""}
      onChange={onChange}
    />
  );
};

export default CustomDatePicker;
import React from "react";
import Link from "next/link";
import { FaChartArea,FaChartLine } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header">
      <div className="nav-item">
        <FaChartArea size={20} />
        <Link href="/strategy-builder">Delta Neutral</Link>
      </div>
      <div className="nav-item">
        <FaChartLine size={20} />
        <Link href="/option-wizard">Option Wizard</Link>
      </div>
      <div className="nav-item">
        {/* <FaChartLine size={20} /> */}
        <Link href="/positions">Positions</Link>
      </div>
    </div>
  );
}; 

export default Header;

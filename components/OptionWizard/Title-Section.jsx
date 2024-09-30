"use client";
import React from "react";

const Titlesection = ({ setShowForm }) => {

  const handleFormDisplay = () => {
    setShowForm(true);
  };

  return (
    <section>
      <h1 className="option-wizard">Option Wizard</h1>
      <div className="first-section">
        <div className="dropdown-container">
          <label htmlFor="pre-build-strategy">Pre Build Strategies</label>
          <select defaultValue="">
            <option value="" disabled>
              Select Strategy
            </option>
            <option value="strategy1">pre-build here...</option>
          </select>
        </div>
        <div>
          <p>Create</p>
          <button onClick={handleFormDisplay}>Create Own Strategy</button>
        </div>
        <div className="dropdown-container">
          <label htmlFor="my-strategies">My Strategies</label>
          <select defaultValue="">
            <option value="" disabled>
              Own strategy
            </option>
            <option value="strategy1">custom strategy here...</option>
          </select>
        </div>
      </div>
      <hr width="70%" />
    </section>
  );
};

export default Titlesection;

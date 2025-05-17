import React from "react";
import "./stocks.css";
import TableToggle from "./TableToggle";

const Stocks = () => {
  return (
    <>
      {/* <NavBar/> */}
      <div className="stocks-page">
        <div className="stocks-section">
          <div className="stocks">
            <TableToggle />
          </div>
        </div>
      </div>
    </>
  );
};

export default Stocks;

import React, { useEffect, useState } from "react";
import "./recentbills.css";
import axios from "axios";
import { IoCaretDownSharp } from "react-icons/io5";

const RecentBills = () => {
  const [bills, setBills] = useState([]);
  const [visibleTables, setVisibleTables] = useState({});

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(
          "https://qr-scanning-server.netlify.app/bills/billitems"
        );
        setBills(response.data);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, []);

  const groupItemsByName = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = {
          name: item.name,
          price: parseFloat(item.price) || 0,
          count: 0,
        };
      }
      acc[item.name].count += item.count;
      return acc;
    }, {});
  };

  const groupedBills = bills.reduce((acc, bill) => {
    const key = `${bill.tableNumber}-${bill.paidDate}-${bill.paidTime}`;
    if (!acc[key]) {
      acc[key] = {
        items: [],
        tableNumber: bill.tableNumber,
        customerName: bill.customerName,
        customerPhone: bill.customerPhone,
        date: bill.paidDate,
        time: bill.paidTime,
        billId: bill._id,
        billStatus: bill.billStatus,
      };
    }
    const groupedItems = groupItemsByName(bill.items);
    const existingItems = acc[key].items.reduce((existing, item) => {
      existing[item.name] = item;
      return existing;
    }, {});

    for (const itemName in groupedItems) {
      if (existingItems[itemName]) {
        existingItems[itemName].count += groupedItems[itemName].count;
      } else {
        existingItems[itemName] = groupedItems[itemName];
      }
    }

    acc[key].items = Object.values(existingItems);
    return acc;
  }, {});

  const handleToggleVisibility = (key) => {
    setVisibleTables((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <div className="recent-page">
        <div className="recent-section">
          <div className="cntnts">
            {Object.keys(groupedBills).length > 0 ? (
              Object.keys(groupedBills).map((key) => {
                const {
                  items,
                  tableNumber,
                  customerName,
                  customerPhone,
                  date,
                  time,
                  billId,
                  billStatus,
                } = groupedBills[key];

                const totalPrice = items.reduce((sum, item) => {
                  const price = item.price || 0;
                  return sum + price * item.count;
                }, 0);

                return (
                  <div key={key} className="bill-box">
                    <div className="detail-sec">
                      <button
                        className="btn"
                        onClick={() => handleToggleVisibility(key)}
                      >
                        <IoCaretDownSharp />
                      </button>
                      <span>Table NO: {tableNumber}</span>
                      <span>Restaurant Name ETC</span>
                      <span>Date: {date}</span>
                      <span>Time: {time}</span>
                    </div>

                    {visibleTables[key] && (
                      <div className="bill-details">
                        <div className="bill-header">
                          <h6>
                            Customer Details - Name: {customerName}, Phone
                            Number: {customerPhone}
                          </h6>
                          <span>Bill No: {billId}</span>
                          <span>Bill Status: {billStatus}</span>
                        </div>

                        <table className="bills">
                          <thead className="bg-success text-light">
                            <tr>
                              <th>S.NO</th>
                              <th>MENU NAME</th>
                              <th>PRICE</th>
                              <th>COUNT</th>
                              <th>FINAL PRICE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, index) => {
                              const finalPrice = item.price * item.count;
                              return (
                                <tr key={index} className="bill-item">
                                  <td>{index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.price.toFixed(2)}</td>
                                  <td>{item.count}</td>
                                  <td>{finalPrice.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                            <tr className="total-row bg-primary text-light">
                              <td colSpan="4" className="text-left">
                                Total:
                              </td>
                              <td>{totalPrice.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center">No bills available</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentBills;

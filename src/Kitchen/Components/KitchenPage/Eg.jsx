import React, { useEffect, useState } from "react";
import KitchenNavBar from "../KitchenNavbar/kitchenNavbar";
import "./kitchen.css";
import axios from "axios";

const KitchenOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://qr-backend-server.onrender.com/cart/items")
      .then((response) => {
        // console.log(response.data);
        setCartItems(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        // console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleServed = (itemId, isCombo = false) => {
    // Implement your served status update logic here
    console.log(`Marking ${isCombo ? "combo" : "item"} ${itemId} as served`);
  };

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error)
    return <div className="text-center my-4 text-danger">Error: {error}</div>;

  return (
    <>
      <KitchenNavBar />
      <div className="order-container">
        <span className="order-header">Order List</span>
        <div className="orders">
          {(cartItems || []).map((order, index) => (
            <div className="order-box" key={index}>
              <div className="header">
                <span>Table Number - {order.tableNumber}</span>
              </div>

              {/* Individual Items Section */}
              <div className="food-sec">
                <h4>Food Items :</h4>
                <ul className="food-items-box">
                  {(order.items || []).map((item, itemIndex) => (
                    <li key={itemIndex} className="item-detail">
                      <span>
                        <strong>Name:</strong> {item.name}
                      </span>
                      {/* <span>
                        <strong>Type:</strong> {item.type}
                      </span> */}
                      <span>
                        <strong>Count:</strong> {item.count}
                        <div className="count"></div>
                      </span>
                      <br />
                      {/* <span>
                        <strong>Price:</strong> ₹{item.price}
                      </span>
                      <span>
                        <strong>Category:</strong> {item.categoryName}
                      </span> */}
                      <span>
                        <strong>Status:</strong> {item.status}
                      </span>
                      <button
                        onClick={() => handleServed(item._id)}
                        disabled={item.status === "Served"}
                      >
                        {item.status === "Served"
                          ? "Already Served"
                          : "Mark as Served"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Combos Section */}
              <div className="combos-sec">
                <h4>Combos :</h4>
                <ul className="combo-items-box">
                  {(order.combos || []).map((combo, comboIndex) => (
                    <li key={comboIndex} className="combo-detail">
                      <span>
                        <strong>Combo Name:</strong> {combo.name}
                      </span>
                      {/* <span>
                        <strong>Type:</strong> {combo.type}
                      </span> */}
                      <span>
                        <strong>Count:</strong> {combo.count}
                      </span>
                      {/* <span>
                        <strong>Price:</strong> ₹{combo.price}
                      </span>
                      <span>
                        <strong>Category:</strong> {combo.categoryName}
                      </span> */}
                      <span>
                        {/* <strong>Items:</strong> */}
                        <ul className="combo-items">
                          {(combo.items || []).map(
                            (comboItem, comboItemIndex) => (
                              <li key={comboItemIndex}>
                                {comboItem.name} - {comboItem.quantity}
                              </li>
                            )
                          )}
                        </ul>
                      </span>
                      <span>
                        <strong>Status:</strong> {combo.status}
                      </span>
                      <button
                        onClick={() => handleServed(combo._id, true)}
                        disabled={combo.status === "Served"}
                      >
                        {combo.status === "Served"
                          ? "Already Served"
                          : "Mark as Served"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default KitchenOrders;

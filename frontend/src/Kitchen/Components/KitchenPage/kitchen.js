import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./kitchen.css";
import KitchenNavBar from "../KitchenNavbar/kitchenNavbar";

const KitchenPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({
    all: [],
    few: [],
    none: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://qr-scanning-server.netlify.app/cart/items")
      .then((response) => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const statuses = { all: [], few: [], none: [] };

      cartItems.forEach((item) => {
        const allFoodItems = [...item.items, ...item.combos];
        const allFinished = allFoodItems.every(
          (foodItem) => foodItem.status === "Served"
        );
        const anyFinished = allFoodItems.some(
          (foodItem) => foodItem.status === "Served"
        );

        if (allFinished) statuses.all.push(item._id);
        else if (anyFinished) statuses.few.push(item._id);
        else statuses.none.push(item._id);
      });

      setItemStatuses(statuses);
    }
  }, [cartItems]);

  const handleFinishClick = (foodItemIndex, isCombo = false) => {
    if (selectedIndex !== null) {
      const cartItemId = cartItems[selectedIndex]._id;
      const selectedItem = cartItems[selectedIndex];
      let foodItem;

      // If it's a combo, access the combo array, otherwise access the items array
      if (isCombo) {
        foodItem = selectedItem.combos[foodItemIndex];
      } else {
        foodItem = selectedItem.items[foodItemIndex];
      }

      if (foodItem) {
        const url = `https://qr-scanning-server.netlify.app/cart/cartitems/${cartItemId}/item/${foodItem._id}`;
        console.log("Sending request to update:", url);
        axios
          .put(url)
          .then((response) => {
            console.log("Status updated successfully:", response.data);
            setCartItems((prevItems) =>
              prevItems.map((item) =>
                item._id === cartItemId
                  ? {
                      ...item,
                      items: item.items.map((i) =>
                        i._id === foodItem._id ? { ...i, status: "Served" } : i
                      ),
                      combos: item.combos.map((c) =>
                        c._id === foodItem._id ? { ...c, status: "Served" } : c
                      ),
                    }
                  : item
              )
            );
          })
          .catch((error) => {
            console.error("Error updating item status:", error);
            alert("Failed to update item status. Please try again later.");
          });
      } else {
        console.error("Food item not found at index", foodItemIndex);
      }
    } else {
      console.error("No selected index available.");
    }
  };

  const handleCardClick = (index) => setSelectedIndex(index);

  const getCardClass = (itemId) => {
    if (itemStatuses.all.includes(itemId)) return "bg-success";
    if (itemStatuses.few.includes(itemId)) return "bg-warning";
    if (itemStatuses.none.includes(itemId)) return "bg-danger";
    return "";
  };

  const selectedItem = selectedIndex !== null ? cartItems[selectedIndex] : null;

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error)
    return <div className="text-center my-4 text-danger">Error: {error}</div>;

  return (
    <>
      <KitchenNavBar />
      <div className="containers">
        <div className="left-box">
          <span className="order-header">Order List</span>
          <div className="orders-list">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="order-box"
                  onClick={() => handleCardClick(index)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`card ${getCardClass(item._id)}`}>
                    <div className="card-body text-center">
                      <p className="card-text" style={{ fontSize: "1.25rem" }}>
                        Table Number: {item.tableNumber}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">No orders available</div>
            )}
          </div>
        </div>
        <div className="right-box">
          {selectedItem && (
            <div className="flex-grow-1" style={{ width: "70%" }}>
              <div style={{ maxWidth: "800px", margin: "auto" }}>
                <div className="card-body">
                  <p className="card-text">
                    <strong>Table Number:</strong> {selectedItem.tableNumber}
                  </p>
                  <div className="mb-4">
                    <h6>Ordered Food Items</h6>
                    {selectedItem.items.length > 0 ||
                    selectedItem.combos.length > 0 ? (
                      <div className="row">
                        {/* Regular Items */}
                        {selectedItem.items.map((foodItem, idx) => (
                          <div key={idx} className="col-md-4 mb-4">
                            <div
                              className={`card ${
                                foodItem.status === "Served"
                                  ? "bg-success text-light"
                                  : "bg-danger text-white"
                              }`}
                            >
                              <div className="card-body cards">
                                <h5 className="card-title">{foodItem.name}</h5>
                                <p
                                  className="card-text"
                                  style={{ fontSize: "2.25rem" }}
                                >
                                  <strong>Count:</strong> {foodItem.count}
                                </p>
                                <p className="card-text">
                                  <strong>Status:</strong> {foodItem.status}
                                </p>
                                {foodItem.status !== "Served" && (
                                  <button
                                    className="btn blinking-button"
                                    onClick={
                                      () => handleFinishClick(idx, false) // false for regular items
                                    }
                                  >
                                    Mark as Served
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Combo Items */}
                        {selectedItem.combos.map((foodItem, idx) => (
                          <div
                            key={selectedItem.items.length + idx}
                            className="col-md-4 mb-4"
                          >
                            <div
                              className={`card ${
                                foodItem.status === "Served"
                                  ? "bg-success text-light"
                                  : "bg-danger text-white"
                              }`}
                            >
                              <div className="card-body cards">
                                <h5 className="card-title">
                                  {foodItem.name} <br /> <br />
                                  {foodItem.items.map((item, index) => (
                                    <span key={index}>
                                      {item.name} - {item.quantity}
                                      {index < foodItem.items.length - 1 &&
                                        ", "}
                                      <br />
                                    </span>
                                  ))}
                                </h5>
                                <p
                                  className="card-text"
                                  style={{ fontSize: "2.25rem" }}
                                >
                                  <strong>Count:</strong> {foodItem.count}
                                </p>
                                <p className="card-text">
                                  <strong>Status:</strong> {foodItem.status}
                                </p>
                                {foodItem.status !== "Served" && (
                                  <button
                                    className="btn blinking-button"
                                    onClick={
                                      () => handleFinishClick(idx, true) // true for combo items
                                    }
                                  >
                                    Mark as Served
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No food items available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KitchenPage;

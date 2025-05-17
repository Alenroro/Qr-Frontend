import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import KitchenNavBar from "../KitchenNavbar/kitchenNavbar";
import { Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { setFoodItemImages } from "../../../SlicesFolder/Slices/menuSlice";
import "./kitchenStocks.css";

// FoodItemCard Component for better code structure
const FoodItemCard = ({ item, onToggle }) => (
  <Col className="d-flex align-items-stretch">
    <Card
      className="food-item-card"
      style={{
        backgroundColor:
          item.availability === "available" ? "#d4edda" : "#f8d7da",
      }}
    >
      <Card.Img
        variant="top"
        src={item.typeImageUrl}
        className="food-item-image"
        style={{
          width: "200px",
          height: "200px",
          objectFit: "cover",
        }}
        alt={item.typeName}
      />
      <Card.Body>
        <Card.Title>
          {item.typeName} - {item.stock}
        </Card.Title>
        <label className="switch">
          <input
            type="checkbox"
            checked={item.availability === "available"}
            onChange={() => onToggle(item.typeId, item.availability)}
            aria-label={`Toggle availability for ${item.typeName}`}
          />
          <span className="slider"></span>
        </label>
      </Card.Body>
    </Card>
  </Col>
);

// ComboCard Component for better code structure
const ComboCard = ({ combo, onToggle }) => (
  <Col className="d-flex align-items-stretch">
    <Card
      className="food-item-card"
      style={{
        backgroundColor:
          combo.availability === "available" ? "#d4edda" : "#f8d7da",
      }}
    >
      <Card.Img
        variant="top"
        src={combo.comboImageUrl}
        className="food-item-image"
        style={{
          width: "200px",
          height: "200px",
          objectFit: "cover",
        }}
        alt={combo.comboName}
      />
      <Card.Body>
        <Card.Title>{combo.comboName}</Card.Title>
        <label className="switch">
          <input
            type="checkbox"
            checked={combo.availability === "available"}
            onChange={() => onToggle(combo.comboId, combo.availability, true)}
            aria-label={`Toggle availability for ${combo.comboName}`}
          />
          <span className="slider"></span>
        </label>
      </Card.Body>
    </Card>
  </Col>
);

const KitchenStocks = () => {
  const dispatch = useDispatch();
  const [foodItems, setFoodItems] = useState([]);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle error state

  const fetchFoodItemsImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset previous errors
      const foodItemsResponse = await axios.get(
        "https://qr-backend-server.onrender.com/menu/stocks"
      );
      const foodItemsData = foodItemsResponse.data;
      const foodItemsUrls = foodItemsData.map((item) => ({
        typeName: item.name,
        typeImageUrl: `https://qr-backend-server.onrender.com/files/image/${item.imageId}`,
        typePrice: item.price,
        categoryName: item.categoryName,
        typeId: item._id,
        type: item.type,
        stock: item.stock,
        availability: item.availability,
      }));
      dispatch(setFoodItemImages(foodItemsUrls));
      setFoodItems(foodItemsUrls);

      const comboResponse = await axios.get(
        "https://qr-backend-server.onrender.com/combos/combo"
      );
      const comboData = comboResponse.data;
      const comboUrls = comboData.map((item) => ({
        comboName: item.comboName,
        comboImageUrl: `https://qr-backend-server.onrender.com/combos/image/${item.comboImage}`,
        comboPrice: item.comboPrice,
        comboCategoryName: item.comboCategoryName,
        comboId: item._id,
        availability: item.availability,
      }));
      setCombos(comboUrls);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFoodItemsImages();
  }, [fetchFoodItemsImages]);

  const handleToggleChange = (id, currentAvailability, isCombo = false) => {
    const newStatus =
      currentAvailability === "available" ? "not available" : "available";
    updateAvailability(id, newStatus, isCombo);
  };

  const updateAvailability = async (id, newStatus, isCombo = false) => {
    try {
      const url = isCombo
        ? `https://qr-backend-server.onrender.com/combos/stocks/${id}` // Combo URL
        : `https://qr-backend-server.onrender.com/menu/stocks/${id}`; // Food Item URL

      await axios.patch(url, { availability: newStatus });

      if (isCombo) {
        setCombos((prevCombos) =>
          prevCombos.map((combo) =>
            combo.comboId === id ? { ...combo, availability: newStatus } : combo
          )
        );
      } else {
        setFoodItems((prevItems) =>
          prevItems.map((item) =>
            item.typeId === id ? { ...item, availability: newStatus } : item
          )
        );
      }
    } catch (error) {
      setError("Error updating availability. Please try again.");
      console.error("Error updating availability:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <KitchenNavBar />
      <h2 className="stocks-head">Stock Page</h2>
      <div className="food-items-container">
        {error && <Alert variant="danger">{error}</Alert>}

        {foodItems.length > 0 && (
          <div>
            <h3>Food Items</h3>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {foodItems.map((item) => (
                <FoodItemCard
                  key={item.typeId}
                  item={item}
                  onToggle={handleToggleChange}
                />
              ))}
            </Row>
          </div>
        )}

        {combos.length > 0 && (
          <div>
            <h3>Combos</h3>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {combos.map((combo) => (
                <ComboCard
                  key={combo.comboId}
                  combo={combo}
                  onToggle={handleToggleChange}
                />
              ))}
            </Row>
          </div>
        )}
      </div>
    </>
  );
};

export default KitchenStocks;

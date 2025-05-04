import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import "./editBox.css";

const EditBox = ({ args, item }) => {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    type: "",
    categoryName: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://qr-backend-application.onrender.com/categories/category"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    if (item) {
      setFormData({
        name: item.name || "",
        stock: item.stock || "",
        price: item.price || "",
        type: item.type || "",
        categoryName: item.categoryName || "",
      });
    }
  }, [item]);

  const toggle = () => setModal(!modal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://qr-backend-application.onrender.com/menu/edit",
        {
          ...formData,
          _id: item._id,
        }
      );
  
      if (response.status === 200) {
        alert(response.data.message);
        toggle();
      } else {
        alert("SORRY, Failed To Update Item");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert("An error occurred");
    }
  };
  

  return (
    <div>
      <Button color="danger" onClick={toggle} className="edit-button">
        <MdEdit className="edit-icon" />
      </Button>
      <Modal
        isOpen={modal}
        toggle={toggle}
        modalTransition={{ timeout: 600 }}
        backdropTransition={{ timeout: 800 }}
        {...args}
      >
        <ModalHeader toggle={toggle}>Edit Item</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="edit-form">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />

            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />

            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select a type</option>
              <option value="Veg">Veg</option>
              <option value="Non Veg">Non Veg</option>
            </select>

            <label htmlFor="categoryName">Category</label>
            <select
              name="categoryName"
              id="categoryName"
              className="scrollable-select"
              value={formData.categoryName}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default EditBox;

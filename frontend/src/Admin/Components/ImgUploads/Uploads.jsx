import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./uploads.css";

const Uploads = () => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [availability, setAvailability] = useState("available");
  const [comboItems, setComboItems] = useState([
    { id: Date.now(), name: "", quantity: "" },
  ]);
  const [comboName, setComboName] = useState("");
  const [comboImage, setComboImage] = useState(null);
  const [combos, setCombos] = useState([]);
  const [comboItemType, setComboItemType] = useState({});
  const [comboPrice, setComboPrice] = useState("");
  const [comboType, setComboType] = useState("");

  const imageInputRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://qr-scanning-server.netlify.app/categories/category"
        );

        if (Array.isArray(response.data)) {
          const uniqueCategories = response.data.reduce((acc, current) => {
            if (!acc.some((cat) => cat.categoryName === current.categoryName)) {
              acc.push(current);
            }
            return acc;
          }, []);
          setCategories(uniqueCategories);
        } else {
          console.error("Unexpected data structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await axios.get(
          "https://qr-scanning-server.netlify.app/banner/banners"
        );
        setBanners(response.data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    const fetchCombos = async () => {
      try {
        const response = await axios.get(
          "https://qr-scanning-server.netlify.app/combos/combo"
        );
        setCombos(response.data);
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };
    fetchCombos();
    fetchCategories();
    fetchBanners();
  }, []);

  const handleAddRow = () => {
    setComboItems([...comboItems, { id: Date.now(), name: "", quantity: "" }]);
  };

  const handleDeleteRow = (index) => {
    const updatedItems = comboItems.filter((_, i) => i !== index);
    setComboItems(updatedItems);
    const newComboItemType = { ...comboItemType };
    delete newComboItemType[index];
    setComboItemType(newComboItemType);
  };

  const handleRowChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...comboItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setComboItems(updatedItems);
    setComboItemType((prevState) => ({
      ...prevState,
      [index]: name === "type" ? value : prevState[index],
    }));
  };

  const handleComboSubmit = async (e) => {
    e.preventDefault();

    if (!comboName.trim() || !comboImage || !comboPrice) {
      setError("Please provide all required fields.");
      return;
    }
    if (!comboItems.every((item) => item.name && item.quantity)) {
      setError("Please fill out all combo items.");
      return;
    }

    const formData = new FormData();
    formData.append("comboName", comboName);
    formData.append("comboImage", comboImage);
    formData.append("comboPrice", comboPrice);
    formData.append("comboType", comboType);
    formData.append(
      "comboItems",
      JSON.stringify(
        comboItems.map((item, index) => ({
          name: item.name,
          quantity: item.quantity,
          type: comboItemType[index] || "",
        }))
      )
    );
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      await axios.post(
        "https://qr-scanning-server.netlify.app/combos/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Combo added successfully!");
      setComboName("");
      setComboPrice("");
      setComboType("");
      setComboImage(null);
      setComboItems([{ id: Date.now(), name: "", quantity: "" }]);
      setComboItemType({});
      setError("");
      const updatedCombo = await axios.get(
        "https://qr-scanning-server.netlify.app/combos/combo"
      );
      setCombos(updatedCombo.data);
    } catch (error) {
      console.error(
        "Error uploading combo data:",
        error.response ? error.response.data : error.message
      );
      setError("Error uploading combo data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://qr-scanning-server.netlify.app/combos/${id}`
      );
      alert(response.data.message);
      setCombos(combos.filter((combo) => combo._id !== id));
      const updatedItems = await axios.get(
        "https://qr-scanning-server.netlify.app/combos/combo"
      );
      setCombos(updatedItems.data);
    } catch (error) {
      console.error("Error deleting combo:", error);
      alert("Error deleting combo.");
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!isCategoryFormValid()) {
      return;
    }

    const existingCategory = categories.find(
      (cat) => cat.categoryName === categoryName
    );

    if (existingCategory) {
      alert(
        "Category already exists. Please choose a different category name."
      );
      setError("Category already exists.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("categoryName", categoryName);

    try {
      const response = await axios.post(
        "https://qr-scanning-server.netlify.app/categories/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.message === "Image uploaded successfully") {
        alert("Category uploaded successfully!");

        // Reset form fields and file input
        setCategoryName("");
        setNewImage(null);

        // Clear file input value
        if (imageInputRef.current) {
          imageInputRef.current.value = ""; // Ensure file input value is cleared
        }

        // Refresh categories
        const categoryResponse = await axios.get(
          "https://qr-scanning-server.netlify.app/categories/category"
        );
        setCategories(categoryResponse.data);
      } else {
        setError(response.data.message || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image.");
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("price", price);
    formData.append("categoryName", categoryName);
    formData.append("type", type);
    formData.append("availability", availability);

    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "https://qr-scanning-server.netlify.app/files/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Menu upload successful: " + response.data.message);

      setItemName("");
      setPrice("");
      setCategoryName("");
      setType("");
      setImage(null);
      setAvailability("available");
    } catch (error) {
      console.error("Error uploading menu data:", error);
      setError("Error uploading menu data.");
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerImage) {
      setError("Please select a banner image.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.append("bannerImage", bannerImage);

    try {
      const response = await axios.post(
        "https://qr-scanning-server.netlify.app/banner/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Banner upload successful: " + response.data.message);

      setBannerImage(null);

      const updatedBanners = await axios.get(
        "https://qr-scanning-server.netlify.app/banner/banners"
      );
      setBanners(updatedBanners.data);
    } catch (error) {
      console.error("Error uploading banner image:", error);
      setError("Error uploading banner image.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    console.log("Deleting category with ID:", categoryId);
    if (!categoryId) {
      console.error("No category ID provided for deletion");
      setError("No category ID provided.");
      return;
    }

    try {
      await axios.delete(
        `https://qr-scanning-server.netlify.app/categories/category/${categoryId}`
      );
      alert("Category deleted successfully!");
      const response = await axios.get(
        "https://qr-scanning-server.netlify.app/categories/category"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error deleting category:", error);
      const errorMessage =
        error.response?.status === 404
          ? "Category not found."
          : "An error occurred while deleting the category.";
      setError(errorMessage);
    }
  };

  const handleDeleteBanner = async (fileId) => {
    if (!fileId) {
      console.error("No banner ID provided for deletion");
      setError("No banner ID provided.");
      return;
    }

    try {
      await axios.delete(
        `https://qr-scanning-server.netlify.app/banner/banners/${fileId}`
      );
      alert("Banner deleted successfully!");

      const updatedBanners = await axios.get(
        "https://qr-scanning-server.netlify.app/banner/banners"
      );
      setBanners(updatedBanners.data);
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError("Error deleting banner.");
    }
  };

  const isMenuFormValid = () => {
    return (
      itemName.trim() &&
      price.trim() &&
      categoryName.trim() &&
      type.trim() &&
      image
    );
  };

  const isBannerFormValid = () => {
    return bannerImage;
  };

  const isCategoryFormValid = () => {
    return newImage && categoryName.trim();
  };

  const isComboFormValid = () => {
    if (!comboName?.trim() || !comboImage || !comboPrice || !comboType) {
      return false;
    }

    return comboItems.every(
      (item, index) =>
        item.name?.trim() && item.quantity?.trim() && comboItemType[index]
    );
  };

  return (
    <>
      <div className="upload-page">
        <div className="upload-section">
          {/* --------------------------------------Menu-------------------------------------------- */}
          <div className="menu-add">
            <h2>ADD MENU ITEM</h2>
            <form onSubmit={handleMenuSubmit}>
              <div>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  placeholder="Enter the Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  placeholder="Enter the Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <select
                  id="categoryName"
                  name="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <select
                  id="type"
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Veg">Veg</option>
                  <option value="Non Veg">Non Veg</option>
                </select>
              </div>

              <div>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                disabled={!isMenuFormValid()}
                className={`submit-button ${isMenuFormValid() ? "active" : ""}`}
              >
                Submit Menu
              </button>
            </form>
          </div>

          {/* --------------------------------------Combo-------------------------------------------- */}

          {/* Combo Form */}
          <div className="combo-add">
            <h2>ADD COMBO</h2>
            <form onSubmit={handleComboSubmit}>
              <div>
                <input
                  type="text"
                  id="comboName"
                  name="comboName"
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  placeholder="Enter combo name"
                />
              </div>
              <div>
                <input
                  type="number"
                  id="comboPrice"
                  name="comboPrice"
                  value={comboPrice}
                  onChange={(e) => setComboPrice(e.target.value)}
                  placeholder="Enter combo price"
                />
              </div>
              <div>
                <select
                  id="comboType"
                  name="comboType"
                  value={comboType}
                  onChange={(e) => setComboType(e.target.value)}
                >
                  <option value="">Select a type</option>
                  <option value="Veg">Veg</option>
                  <option value="Non Veg">Non Veg</option>
                </select>
              </div>
              <div>
                <input
                  type="file"
                  id="comboImage"
                  name="comboImage"
                  accept="image/*"
                  onChange={(e) => setComboImage(e.target.files[0])}
                />
              </div>
              <div className="dynamic-table">
                <h3>Combo Items</h3>
                <button type="button" onClick={handleAddRow}>
                  Add Row
                </button>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comboItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={item.name}
                            onChange={(e) => handleRowChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            value={item.quantity}
                            onChange={(e) => handleRowChange(e, index)}
                          />
                        </td>
                        <td>
                          <select
                            name="type"
                            value={comboItemType[index] || ""}
                            onChange={(e) => handleRowChange(e, index)}
                          >
                            <option value="">Select a type</option>
                            <option value="Veg">Veg</option>
                            <option value="Non Veg">Non Veg</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="submit"
                disabled={!isComboFormValid()}
                className={`submit-button ${
                  isComboFormValid() ? "active" : ""
                }`}
              >
                Submit Combo
              </button>
            </form>
            <div>
              <h2>Combos</h2>
              <ul>
                {combos.map((combo) => (
                  <li key={combo._id}>
                    <h3>{combo.comboName}</h3>
                    <button onClick={() => handleDelete(combo._id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* -----------------------------------------Banner------------------------------------------ */}

          <div className="banner-add flex">
            <div className="bannerbox">
              <h2>ADD BANNER</h2>
              <form onSubmit={handleBannerSubmit}>
                <div className="form-group">
                  <label htmlFor="bannerImage">Select Banner Image:</label>
                  <input
                    type="file"
                    id="bannerImage"
                    name="bannerImage"
                    accept="image/*"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isBannerFormValid()}
                  className={`submit-button ${
                    isBannerFormValid() ? "active" : ""
                  }`}
                >
                  Submit Banner
                </button>
              </form>
            </div>
            <div className="bannerbox">
              <h2>Existing Banners</h2>
              <div className="banners-list">
                {banners.map((banner) => (
                  <div key={banner._id} className="banner-item">
                    <p>{banner.filename}</p>
                    <button onClick={() => handleDeleteBanner(banner.fileId)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ---------------------------------------category----------------------------------------- */}

        <div className="upload-section category">
          <div className="uploadbox">
            <h2>Upload New Category Image</h2>
            <form onSubmit={handleImageUpload}>
              <div className="form-group">
                <label htmlFor="categoryName">Category Name:</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newImage">Select Image:</label>
                <input
                  type="file"
                  id="newImage"
                  name="newImage"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!isCategoryFormValid()}
                className={`submit-button ${
                  isCategoryFormValid() ? "active" : ""
                }`}
              >
                Submit Category
              </button>
            </form>
          </div>
          <div className="category-list">
            <h2>Categories</h2>
            <ul>
              {categories.map((cat) => (
                <li key={cat._id}>
                  <h3>{cat.categoryName}</h3>
                  <button onClick={() => handleDeleteCategory(cat.categoryId)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
};

export default Uploads;

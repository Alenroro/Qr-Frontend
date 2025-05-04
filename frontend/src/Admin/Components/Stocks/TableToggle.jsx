import React, { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { IoCaretDownSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import EditBox from "./EditBox";
import "./tabletoggle.css";

const TableToggle = () => {
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://qr-backend-application.onrender.com/menu/stocks"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://qr-backend-application.onrender.com/categories/category"
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
  }, []);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [fetchData, fetchCategories]);

  useEffect(() => {
    let filtered = data;

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) =>
          item.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (item) => item.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (item) =>
        (item.name?.toLowerCase() || "").includes(searchTerm) ||
        (item._id?.toLowerCase() || "").includes(searchTerm) ||
        (item.type?.toLowerCase() || "").includes(searchTerm) ||
        (item.categoryName?.toLowerCase() || "").includes(searchTerm)
    );

    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, selectedType, data]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
  };

  const handleDelete = async (_id) => {
    try {
      await axios.post(
        "https://qr-backend-application.onrender.com/menu/delete",
        { _id }
      );
      setData(data.filter((item) => item._id !== _id));
      alert("Item Removed");
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    setShowTable((prevShowTable) => !prevShowTable);
    fetchData();
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th className="btn-sec">
              <button className="btn" onClick={handleToggle}>
                <IoCaretDownSharp />
              </button>
            </th>
            <th className="cntr">
              <select
                name="category"
                id="category"
                className="scrollable-select"
                onChange={handleCategoryChange}
                value={selectedCategory}
              >
                <option value="">FOOD</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </th>
            <th className="cntr">MENU NUMBER</th>
            <th className="cntr">STOCK</th>
            <th className="cntr">PRICE</th>
            <th className="cntr">
              <select
                name="type"
                id="type"
                className="scrollable-select"
                onChange={handleTypeChange}
                value={selectedType}
              >
                <option value="">TYPE</option>
                <option value="Veg">Veg</option>
                <option value="Non Veg">Non Veg</option>
              </select>
            </th>
            <th className="cntr">CATEGORY</th>
            <th className="cntr">ID</th>
            <th colSpan={2} className="cntr"></th>
          </tr>
        </thead>
        {showTable && (
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id}>
                <td className="btn-sec"></td>
                <td className="foodname">{item.name}</td>
                <td className="cntr">{index + 1}</td>
                <td className="cntr">{item.stock}</td>
                <td className="cntr">${item.price}</td>
                <td className="cntr">{item.type || "-"}</td>
                <td className="cntr">{item.categoryName || "-"}</td>
                <td className="cntr">{item._id}</td>
                <td colSpan={2}>
                  <button className="cntr" onClick={() => setSelectedItem(item)}>
                    <EditBox
                      item={selectedItem}
                      onClose={() => setSelectedItem(null)}
                      onEditSuccess={fetchData}
                    />
                  </button>

                  <button
                    className="del-button cntr"
                    onClick={() => handleDelete(item._id)}
                  >
                    <MdDelete className="del-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default TableToggle;

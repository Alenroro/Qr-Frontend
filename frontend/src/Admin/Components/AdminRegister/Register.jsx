import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = [];

    if (!value.name) {
      errors.push("Name is required");
      isValid = false;
    }

    if (!value.email) {
      errors.push("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(value.email)) {
      errors.push("Email is invalid");
      isValid = false;
    }

    if (!value.password) {
      errors.push("Password is required");
      isValid = false;
    } else if (value.password.length < 6) {
      errors.push("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) {
      alert(errors.join("\n"));
    }

    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        "https://qr-backend-application.onrender.com/user/",
        value
      );
      setValue({
        name: "",
        email: "",
        password: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="reg-page">
        <div className="reg-box">
          <form onSubmit={handleRegister}>
            <h2>REGISTER</h2>
            <input
              type="text"
              placeholder="Enter your Name"
              name="name"
              value={value.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={value.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={value.password}
              onChange={handleChange}
            />
            <button type="submit" className="reg-button">
              Register
            </button>
            <button onClick={handleBack} className="back-button">
              Back
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

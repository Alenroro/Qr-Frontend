import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const nav = useNavigate();

  const handleRegister = () => {
    nav("/Register");
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = [];

    if (!loginData.email) {
      errors.push("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.push("Email is invalid");
      isValid = false;
    }

    if (!loginData.password) {
      errors.push("Password is required");
      isValid = false;
    } else if (loginData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) {
      alert(errors.join("\n"));
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let response = await axios.get(
        "https://qr-backend-application.onrender.com/user/login"
      );
      const login = response.data;

      const successLogin = login.find(
        (user) =>
          user.email === loginData.email && user.password === loginData.password
      );
      if (successLogin) {
        localStorage.setItem("emailvalue", loginData.email);
        nav("/stocks");
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          <form onSubmit={handleSubmit}>
            <h1>ADMIN</h1>
            <h2>LOGIN</h2>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
            />
            <button type="submit">Sign In</button>
            <button type="button" onClick={handleRegister}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

import React, { useState, useEffect, useCallback } from "react";
import "./profile.css";
import axios from "axios";
import { RiEdit2Fill } from "react-icons/ri";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const emailData = localStorage.getItem("emailvalue");

  // Memoize fetchData using useCallback
  const fetchData = useCallback(async () => {
    try {
      let response = await axios.get(
        "https://qr-backend-application.onrender.com/user/login"
      );
      const Datas = response.data;
      const successData = Datas.find((data) => data.email === emailData);
      setProfile(successData);
      if (successData) {
        setUpdatedData({
          name: successData.name,
          email: successData.email,
          password: successData.password,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [emailData]); // Add emailData as a dependency if needed

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include fetchData here

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleClick = async (_id) => {
    try {
      await axios.post(
        "https://qr-backend-application.onrender.com/user/edit",
        {
          _id,
          ...updatedData,
        }
      );
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-section">
          <div className="profile-box">
            <header>
              <h2 className="profile-title">PROFILE</h2>
            </header>
            <section>
              <div className="data-head">
                <h3>Personal Data</h3>
                <hr className="clr" />
              </div>
              <form>
                {profile ? (
                  <>
                    <div className="data-box">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={updatedData.name}
                        onChange={handleChange}
                        placeholder="Enter Your Name"
                      />
                    </div>
                    <div className="data-box">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={updatedData.email}
                        onChange={handleChange}
                        placeholder="Enter Your Email"
                      />
                    </div>
                    <div className="data-box">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={updatedData.password}
                        onChange={handleChange}
                        placeholder="Enter Your Password"
                      />
                    </div>
                    <div className="edit-box">
                      <button
                        onClick={() => handleClick(profile._id)}
                        className="edt-button"
                      >
                        <RiEdit2Fill />
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No data Found</p>
                )}
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

import React, { useState } from "react";
import "./Auth.css";
import resetImg from "../../assets/reset.png";
import eyeoImg from "../../assets/eye-open.png";
import eyecImg from "../../assets/eye-close.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../Utilities/Configure";
import Loader from "../../Utilities/Loader/Loader.jsx";
import { addDoc, collection, } from "firebase/firestore";

const Register = () => {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (register.password !== register.cPassword) {
      toast.error(`password don't match`);
    } else {
      setLoading(true);
      try {
      const users = await createUserWithEmailAndPassword(
        auth,
        register.email,
        register.password
      );
      
      const user = {
        name: register.name,
        email: users.user.email,
        uid: users.user.uid,
        role: register.role,
        registrationDate: new Date().toLocaleString(
          'en-US',
          {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          })
      };
      // create user reference on firestore
      const userReference = collection(database, "user");
      // add user detail
      addDoc (userReference, user);
      setRegister({
        name: "",
        email: "",
        password: "",
        cPassword: "",
      });

      navigate('/login')
      toast.success("registration successful")}
       catch (error) {
        toast.error(error.message);
        setLoading(false);
      };
    }
  };

  const togglePasswordVisibility = () => {
    if (register.password === "") {
      toast.warn(`password can't be empty`);
    } else {
      setShowPassword(!showPassword);
    }
  };

  const toggleCPasswordVisibility = () => {
    if (register.cPassword === "") {
      toast.warn(`password can't be empty`);
    } else {
      setShowCPassword(!showCPassword);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <section className="register-container">
        <img src={resetImg} className="register-img" />
        <div className="form-container">
          <h3 className="register-text">Register</h3>
          <form onSubmit={handleSubmit} className="input-form">
            <input
              required
              placeholder="Enter Name"
              type="text"
              value={register.name}
              onChange={(e) =>
                setRegister({ ...register, name: e.target.value })
              }
            />
            <input
              required
              placeholder="Enter email"
              type="email"
              value={register.email}
              onChange={(e) =>
                setRegister({
                  ...register,
                  email: e.target.value,
                })
              }
            />

            <div className="password-input-container">
              <input
                required
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                value={register.password}
                onChange={(e) =>
                  setRegister({
                    ...register,
                    password: e.target.value,
                  })
                }
              />
              <img
                onClick={togglePasswordVisibility}
                src={showPassword ? eyeoImg : eyecImg}
                alt="Toggle Password Visibility"
                className="toggle-password"
              />
            </div>
            <div className="password-input-container">
              <input
                required
                placeholder="Confirm Password"
                type={showCPassword ? "text" : "password"}
                value={register.cPassword}
                onChange={(e) =>
                  setRegister({
                    ...register,
                    cPassword: e.target.value,
                  })
                }
              />
              <img
                onClick={toggleCPasswordVisibility}
                src={showCPassword ? eyeoImg : eyecImg}
                alt="Toggle Password Visibility"
                className="toggle-password"
              />
            </div>

            <button type="submit">Submit</button>
          </form>
          <Link to="/reset" className="register-opacity">
            Reset Password
          </Link>
        </div>
      </section>
    </>
  );
};

export default Register;

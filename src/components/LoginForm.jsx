import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./login.module.css";

const LoginForm = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    emailValid: true,
    passwordValid: true,
  });

  const handleLoginChange = (e, property) => {
    const { value } = e.target;
    setLoginData({ ...loginData, [property]: value });
    if (property === "email") {
      setValidation({
        ...validation,
        emailValid: /^\S+@\S+\.\S+$/.test(value),
      });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.email.trim() === "" || loginData.password.trim() === "") {
      toast.error("Fields must be filled!!!");
      return;
    }

    // Retrieve signup data from local storage
    const storedSignupData = JSON.parse(localStorage.getItem("signupData"));

    if (
      storedSignupData &&
      storedSignupData.email === loginData.email &&
      storedSignupData.password === loginData.password
    ) {
      toast.success("Login Success!!!");
      setLoggedIn(true);
      // Save login data to local storage
      localStorage.setItem("user", JSON.stringify(loginData));
      localStorage.setItem("loggedIn", JSON.stringify(true));

      navigate("/search"); // Navigate back to the previous page
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Log in</div>
        <form className={styles.form} onSubmit={handleLoginSubmit}>
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            name="email"
            value={loginData.email}
            onChange={(e) => handleLoginChange(e, "email")}
            style={{
              borderColor: validation.emailValid ? "initial" : "red",
            }}
          />
          {!validation.emailValid && (
            <span className={styles.error}>Invalid email format</span>
          )}
          <input
            className={styles.input}
            placeholder="Password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={(e) => handleLoginChange(e, "password")}
          />
          <button className={styles.button}>Let's go!</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

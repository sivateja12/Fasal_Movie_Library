import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./login.module.css";

const SignupForm = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    userNameValid: true,
    emailValid: true,
    passwordValid: true,
  });

  const handleSignupChange = (e, property) => {
    const { value } = e.target;
    setSignupData({ ...signupData, [property]: value });
    if (property === "userName") {
      setValidation({
        ...validation,
        userNameValid: value.length >= 3 && value.length <= 50,
      });
    } else if (property === "email") {
      setValidation({
        ...validation,
        emailValid: /^\S+@\S+\.\S+$/.test(value),
      });
    } else if (property === "password") {
      setValidation({ ...validation, passwordValid: value.length >= 6 });
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupData.userName.trim() === "" || signupData.email.trim() === "" || signupData.password.trim() === "") {
      toast.error("Fields must be filled!!!");
      return;
    }

    // Store signup data in local storage
    localStorage.setItem("signupData", JSON.stringify(signupData));

    toast.success("User Registered Successfully!!!", { autoClose: 3000 });
    setIsLogin(true);
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Sign up</div>
        <form className={styles.form} onSubmit={handleSignupSubmit}>
          <input
            className={styles.input}
            placeholder="Name"
            type="text"
            name="userName"
            value={signupData.userName}
            onChange={(e) => handleSignupChange(e, "userName")}
            style={{
              borderColor: validation.userNameValid ? "initial" : "red",
            }}
          />
          {!validation.userNameValid && (
            <span className={styles.error}>Username must be 3-50 characters long</span>
          )}
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            name="email"
            value={signupData.email}
            onChange={(e) => handleSignupChange(e, "email")}
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
            value={signupData.password}
            onChange={(e) => handleSignupChange(e, "password")}
            style={{
              borderColor: validation.passwordValid ? "initial" : "red",
            }}
          />
          {!validation.passwordValid && (
            <span className={styles.error}>Password must be at least 6 characters long</span>
          )}
          <button className={styles.button}>Confirm!</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

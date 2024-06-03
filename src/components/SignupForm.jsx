// src/components/SignupForm.js
import { useState } from "react";
import styles from "./login.module.css";
import { signUp } from "../services/user-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
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

    signUp(signupData)
      .then((res) => {
        toast.success("User Registered Successfully!!!", { autoClose: 3000 });
        setSignupData({
          userName: "",
          email: "",
          password: "",
        });
        setIsLogin(true);
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Registration failed. Please try again. With Unique Email ID");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Sign up</div>
        <form className={styles.form} onSubmit={handleSignupSubmit}>
          <input
            className={styles.input}
            onChange={(e) => handleSignupChange(e, "userName")}
            placeholder="Name"
            type="text"
            value={signupData.userName}
            name="userName"
            style={{
              borderColor: validation.userNameValid ? "initial" : "red",
            }}
          />
          {!validation.userNameValid && (
            <span className={styles.error}>
              Username must be 3-50 characters long
            </span>
          )}
          <input
            className={styles.input}
            onChange={(e) => handleSignupChange(e, "email")}
            name="email"
            placeholder="Email"
            type="email"
            value={signupData.email}
            style={{
              borderColor: validation.emailValid ? "initial" : "red",
            }}
          />
          {!validation.emailValid && (
            <span className={styles.error}>Invalid email format</span>
          )}
          <input
            className={styles.input}
            onChange={(e) => handleSignupChange(e, "password")}
            name="password"
            placeholder="Password"
            type="password"
            value={signupData.password}
            style={{
              borderColor: validation.passwordValid ? "initial" : "red",
            }}
          />
          {!validation.passwordValid && (
            <span className={styles.error}>
              Password must be at least 6 characters long
            </span>
          )}
          <button className={styles.button}>Confirm!</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;

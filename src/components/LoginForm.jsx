// LoginForm.js
import { useState } from "react";
import styles from "./login.module.css";
import { loginUser } from "../services/user-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    loginUser(loginData)
      .then((res) => {
        toast.success("Login Success!!!");
        setLoginData({
          email: "",
          password: "",
        });
        setLoggedIn(true);
        // Save login data to local storage
        localStorage.setItem("user", JSON.stringify(loginData));
        navigate(-1); // Navigate back to the previous page
      })
      .catch((error) => {
        toast.error("Invalid Credentials");
      });
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

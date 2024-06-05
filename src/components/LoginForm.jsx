import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./login.module.css";
import { loginUser } from "../services/user-service";

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

  useEffect(() => {
    // Check if user data exists in local storage and parse it
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setLoginData(userData);
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        // Handle parsing error, e.g., clear invalid user data from local storage
        localStorage.removeItem("user");
      }
    }
  }, []); // Run only once on component mount

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
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loginData.email.trim() === "" || loginData.password.trim() === "") {
      toast.error("Fields must be filled!!!");
      return;
    }

    try {
      const res=await loginUser(loginData);
      console.log(res);
      toast.success("Login Success!!!");
      setLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(loginData));
      localStorage.setItem("loggedIn", JSON.stringify(true));

      // Log user data from local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("User data from local storage:", userData);

      navigate("/search");
      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
      if (redirectAfterLogin) {
        navigate(redirectAfterLogin);
        localStorage.removeItem("redirectAfterLogin");
      } else {
        navigate("/search");
      }
    } catch (error) {
      console.log(error)
      toast.error("Invalid Credentials");
    }
  };

  // const handleLoginSubmit = async (e) => {
  //   e.preventDefault();
  //   if (loginData.email.trim() === "" || loginData.password.trim() === "") {
  //     toast.error("Fields must be filled!!!");
  //     return;
  //   }

  //   try {
  //     await loginUser(loginData);
  //     toast.success("Login Success!!!");
  //     setLoggedIn(true);
  //     localStorage.setItem("user", JSON.stringify(loginData));
  //     localStorage.setItem("loggedIn", JSON.stringify(true));
  //     navigate(-1);
  //     const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
  //     if (redirectAfterLogin) {
  //       navigate(redirectAfterLogin);
  //       localStorage.removeItem("redirectAfterLogin");
  //     } else {
  //       navigate("/search");
  //     }
  //   } catch (error) {
  //     toast.error("Invalid Credentials");
  //   }
  // };

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

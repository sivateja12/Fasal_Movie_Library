import { useState } from "react";
import styles from "./login.module.css";
import { loginUser, signUp } from "../services/user-service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
const Login = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const [signupFormValid, setSignupFormValid] = useState(false);
  const [loginFormValid, setLoginFormValid] = useState(false);
  const [validation, setValidation] = useState({
    userNameValid: true,
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
    setLoginFormValid(loginData.email && loginData.password);
  };

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
    setSignupFormValid(
      signupData.userName && signupData.email && signupData.password
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signupFormValid) {
      signUp(signupData)
        .then((res) => {
          toast.success("User Registered Successfully!!!", { autoClose: 3000 });
          setSignupData({
            userName: "",
            email: "",
            password: "",
          });
          setIsLogin(!isLogin);
        })
        .catch((error) => {
          toast.error("Registration failed. Please try again.");
        });
    } else {
      toast.error("Please fill all fields in the signup form correctly.");
    }
  };
  const handleSubmitSignup=(e)=>{
    e.preventDefault();
    if(signupData.userName.trim()===''||signupData.email.trim()===''|| signupData.password.trim()===''){
      toast.error("Fields must be filled!!!");
      return;
    }

  }
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
          email:"",
          password:"",
        })
        navigate("/"); // or the appropriate route
      })
      .catch((error) => {
        toast.error("Invalid Credentials");
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {isLogin ? (
          <>
            <div className={styles.title}>Log in</div>
            <form
              className={styles.form}
              onSubmit={(e) => handleLoginSubmit(e)}
            >
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
              <button className={styles.button} /*disabled={!loginFormValid}*/>
                Let's go!
              </button>
            </form>
            <button
              className={styles.button}
              onClick={() => setIsLogin(!isLogin)}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            <div className={styles.title}>Sign up</div>
            <form className={styles.form} onSubmit={handleSubmit}>
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
              <button className={styles.button} disabled={(e)=>handleSubmitSignup(e)}/*disabled={!signupFormValid}*/>
                Confirm!
              </button>
            </form>
            <button className={styles.button} onClick={() => setIsLogin(true)}>
              Log in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

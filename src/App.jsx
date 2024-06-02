import "./App.css";
import Header from "./components/header";
import Login from "./components/login";
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Router>
        <ToastContainer />
        <div>
          <Header isLogin={isLogin} setIsLogin={setIsLogin}/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
            <Route path="/signup" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;

// Header.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";
import "./Header.css";

const Header: React.FC = () => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLoginForm = () => {
    setIsLoginFormOpen(!isLoginFormOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('Logout successful');
      localStorage.clear();
      navigate('/', { replace: true });
    } catch (error: any) { 
      console.error('Logout failed');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginFormOpen(false);
  };

  return (
    <header className="header">
      <Link to="/" className="header-link">
        <h1>YETINDER</h1>
      </Link>
      <div className="login-container">
        {localStorage.getItem('isAdmin') || localStorage.getItem('isUser') ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <button className="login-button" onClick={toggleLoginForm}>Login</button>
        )}
        <div className="auth-form">
          {isLoginFormOpen && <AuthForm onLoginSuccess={handleLoginSuccess} />}
        </div>
      </div>
    </header>
  );
};

export default Header;

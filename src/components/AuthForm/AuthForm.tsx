// AuthForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Импортируем объект навигации

interface AuthFormProps {
  onLoginSuccess: () => void; // Функция, которая будет вызвана после успешной авторизации
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate(); // Получаем объект навигации

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', {
        username,
        password,
      });
      console.log('Login successful');
      if (username === 'admin'){
        localStorage.setItem('isAdmin', 'true');
      }
      localStorage.setItem('isUser', 'true');
      onLoginSuccess(); // Вызываем функцию обратного вызова после успешного входа
      navigate('/', { replace: true }); // Перенаправляем на главную страницу
    } catch (error: any) { 
      console.error('Login failed');
      setError('Invalid username or password'); 
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className='button-container'>
          <button type="submit" className="submit-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;

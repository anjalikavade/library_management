// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashBoard from './components/DashBoard';
import EditBook from './components/EditBook';
import AddBook from './components/AddBook';
import GetBooks from './components/GetBooks';
import RegisterStudent from './components/RegisterStudent';
import GetStudents from './components/GetStudents';
import StudentDetails from './components/StudentDetails';
import BorrowedToday from './components/BorrowedToday';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = (username, password) => {
    if (username === 'anjali' && password === '1234') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated ? (
          <>
            <Routes>
              <Route path="/" element={<DashBoard onLogout={handleLogout} />} />
              <Route path="/add-books" element={<AddBook />} />
              <Route path="/get-books" element={<GetBooks />} />
              <Route path="/edit-book/:id" element={<EditBook />} />
              <Route path="/register-student" element={<RegisterStudent />} />
              <Route path="/get-students" element={<GetStudents />} />
              <Route path="/student-details/:id" element={<StudentDetails />} />
              <Route path="/borrowed-today" element={<BorrowedToday />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;

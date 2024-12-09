import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, redirect } from 'react-router-dom';
import LoginAndSignup from './page/LoginAndSignup';
import Profile from './page/Profile';
import PrivateRoute from './middleware/PrivateRoute';
import PublicRoute from './middleware/PublicRoue';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute element={<LoginAndSignup />} redirectTo="profile"/>} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} redirectTo="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

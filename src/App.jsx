import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import AuthLayout from './features/auth/layouts/AuthLayout';
import LostFoundLayout from './features/lost-founds/layouts/LostFoundLayout';

// Pages (di-import langsung agar tidak ada rantai request tambahan;
// ukurannya kecil. Bagian berat -- modal & SweetAlert2 -- tetap lazy-load)
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import HomePage from './features/lost-founds/pages/HomePage';
import DetailPage from './features/lost-founds/pages/DetailPage';
import UsersPage from './features/users/pages/UsersPage';
import ProfilePage from './features/users/pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<LostFoundLayout />}>
          <Route index element={<HomePage />} />
          <Route path="lost-founds/:id" element={<DetailPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
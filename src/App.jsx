import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetAuthUser } from './features/auth/states/authSlice';

// Import Layouts & Pages (placeholder/sesuaikan path jika sudah dibuat)
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import HomePage from './features/lost-founds/pages/HomePage';
import DetailPage from './features/lost-founds/pages/DetailPage';
import UsersPage from './features/users/pages/UsersPage';
import ProfilePage from './features/users/pages/ProfilePage';

import LostFoundLayout from './features/lost-founds/layouts/LostFoundLayout';

const ProtectedRoute = () => {
  const { isAuthLogin } = useSelector((state) => state.auth);
  const token = localStorage.getItem('ACCESS_TOKEN');

  if (!token && !isAuthLogin) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncGetAuthUser());
  }, [dispatch]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LostFoundLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lost-founds" element={<HomePage />} />
          <Route path="/lost-founds/:id" element={<DetailPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
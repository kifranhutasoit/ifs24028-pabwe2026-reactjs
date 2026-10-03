import { Route, Routes } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import LostFoundLayout from "./features/lost-founds/LostFoundLayout";
import HomePage from "./features/lost-founds/HomePage";
import DetailPage from "./features/lost-founds/DetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage mode="login" />} />
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/register" element={<AuthPage mode="register" />} />
      <Route element={<LostFoundLayout />}>
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/lost-founds/:id" element={<DetailPage />} />
      </Route>
    </Routes>
  );
}

import { Outlet, Navigate } from 'react-router-dom';
import { getAccessToken } from '../../../helpers/apiHelper';

export default function AuthLayout() {
  const token = getAccessToken();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <Outlet />
      </div>
    </main>
  );
}
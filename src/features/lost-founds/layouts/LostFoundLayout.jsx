import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import SidebarComponent from '../components/SidebarComponent';
import { getAccessToken } from '../../../helpers/apiHelper';

export default function LostFoundLayout() {
  // Redirect langsung (tanpa menampilkan dashboard dulu) bila belum login
  if (!getAccessToken()) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SidebarComponent />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <NavbarComponent />

        {/* Landmark main untuk aksesibilitas */}
        <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
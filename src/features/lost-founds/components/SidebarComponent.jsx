import { Link, useLocation } from 'react-router-dom';

export default function SidebarComponent() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard / Laporan', path: '/' },
    { name: 'Daftar Pengguna', path: '/users' },
    { name: 'Profil Saya', path: '/profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <span className="text-xl font-bold text-blue-600">Lost&Found</span>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
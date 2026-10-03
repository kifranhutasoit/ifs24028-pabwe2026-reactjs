import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authLogout } from '../../auth/states/authSlice';
import { showSuccessDialog } from '../../../helpers/toolsHelper';

export default function NavbarComponent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogoutHandler = () => {
    dispatch(authLogout());
    showSuccessDialog('Berhasil Keluar', 'Sampai jumpa kembali!');
    navigate('/auth/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <p className="text-lg font-semibold text-slate-800">Lost & Founds Dashboard</p>
      <button
        onClick={onLogoutHandler}
        aria-label="Keluar dari akun"
        className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium rounded-lg text-sm transition"
      >
        Keluar
      </button>
    </header>
  );
}
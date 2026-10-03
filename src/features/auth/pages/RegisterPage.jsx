import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncAuthRegister } from '../states/authSlice';
import useInput from '../../../hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export default function RegisterPage() {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(asyncAuthRegister({ name, email, password }));
    setLoading(false);

    if (asyncAuthRegister.fulfilled.match(result)) {
      showSuccessDialog('Registrasi Berhasil', 'Silakan masuk dengan akun Anda.');
      navigate('/auth/login');
    } else {
      showErrorDialog('Registrasi Gagal', result.payload || 'Terjadi kesalahan');
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Daftar Akun Baru</h1>
        <p className="text-sm text-slate-500">Bergabunglah dengan Sistem Lost & Founds</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-4">
        <div>
          <label htmlFor="register-name-input" className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
          <input
            id="register-name-input"
            type="text"
            value={name}
            onChange={onNameChange}
            required
            aria-label="Nama Lengkap"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Lengkap Anda"
          />
        </div>

        <div>
          <label htmlFor="register-email-input" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="register-email-input"
            type="email"
            value={email}
            onChange={onEmailChange}
            required
            aria-label="Alamat Email"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label htmlFor="register-password-input" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
          <input
            id="register-password-input"
            type="password"
            value={password}
            onChange={onPasswordChange}
            required
            aria-label="Kata Sandi"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          id="register-submit-button"
          type="submit"
          disabled={loading}
          aria-label="Tombol Daftar"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="text-center text-sm text-slate-600 mt-4">
          Sudah punya akun?{' '}
          <Link to="/auth/login" className="text-blue-600 font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
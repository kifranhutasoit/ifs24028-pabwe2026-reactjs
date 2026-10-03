import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncAuthLogin } from '../states/authSlice';
import useInput from '../../../hooks/useInput';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export default function LoginPage() {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(asyncAuthLogin({ email, password }));
    setLoading(false);

    if (asyncAuthLogin.fulfilled.match(result)) {
      showSuccessDialog('Berhasil Masuk', 'Selamat datang kembali!');
      navigate('/');
    } else {
      showErrorDialog('Gagal Masuk', result.payload || 'Terjadi kesalahan');
    }
  };

    return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Masuk ke Akun</h1>
        <p className="text-sm text-slate-500">Sistem Lost & Founds</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-4">
        <div>
          <label htmlFor="login-email-input" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            id="login-email-input"
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
          <label htmlFor="login-password-input" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
          <input
            id="login-password-input"
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
          id="login-submit-button"
          type="submit"
          disabled={loading}
          aria-label="Tombol Masuk"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
        <p className="text-center text-sm text-slate-600 mt-4">
          Belum punya akun?{' '}
          <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </>
  );
}
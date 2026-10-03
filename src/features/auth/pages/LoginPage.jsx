import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncLoginUser } from '../states/authSlice';
import useInput from '../../../hooks/useInput';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle(
    'Masuk ke Akun - Lost & Founds App',
    'Masuk ke akun Lost & Founds App Anda untuk melaporkan dan mencari barang hilang atau temuan dengan cepat dan mudah.'
  );

  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncLoginUser({ email, password }));
    if (asyncLoginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Masuk ke Lost &amp; Founds</h1>
        <p className="text-sm text-slate-700 mb-6 text-center">Silakan masuk untuk melanjutkan laporan</p>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label htmlFor="login-email-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              id="login-email-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={onEmailChange}
              required
              className="w-full px-4 py-3 min-h-[48px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label htmlFor="login-password-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <input
              id="login-password-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={onPasswordChange}
              required
              className="w-full px-4 py-3 min-h-[48px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button
            id="login-submit-button"
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
          <p className="text-center text-sm text-slate-700 mt-4">
            Belum punya akun?{' '}
            <Link to="/auth/register" className="text-blue-700 font-semibold hover:underline inline-block py-1">
              Daftar akun baru
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
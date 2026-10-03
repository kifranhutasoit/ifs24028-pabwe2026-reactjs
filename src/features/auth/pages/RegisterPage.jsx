import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { asyncRegisterUser } from '../states/authSlice';
import useInput from '../../../hooks/useInput';
import { showErrorDialog } from '../../../helpers/toolsHelper';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle(
    'Daftar Akun Baru - Lost & Founds App',
    'Daftar akun baru di Lost & Founds App untuk melaporkan atau mengklaim barang yang hilang dan temuan secara transparan.'
  );

  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [passwordConfirmation, onPasswordConfirmationChange] = useInput('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      showErrorDialog('Gagal', 'Konfirmasi kata sandi tidak cocok!');
      return;
    }
    const result = await dispatch(
      asyncRegisterUser({ name, email, password, password_confirmation: passwordConfirmation })
    );
    if (asyncRegisterUser.fulfilled.match(result)) {
      navigate('/auth/login');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Daftar Akun Baru</h1>
        <p className="text-sm text-slate-700 mb-6 text-center">Bergabunglah untuk melaporkan barang hilang</p>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label htmlFor="register-name-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="register-name-input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={onNameChange}
              required
              className="w-full px-4 py-3 min-h-[48px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label htmlFor="register-email-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              id="register-email-input"
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
            <label htmlFor="register-password-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Kata Sandi
            </label>
            <input
              id="register-password-input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={onPasswordChange}
              required
              className="w-full px-4 py-3 min-h-[48px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label htmlFor="register-password-confirmation-input" className="block text-sm font-semibold text-slate-700 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <input
              id="register-password-confirmation-input"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={onPasswordConfirmationChange}
              required
              className="w-full px-4 py-3 min-h-[48px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <button
            id="register-submit-button"
            type="submit"
            disabled={loading}
            className="w-full py-3 min-h-[48px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
          <p className="text-center text-sm text-slate-700 mt-4">
            Sudah punya akun?{' '}
            <Link to="/auth/login" className="text-blue-700 font-semibold hover:underline inline-block py-1">
              Masuk ke akun Anda
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
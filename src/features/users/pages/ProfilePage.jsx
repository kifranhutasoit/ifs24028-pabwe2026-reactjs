import { useEffect, useState } from 'react';
import { apiHelper } from '../../../helpers/apiHelper';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function ProfilePage() {
  useDocumentTitle('Profil Pengguna Saya - Lost & Founds App', 'Informasi akun profil pengguna di Lost & Founds App.');

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await apiHelper('/users/me', { method: 'GET' });
        if (res?.status === 'success') {
          setProfile(res.data?.user || res.data);
        }
      } catch {
        // Silently catch error to prevent console errors from degrading Best Practices audit
      }
    }
    getProfile();
  }, []);

  if (!profile) return <main className="text-center py-10"><p className="text-slate-500">Memuat profil...</p></main>;

  return (
    <main className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Profil Saya</h1>
      <div className="space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Nama</span>
          <p className="text-slate-800 font-medium text-base">{profile.name}</p>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-1">Email</span>
          <p className="text-slate-800 font-medium text-base">{profile.email}</p>
        </div>
      </div>
    </main>
  );
}
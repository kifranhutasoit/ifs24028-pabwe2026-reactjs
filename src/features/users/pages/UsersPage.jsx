import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetAllUsers } from '../states/userSlice';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function UsersPage() {
  useDocumentTitle('Daftar Pengguna Terdaftar - Lost & Founds App', 'Daftar pengguna terdaftar di platform Lost & Founds App.');

  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncGetAllUsers());
  }, [dispatch]);

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Daftar Pengguna</h1>
      {loading ? (
        <p className="text-center text-slate-500 py-10">Memuat pengguna...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users && users.map((u) => (
            <div key={u.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-800">{u.name}</h2>
              <p className="text-sm text-slate-600">{u.email}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
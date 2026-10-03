import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetUsers } from '../states/userSlice';

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, isUsersLoading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncGetUsers());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Daftar Pengguna Sistem</h1>
      {isUsersLoading ? (
        <p className="text-slate-500">Memuat data pengguna...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
              <img
                src={user.photo || 'https://via.placeholder.com/150'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-semibold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
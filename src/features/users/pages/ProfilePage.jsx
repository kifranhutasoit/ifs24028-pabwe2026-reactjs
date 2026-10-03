import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetProfile, asyncUpdateProfile, asyncUpdatePhoto, asyncUpdatePassword } from '../states/userSlice';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.users);

  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(asyncGetProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
    }
  }, [profile]);

  const onUpdateProfileHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncUpdateProfile({ name }));
    if (asyncUpdateProfile.fulfilled.match(result)) {
      showSuccessDialog('Berhasil', 'Profil berhasil diperbarui');
    } else {
      showErrorDialog('Gagal', result.payload);
    }
  };

  const onUpdatePhotoHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('photo', selectedFile);

    const result = await dispatch(asyncUpdatePhoto(formData));
    if (asyncUpdatePhoto.fulfilled.match(result)) {
      showSuccessDialog('Berhasil', 'Foto profil berhasil diunggah');
      setSelectedFile(null);
    } else {
      showErrorDialog('Gagal', result.payload);
    }
  };

  const onUpdatePasswordHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(asyncUpdatePassword({ old_password: oldPassword, new_password: newPassword }));
    if (asyncUpdatePassword.fulfilled.match(result)) {
      showSuccessDialog('Berhasil', 'Kata sandi berhasil diubah');
      setOldPassword('');
      setNewPassword('');
    } else {
      showErrorDialog('Gagal', result.payload);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800">Profil & Pengaturan Akun</h1>

      {/* Update Info Profil */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Informasi Profil</h2>
        <form onSubmit={onUpdateProfileHandler} className="space-y-4">
          <div>
            <label htmlFor="profile-name-input" className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
            <input
              id="profile-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Perubahan</button>
        </form>
      </div>

      {/* Update Foto */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Foto Profil</h2>
        <form onSubmit={onUpdatePhotoHandler} className="space-y-4">
          <label htmlFor="profile-photo-input" className="block text-sm font-medium text-slate-700 mb-1">Pilih Foto Profil</label>
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button type="submit" disabled={!selectedFile} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Unggah Foto</button>
        </form>
      </div>

      {/* Ganti Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Ganti Kata Sandi</h2>
        <form onSubmit={onUpdatePasswordHandler} className="space-y-4">
          <div>
            <label htmlFor="profile-old-password-input" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Lama</label>
            <input
              id="profile-old-password-input"
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-new-password-input" className="block text-sm font-medium text-slate-700 mb-1">Kata Sandi Baru</label>
            <input
              id="profile-new-password-input"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Ubah Kata Sandi</button>
        </form>
      </div>
    </div>
  );
}
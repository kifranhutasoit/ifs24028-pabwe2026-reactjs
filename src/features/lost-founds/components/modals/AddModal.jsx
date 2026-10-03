import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { asyncAddLostFound, asyncGetLostFounds } from '../../states/lostFoundSlice';
import { showSuccessDialog, showErrorDialog } from '../../../../helpers/toolsHelper';

export default function AddModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(asyncAddLostFound(formData));
      if (asyncAddLostFound.fulfilled.match(resultAction)) {
        showSuccessDialog('Berhasil!', 'Laporan baru berhasil ditambahkan.');
        dispatch(asyncGetLostFounds()); // Refresh data list
        onClose();
        setFormData({ title: '', description: '', type: 'lost', location: '', image: null });
      } else {
        showErrorDialog('Gagal', resultAction.payload || 'Terjadi kesalahan saat menambah laporan.');
      }
    } catch (error) {
      showErrorDialog('Error', 'Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">Tambah Laporan Baru</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Barang</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Contoh: Dompet Hitam Hilang"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Laporan</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
            >
              <option value="lost">Barang Hilang (Lost)</option>
              <option value="found">Barang Ditemukan (Found)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Contoh: Area Parkir / Gedung Kuliah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
              placeholder="Sebutkan ciri-ciri spesifik barang..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Bukti / Cover</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition shadow-md"
            >
              {loading ? 'Menyimpan...' : 'Simpan Laporan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
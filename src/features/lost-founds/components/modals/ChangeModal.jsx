import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { asyncUpdateLostFound, asyncGetLostFoundDetail } from '../../states/lostFoundSlice';
import { showSuccessDialog, showErrorDialog } from '../../../../helpers/toolsHelper';

export default function ChangeModal({ isOpen, onClose, reportData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'lost',
    location: '',
    is_completed: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportData) {
      setFormData({
        title: reportData.title || '',
        description: reportData.description || '',
        type: reportData.type || 'lost',
        location: reportData.location || '',
        is_completed: reportData.is_completed ? 1 : 0,
      });
    }
  }, [reportData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(
        asyncUpdateLostFound({
          id: reportData.id,
          data: {
            ...formData,
            is_completed: Number(formData.is_completed),
          },
        })
      );

      if (asyncUpdateLostFound.fulfilled.match(resultAction)) {
        showSuccessDialog('Berhasil!', 'Laporan berhasil diperbarui.');
        dispatch(asyncGetLostFoundDetail(reportData.id));
        onClose();
      } else {
        showErrorDialog('Gagal', resultAction.payload || 'Gagal memperbarui laporan.');
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
          <h3 className="text-xl font-bold text-gray-800">Ubah Laporan</h3>
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Penyelesaian</label>
            <select
              name="is_completed"
              value={formData.is_completed}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
            >
              <option value={0}>Belum Selesai (Active)</option>
              <option value={1}>Selesai (Completed)</option>
            </select>
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
            ></textarea>
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
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
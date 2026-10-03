import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asyncGetLostFoundDetail, asyncDeleteLostFound } from '../states/lostFoundSlice';
import { formatDate, showConfirmDialog, showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';
const ChangeModal = lazy(() => import('../components/modals/ChangeModal'));
export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { lostFound, loading } = useSelector((state) => state.lostFounds);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(asyncGetLostFoundDetail(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    const isConfirmed = await showConfirmDialog('Hapus Laporan', 'Apakah kamu yakin ingin menghapus laporan ini?');
    if (isConfirmed) {
      const resultAction = await dispatch(asyncDeleteLostFound(id));
      if (asyncDeleteLostFound.fulfilled.match(resultAction)) {
        showSuccessDialog('Terhapus!', 'Laporan berhasil dihapus.');
        navigate('/');
      } else {
        showErrorDialog('Gagal', 'Gagal menghapus laporan.');
      }
    }
  };

  if (loading || !lostFound) {
    return <div className="text-center py-16 text-gray-500">Memuat rincian laporan...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
      >
        &larr; Kembali
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {lostFound.image_url ? (
          <img src={lostFound.image_url} alt={lostFound.title} className="w-full h-80 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">Tidak ada gambar bukti</div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lostFound.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {lostFound.type === 'lost' ? 'Barang Hilang' : 'Barang Ditemukan'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lostFound.is_completed ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                {lostFound.is_completed ? 'Selesai' : 'Aktif'}
              </span>
            </div>
            <span className="text-xs text-gray-400">Dilaporkan pada: {formatDate(lostFound.created_at)}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{lostFound.title}</h1>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Lokasi:</strong> 📍 {lostFound.location}</p>
            <p><strong>Pelapor:</strong> 👤 {lostFound.user?.name || 'Pengguna'}</p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Deskripsi Lengkap</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{lostFound.description}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition shadow-sm"
            >
              Ubah Laporan
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition shadow-sm"
            >
              Hapus Laporan
            </button>
          </div>
        </div>
      </div>

      <ChangeModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} reportData={lostFound} />
    </div>
  );
}
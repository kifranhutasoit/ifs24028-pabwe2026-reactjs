import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncGetLostFounds } from '../states/lostFoundSlice';
const AddModal = lazy(() => import('../components/modals/AddModal'));
import { formatDate } from '../../../helpers/toolsHelper';

export default function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds, loading } = useSelector((state) => state.lostFounds);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    dispatch(
      asyncGetLostFounds({
        type: filterType,
        is_completed: filterStatus,
        search: searchKeyword,
      })
    );
  }, [dispatch, filterType, filterStatus, searchKeyword]);

  return (
    <div className="space-y-6">
      {/* Header & Aksi Cepat */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Barang Hilang & Ditemukan</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau dan kelola laporan kehilangan barang di sekitar kampus.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white font-medium text-sm rounded-lg hover:bg-purple-700 transition shadow-md flex items-center gap-2"
        >
          <span>+ Buat Laporan</span>
        </button>
      </div>

      {/* Filter & Live Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau deskripsi..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          aria-label="Cari berdasarkan judul atau deskripsi"
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter berdasarkan jenis barang"
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
        >
          <option value="">Semua Jenis (Hilang & Temuan)</option>
          <option value="lost">Barang Hilang (Lost)</option>
          <option value="found">Barang Ditemukan (Found)</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter berdasarkan status penyelesaian"
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white"
        >
          <option value="">Semua Status Penyelesaian</option>
          <option value="0">Belum Selesai (Active)</option>
          <option value="1">Selesai (Completed)</option>
        </select>
      </div>

      {/* Daftar Kartu Laporan */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat data laporan...</div>
      ) : lostFounds && lostFounds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostFounds.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">Tidak ada gambar</div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.type === 'lost' ? 'Hilang' : 'Temuan'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.is_completed ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                      {item.is_completed ? 'Selesai' : 'Aktif'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <p className="text-xs text-gray-400">📍 {item.location}</p>
                </div>
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                <span>{formatDate(item.created_at)}</span>
                <Link to={`/lost-founds/${item.id}`} className="px-3 py-1.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition">
                  Detail &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 text-gray-500">
          Belum ada laporan yang tersedia.
        </div>
      )}

      {/* Modal Tambah Laporan */}
      <AddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
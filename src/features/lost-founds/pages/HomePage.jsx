import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { asyncGetLostFounds } from '../states/lostFoundSlice';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle('Beranda Laporan Barang - Lost & Founds App', 'Daftar laporan barang hilang dan barang temuan terkini di kampus.');

  const dispatch = useDispatch();
  const { lostFounds, loading } = useSelector((state) => state.lostFounds);

  useEffect(() => {
    dispatch(asyncGetLostFounds());
  }, [dispatch]);

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Daftar Laporan Barang</h1>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-10">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lostFounds && lostFounds.length > 0 ? (
            lostFounds.map((item) => (
              <Link
                key={item.id}
                to={`/lost-founds/${item.id}`}
                aria-label={`Lihat detail laporan ${item.title || item.name}`}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 block group"
              >
                <article>
                  <h2 className="font-semibold text-lg text-slate-800 mb-2 group-hover:text-blue-700 transition">
                    {item.title || item.name}
                  </h2>
                  <p className="text-sm text-slate-700 line-clamp-2 mb-4">{item.description}</p>
                  <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {item.status || 'Aktif'}
                  </span>
                </article>
              </Link>
            ))
          ) : (
            <p className="text-slate-500 col-span-3 text-center py-10">Belum ada laporan.</p>
          )}
        </div>
      )}
    </main>
  );
}
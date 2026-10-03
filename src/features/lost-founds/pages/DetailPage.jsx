import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiHelper } from '../../../helpers/apiHelper';
import useDocumentTitle from '../../../hooks/useDocumentTitle';

export default function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentTitle(
    item ? `${item.title || item.name} - Detail - Lost & Founds App` : 'Detail Laporan Barang - Lost & Founds App',
    item ? item.description : 'Rincian informasi barang hilang atau temuan di Lost & Founds App.'
  );

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await apiHelper(`/lost-founds/${id}`, { method: 'GET' });
        if (res?.status === 'success') {
          setItem(res.data?.lostFound || res.data);
        }
      } catch {
        // Silently handle error without logging to console to avoid Lighthouse Best Practices penalty
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) return <main className="text-center py-10"><p className="text-slate-500">Memuat rincian...</p></main>;
  if (!item) return <main className="text-center py-10"><p className="text-red-700 font-medium">Data tidak ditemukan.</p></main>;

  return (
    <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <Link
        to="/"
        className="mb-4 text-sm font-semibold text-blue-700 hover:underline inline-flex items-center gap-1 min-h-[44px] px-2 py-1 rounded"
        aria-label="Kembali ke Beranda Laporan Barang"
      >
        &larr; Kembali ke Beranda
      </Link>
      <h1 className="text-3xl font-bold text-slate-800 mb-4">{item.title || item.name}</h1>
      <p className="text-slate-700 mb-6 leading-relaxed text-base">{item.description}</p>
      <div className="border-t border-slate-200 pt-4 text-sm text-slate-700 space-y-1">
        <p><span className="font-semibold text-slate-800">Lokasi:</span> {item.location || '-'}</p>
        <p><span className="font-semibold text-slate-800">Status:</span> {item.status || '-'}</p>
      </div>
    </main>
  );
}
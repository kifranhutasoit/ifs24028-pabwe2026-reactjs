import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { asyncAdd, asyncGetAll } from "./lostFoundSlice";
import { assetUrl } from "../../helpers/apiHelper";
import { formatDate, showErrorDialog, showSuccessDialog } from "../../helpers/toolsHelper";

export default function HomePage() {
  const dispatch = useDispatch();
  const { lostFounds: items, isLostFound } = useSelector((s) => s.lostFounds);
  const [filter, setFilter] = useState({ status: "", is_completed: "", is_me: "" });
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "lost" });

  const load = () => dispatch(asyncGetAll(filter));
  useEffect(() => { dispatch(asyncGetAll(filter)); }, [dispatch, filter]);

  const shown = items.filter((i) => (i.title + i.description).toLowerCase().includes(q.toLowerCase()));
  const stat = [
    ["Total", items.length],
    ["Barang Hilang", items.filter((i) => i.status === "lost").length],
    ["Barang Ditemukan", items.filter((i) => i.status === "found").length],
    ["Selesai", items.filter((i) => i.is_completed).length],
  ];

  async function add(e) {
    e.preventDefault();
    try {
      await dispatch(asyncAdd(form)).unwrap();
      setModal(false); setForm({ title: "", description: "", status: "lost" });
      await showSuccessDialog("Laporan ditambahkan"); load();
    } catch (err) { showErrorDialog(err.message); }
  }
  const sel = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm";
  const inp = "w-full rounded-xl border border-slate-200 px-3 py-2";
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stat.map(([l, v]) => (
          <div key={l} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">{l}</p><p className="text-2xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input className={sel + " flex-1 min-w-40"} placeholder="Cari barang..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={sel} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
          <option value="">Semua jenis</option><option value="lost">Hilang</option><option value="found">Ditemukan</option>
        </select>
        <select className={sel} value={filter.is_completed} onChange={(e) => setFilter({ ...filter, is_completed: e.target.value })}>
          <option value="">Semua status</option><option value="0">Proses</option><option value="1">Selesai</option>
        </select>
        <select className={sel} value={filter.is_me} onChange={(e) => setFilter({ ...filter, is_me: e.target.value })}>
          <option value="">Semua laporan</option><option value="1">Laporan saya</option>
        </select>
        <button onClick={() => setModal(true)} className="flex items-center gap-1 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold"><IconPlus size={18} /> Tambah</button>
      </div>
      {isLostFound && <p className="text-slate-500">Memuat...</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((i) => (
          <Link key={i.id} to={`/lost-founds/${i.id}`} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md">
            {i.cover ? <img src={assetUrl(i.cover)} alt={i.title} className="h-40 w-full object-cover" /> : <div className="h-40 bg-slate-100 grid place-items-center text-slate-400 text-sm">Tanpa foto</div>}
            <div className="p-4 space-y-1">
              <div className="flex gap-2 text-xs font-semibold">
                <span className={`px-2 py-0.5 rounded-full ${i.status === "lost" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{i.status === "lost" ? "Hilang" : "Ditemukan"}</span>
                {i.is_completed ? <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Selesai</span> : null}
              </div>
              <h3 className="font-bold">{i.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{i.description}</p>
              <p className="text-xs text-slate-400">{i.author?.name} · {formatDate(i.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
      {!isLostFound && !shown.length && <p className="text-center text-slate-500">Belum ada laporan.</p>}
      {modal && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4 z-20">
          <form onSubmit={add} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="text-lg font-bold">Tambah Laporan</h2>
            <input className={inp} placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className={inp} rows={3} placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="lost">Hilang</option><option value="found">Ditemukan</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm">Batal</button>
              <button className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

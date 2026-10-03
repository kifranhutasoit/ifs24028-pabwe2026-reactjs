import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { asyncChange, asyncCover, asyncDelete, asyncGetOne } from "./lostFoundSlice";
import { assetUrl } from "../../helpers/apiHelper";
import { formatDate, showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../helpers/toolsHelper";

export default function DetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const item = useSelector((s) => s.lostFounds.lostFound);
  const [edit, setEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => { dispatch(asyncGetOne(id)); }, [dispatch, id]);
  if (!item || String(item.id) !== id) return <p className="text-slate-500">Memuat...</p>;

  const run = async (fn, msg) => {
    try { await fn(); await showSuccessDialog(msg); dispatch(asyncGetOne(id)); }
    catch (err) { showErrorDialog(err.message); }
  };
  const save = (e) => {
    e.preventDefault();
    run(async () => { await dispatch(asyncChange({ id, ...edit, is_completed: edit.is_completed ? 1 : 0 })).unwrap(); setEdit(null); }, "Data diubah");
  };
  const upload = () => run(async () => { await dispatch(asyncCover({ id, file })).unwrap(); setFile(null); setPreview(null); }, "Cover diubah");
  const del = async () => {
    if (!(await showConfirmDialog("Hapus laporan ini?"))) return;
    try { await dispatch(asyncDelete(id)).unwrap(); nav("/"); } catch (err) { showErrorDialog(err.message); }
  };
  const inp = "w-full rounded-xl border border-slate-200 px-3 py-2";
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden max-w-2xl mx-auto">
      {preview || item.cover
        ? <img src={preview || assetUrl(item.cover)} alt={item.title} className="w-full max-h-96 object-cover" />
        : <div className="h-48 bg-slate-100 grid place-items-center text-slate-400">Tanpa foto</div>}
      <div className="p-6 space-y-3">
        {edit ? (
          <form onSubmit={save} className="space-y-3">
            <input className={inp} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} />
            <textarea className={inp} rows={4} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
            <select className={inp} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
              <option value="lost">Hilang</option><option value="found">Ditemukan</option>
            </select>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.is_completed} onChange={(e) => setEdit({ ...edit, is_completed: e.target.checked })} /> Sudah selesai</label>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEdit(null)} className="px-4 py-2 text-sm">Batal</button>
              <button className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Simpan</button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex gap-2 text-xs font-semibold">
              <span className={`px-2 py-0.5 rounded-full ${item.status === "lost" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{item.status === "lost" ? "Hilang" : "Ditemukan"}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100">{item.is_completed ? "Selesai" : "Diproses"}</span>
            </div>
            <h1 className="text-2xl font-extrabold">{item.title}</h1>
            <p className="whitespace-pre-line text-slate-700">{item.description}</p>
            <p className="text-sm text-slate-400">Dilapor oleh {item.author?.name} · {formatDate(item.created_at)}</p>
            <div className="flex flex-wrap gap-2 pt-2 items-center">
              <button onClick={() => setEdit({ title: item.title, description: item.description, status: item.status, is_completed: item.is_completed })} className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">Ubah data</button>
              <label className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold">
                Pilih cover
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
              </label>
              {file && <button onClick={upload} className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold">Unggah cover</button>}
              <button onClick={del} className="rounded-xl bg-rose-600 text-white px-4 py-2 text-sm font-semibold ml-auto">Hapus</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

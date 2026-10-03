import { useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { asyncLogin, asyncRegister } from "./authSlice";
import { getAccessToken } from "../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../helpers/toolsHelper";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const nav = useNavigate();
  if (getAccessToken()) return <Navigate to="/" replace />;
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.email || !f.password || (!isLogin && !f.name)) return showErrorDialog("Semua field wajib diisi");
    try {
      if (isLogin) { await dispatch(asyncLogin(f)).unwrap(); nav("/dashboard"); }
      else { 
        await dispatch(asyncRegister(f)).unwrap(); 
        await dispatch(asyncLogin({ email: f.email, password: f.password })).unwrap();
        nav("/dashboard"); 
      }
    } catch (err) { showErrorDialog(err.message); }
  }
  const input = "w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400";
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 space-y-4">
        <div className="text-center">
          <IconSearch className="mx-auto text-indigo-600" size={36} />
          <h1 className="text-2xl font-extrabold">Delcom Lost &amp; Found</h1>
          <p className="text-sm text-slate-500">{isLogin ? "Masuk ke akun kamu" : "Buat akun baru"}</p>
        </div>
        {!isLogin && <input className={input} placeholder="Nama" value={f.name} onChange={on("name")} />}
        <input id="login-email-input" className={input} type="email" placeholder="Email" value={f.email} onChange={on("email")} />
        <input id="login-password-input" className={input} type="password" placeholder="Kata sandi" value={f.password} onChange={on("password")} />
        <button id="login-submit-button" className="w-full rounded-xl bg-indigo-600 text-white font-semibold py-2.5 hover:bg-indigo-700">{isLogin ? "Masuk" : "Daftar"}</button>
        <p className="text-center text-sm text-slate-500">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <a className="text-indigo-600 font-semibold" href={isLogin ? "/auth/register" : "/auth/login"}>{isLogin ? "Daftar" : "Masuk"}</a>
        </p>
      </form>
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import { IconLogout, IconSearch } from "@tabler/icons-react";
import { asyncMe, isAuthLogout } from "../auth/authSlice";
import { getAccessToken } from "../../helpers/apiHelper";

export default function LostFoundLayout() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const token = getAccessToken();
  useEffect(() => { if (token) dispatch(asyncMe()); }, [dispatch, token]);
  if (!token) return <Navigate to="/auth/login" replace />;
  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-indigo-600"><IconSearch /> Lost &amp; Found</Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">{user?.name}</span>
            <button onClick={() => dispatch(isAuthLogout())} className="flex items-center gap-1 text-rose-600 font-semibold">
              <IconLogout size={18} /> Keluar
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4"><Outlet /></main>
    </>
  );
}

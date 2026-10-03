import Swal from "sweetalert2";
export const showSuccessDialog = (text) => Swal.fire({ icon: "success", title: "Berhasil", text, timer: 1500, showConfirmButton: false });
export const showErrorDialog = (text) => Swal.fire({ icon: "error", title: "Gagal", text });
export const showConfirmDialog = async (text) =>
  (await Swal.fire({ icon: "warning", text, showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal" })).isConfirmed;
export const formatDate = (d) => new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

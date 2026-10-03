// SweetAlert2 di-import secara dinamis: hanya diunduh saat dialog pertama kali dipakai
let swalPromise;
const getSwal = () => {
  if (!swalPromise) swalPromise = import('sweetalert2').then((m) => m.default);
  return swalPromise;
};

export const showSuccessDialog = async (title, text) => {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showErrorDialog = async (title, text) => {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'error',
    title,
    text,
  });
};

export const showWarningDialog = async (title, text) => {
  const Swal = await getSwal();
  return Swal.fire({
    icon: 'warning',
    title,
    text,
  });
};

export const showConfirmDialog = async (title, text, confirmButtonText = 'Ya, lanjutkan!') => {
  const Swal = await getSwal();
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#aa3bff',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText: 'Batal',
  });
  return result.isConfirmed;
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};
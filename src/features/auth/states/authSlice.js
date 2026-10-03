import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, getMe } from '../api/authApi';
import { getAccessToken, putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export const asyncLoginUser = createAsyncThunk(
  'auth/asyncLoginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await login({ email, password });
      if (response.status === 'success') {
        putAccessToken(response.data.token);
        showSuccessDialog('Berhasil Masuk!', 'Selamat datang kembali.');
        return response.data;
      } else {
        showErrorDialog('Gagal Masuk', response.message || 'Periksa kembali email dan kata sandi Anda.');
        return thunkAPI.rejectWithValue(response.message);
      }
    } catch (error) {
      showErrorDialog('Terjadi Kesalahan', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const asyncRegisterUser = createAsyncThunk(
  'auth/asyncRegisterUser',
  async ({ name, email, password, password_confirmation }, thunkAPI) => {
    try {
      const response = await register({ name, email, password, password_confirmation });
      if (response.status === 'success') {
        showSuccessDialog('Registrasi Berhasil!', 'Silakan masuk menggunakan akun baru Anda.');
        return response.data;
      } else {
        showErrorDialog('Gagal Registrasi', response.message || 'Periksa kembali data pendaftaran Anda.');
        return thunkAPI.rejectWithValue(response.message);
      }
    } catch (error) {
      showErrorDialog('Terjadi Kesalahan', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const asyncGetAuthUser = createAsyncThunk(
  'auth/asyncGetAuthUser',
  async (_, thunkAPI) => {
    try {
      const token = getAccessToken();
      if (!token) return thunkAPI.rejectWithValue('Token tidak ditemukan');
      
      const response = await getMe();
      if (response.status === 'success') {
        return response.data;
      } else {
        removeAccessToken();
        return thunkAPI.rejectWithValue(response.message);
      }
    } catch (error) {
      removeAccessToken();
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    isAuthLogin: false,
    isAuthRegister: false,
    loading: false,
  },
  reducers: {
    authLogout: (state) => {
      removeAccessToken();
      state.authUser = null;
      state.isAuthLogin = false;
      showSuccessDialog('Berhasil Keluar', 'Anda telah keluar dari sesi.');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(asyncLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload.user || action.payload;
        state.isAuthLogin = true;
      })
      .addCase(asyncLoginUser.rejected, (state) => {
        state.loading = false;
        state.isAuthLogin = false;
      })
      // Register
      .addCase(asyncRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncRegisterUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthRegister = true;
      })
      .addCase(asyncRegisterUser.rejected, (state) => {
        state.loading = false;
        state.isAuthRegister = false;
      })
      // Get Me (Session Check)
      .addCase(asyncGetAuthUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isAuthLogin = true;
      })
      .addCase(asyncGetAuthUser.rejected, (state) => {
        state.authUser = null;
        state.isAuthLogin = false;
      });
  },
});

export const { authLogout } = authSlice.actions;
export default authSlice.reducer;
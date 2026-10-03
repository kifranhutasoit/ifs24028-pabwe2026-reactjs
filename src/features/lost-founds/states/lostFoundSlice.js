import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/lostFoundApi';
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";

export const asyncGetLostFounds = createAsyncThunk('lostFounds/asyncGetLostFounds', async (params, thunkAPI) => {
  try {
    const res = await api.getLostFounds(params);
    if (res.status === 'success') return res.data.lost_founds;
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const asyncGetLostFoundDetail = createAsyncThunk('lostFounds/asyncGetLostFoundDetail', async (id, thunkAPI) => {
  try {
    const res = await api.getLostFoundDetail(id);
    if (res.status === 'success') return res.data.lost_found;
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const asyncAddLostFound = createAsyncThunk('lostFounds/asyncAddLostFound', async (data, thunkAPI) => {
  try {
    const res = await api.addLostFound(data);
    if (res.status === 'success') {
      showSuccessDialog('Berhasil', 'Laporan baru berhasil ditambahkan.');
      return res.data.lost_found;
    }
    showErrorDialog('Gagal', res.message);
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    showErrorDialog('Kesalahan', err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const asyncUpdateLostFound = createAsyncThunk('lostFounds/asyncUpdateLostFound', async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.updateLostFound(id, data);
    if (res.status === 'success') {
      showSuccessDialog('Berhasil', 'Laporan berhasil diperbarui.');
      return res.data.lost_found;
    }
    showErrorDialog('Gagal', res.message);
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    showErrorDialog('Kesalahan', err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const asyncUpdateCover = createAsyncThunk('lostFounds/asyncUpdateCover', async ({ id, formData }, thunkAPI) => {
  try {
    const res = await api.updateLostFoundCover(id, formData);
    if (res.status === 'success') {
      showSuccessDialog('Berhasil', 'Foto cover berhasil diperbarui.');
      return res.data.lost_found;
    }
    showErrorDialog('Gagal', res.message);
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    showErrorDialog('Kesalahan', err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const asyncDeleteLostFound = createAsyncThunk('lostFounds/asyncDeleteLostFound', async (id, thunkAPI) => {
  try {
    const res = await api.deleteLostFound(id);
    if (res.status === 'success') {
      showSuccessDialog('Dihapus', 'Laporan berhasil dihapus.');
      return id;
    }
    showErrorDialog('Gagal', res.message);
    return thunkAPI.rejectWithValue(res.message);
  } catch (err) {
    showErrorDialog('Kesalahan', err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

const lostFoundSlice = createSlice({
  name: 'lostFounds',
  initialState: {
    lostFounds: [],
    lostFound: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetLostFounds.fulfilled, (state, action) => {
        state.lostFounds = action.payload;
      })
      .addCase(asyncGetLostFoundDetail.fulfilled, (state, action) => {
        state.lostFound = action.payload;
      });
  },
});

export default lostFoundSlice.reducer;
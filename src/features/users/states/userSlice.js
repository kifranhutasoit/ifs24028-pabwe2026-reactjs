import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers, getProfileMe, updateProfile, updateProfilePhoto, updatePassword } from '../api/userApi';
import { showSuccessDialog, showErrorDialog } from "@/helpers/toolsHelper";
export const asyncGetAllUsers = createAsyncThunk('users/asyncGetAllUsers', async (_, thunkAPI) => {
  try {
    const response = await getAllUsers();
    if (response.status === 'success') return response.data.users;
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncGetProfileMe = createAsyncThunk('users/asyncGetProfileMe', async (_, thunkAPI) => {
  try {
    const response = await getProfileMe();
    if (response.status === 'success') return response.data.user;
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdateProfile = createAsyncThunk('users/asyncUpdateProfile', async ({ name }, thunkAPI) => {
  try {
    const response = await updateProfile({ name });
    if (response.status === 'success') {
      showSuccessDialog('Profil Diperbarui', 'Informasi profil berhasil disimpan.');
      return response.data.user;
    }
    showErrorDialog('Gagal', response.message);
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    showErrorDialog('Kesalahan', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdateProfilePhoto = createAsyncThunk('users/asyncUpdateProfilePhoto', async (formData, thunkAPI) => {
  try {
    const response = await updateProfilePhoto(formData);
    if (response.status === 'success') {
      showSuccessDialog('Foto Berhasil Diunggah', 'Avatar profil Anda telah diperbarui.');
      return response.data.user;
    }
    showErrorDialog('Gagal Unggah', response.message);
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    showErrorDialog('Kesalahan', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdatePassword = createAsyncThunk('users/asyncUpdatePassword', async (passData, thunkAPI) => {
  try {
    const response = await updatePassword(passData);
    if (response.status === 'success') {
      showSuccessDialog('Kata Sandi Diubah', 'Sandi baru berhasil disimpan.');
      return response.message;
    }
    showErrorDialog('Gagal', response.message);
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    showErrorDialog('Kesalahan', error.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    profile: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(asyncGetProfileMe.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(asyncUpdateProfilePhoto.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export default userSlice.reducer;
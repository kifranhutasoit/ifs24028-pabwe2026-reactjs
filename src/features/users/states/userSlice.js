import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../api/userApi';

export const asyncGetUsers = createAsyncThunk('users/getAll', async (_, thunkAPI) => {
  try {
    const response = await userApi.getAllUsers();
    if (response.success) {
      return response.data.users;
    }
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncGetProfile = createAsyncThunk('users/getProfile', async (_, thunkAPI) => {
  try {
    const response = await userApi.getProfile();
    if (response.success) {
      return response.data.user;
    }
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdateProfile = createAsyncThunk('users/updateProfile', async ({ name }, thunkAPI) => {
  try {
    const response = await userApi.updateProfile({ name });
    if (response.success) {
      return response.data.user;
    }
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdatePhoto = createAsyncThunk('users/updatePhoto', async (formData, thunkAPI) => {
  try {
    const response = await userApi.updatePhoto(formData);
    if (response.success) {
      return response.data.user;
    }
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const asyncUpdatePassword = createAsyncThunk('users/updatePassword', async ({ old_password, new_password }, thunkAPI) => {
  try {
    const response = await userApi.updatePassword({ old_password, new_password });
    if (response.success) {
      return response.message;
    }
    return thunkAPI.rejectWithValue(response.message);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const initialState = {
  users: [],
  profile: null,
  isUsersLoading: false,
  isProfileLoading: false,
  isChangeProfile: false,
  isChangeProfilePhoto: false,
  isChangeProfilePassword: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(asyncGetUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(asyncGetUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(asyncGetUsers.rejected, (state, action) => {
        state.isUsersLoading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(asyncGetProfile.pending, (state) => {
        state.isProfileLoading = true;
      })
      .addCase(asyncGetProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload;
      })
      .addCase(asyncGetProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(asyncUpdateProfile.pending, (state) => {
        state.isChangeProfile = true;
      })
      .addCase(asyncUpdateProfile.fulfilled, (state, action) => {
        state.isChangeProfile = false;
        state.profile = action.payload;
      })
      .addCase(asyncUpdateProfile.rejected, (state, action) => {
        state.isChangeProfile = false;
        state.error = action.payload;
      })
      // Update Photo
      .addCase(asyncUpdatePhoto.pending, (state) => {
        state.isChangeProfilePhoto = true;
      })
      .addCase(asyncUpdatePhoto.fulfilled, (state, action) => {
        state.isChangeProfilePhoto = false;
        state.profile = action.payload;
      })
      .addCase(asyncUpdatePhoto.rejected, (state, action) => {
        state.isChangeProfilePhoto = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(asyncUpdatePassword.pending, (state) => {
        state.isChangeProfilePassword = true;
      })
      .addCase(asyncUpdatePassword.fulfilled, (state) => {
        state.isChangeProfilePassword = false;
      })
      .addCase(asyncUpdatePassword.rejected, (state, action) => {
        state.isChangeProfilePassword = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
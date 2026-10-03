import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { putAccessToken, getAccessToken } from '../../../helpers/apiHelper';

export const asyncAuthLogin = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        putAccessToken(response.data.token);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const asyncAuthRegister = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await authApi.register({ name, email, password });
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.message);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  authUser: null,
  token: getAccessToken() || null,
  isAuthLogin: false,
  isAuthRegister: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogout: (state) => {
      state.authUser = null;
      state.token = null;
      localStorage.removeItem('accessToken');
    },
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(asyncAuthLogin.pending, (state) => {
        state.isAuthLogin = true;
        state.error = null;
      })
      .addCase(asyncAuthLogin.fulfilled, (state, action) => {
        state.isAuthLogin = false;
        state.token = action.payload.token;
      })
      .addCase(asyncAuthLogin.rejected, (state, action) => {
        state.isAuthLogin = false;
        state.error = action.payload;
      })
      // Register
      .addCase(asyncAuthRegister.pending, (state) => {
        state.isAuthRegister = true;
        state.error = null;
      })
      .addCase(asyncAuthRegister.fulfilled, (state) => {
        state.isAuthRegister = false;
      })
      .addCase(asyncAuthRegister.rejected, (state, action) => {
        state.isAuthRegister = false;
        state.error = action.payload;
      });
  },
});

export const { authLogout, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
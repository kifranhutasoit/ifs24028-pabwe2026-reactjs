import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import lostFoundApi from '../api/lostFoundApi';

// Async Thunks
export const asyncGetLostFounds = createAsyncThunk(
  'lostFounds/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.getAllLostFounds(params);
      return response.lostFounds || response; // Sesuaikan struktur response API
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncGetLostFoundDetail = createAsyncThunk(
  'lostFounds/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.getLostFoundById(id);
      return response.lostFound || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncAddLostFound = createAsyncThunk(
  'lostFounds/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.addLostFound(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdateLostFound = createAsyncThunk(
  'lostFounds/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.updateLostFound(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncUpdateLostFoundCover = createAsyncThunk(
  'lostFounds/updateCover',
  async ({ id, image }, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.updateLostFoundCover(id, image);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncDeleteLostFound = createAsyncThunk(
  'lostFounds/delete',
  async (id, { rejectWithValue }) => {
    try {
      await lostFoundApi.deleteLostFound(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const asyncGetDailyStats = createAsyncThunk(
  'lostFounds/dailyStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lostFoundApi.getDailyStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const lostFoundSlice = createSlice({
  name: 'lostFounds',
  initialState: {
    lostFounds: [],
    lostFound: null,
    stats: null,
    loading: false,
    error: null,
    isLostFoundAdded: false,
    isLostFoundChanged: false,
    isLostFoundDeleted: false,
  },
  reducers: {
    resetMutationStatus: (state) => {
      state.isLostFoundAdded = false;
      state.isLostFoundChanged = false;
      state.isLostFoundDeleted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(asyncGetLostFounds.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncGetLostFounds.fulfilled, (state, action) => {
        state.loading = false;
        state.lostFounds = action.payload;
      })
      .addCase(asyncGetLostFounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Detail
      .addCase(asyncGetLostFoundDetail.fulfilled, (state, action) => {
        state.lostFound = action.payload;
      })
      // Add
      .addCase(asyncAddLostFound.fulfilled, (state) => {
        state.isLostFoundAdded = true;
      })
      // Update & Cover
      .addCase(asyncUpdateLostFound.fulfilled, (state) => {
        state.isLostFoundChanged = true;
      })
      .addCase(asyncUpdateLostFoundCover.fulfilled, (state) => {
        state.isLostFoundChanged = true;
      })
      // Delete
      .addCase(asyncDeleteLostFound.fulfilled, (state, action) => {
        state.isLostFoundDeleted = true;
        state.lostFounds = state.lostFounds.filter((item) => item.id !== action.payload);
      })
      // Stats
      .addCase(asyncGetDailyStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { resetMutationStatus } = lostFoundSlice.actions;
export default lostFoundSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'https://localhost:7256/api/dividends';

// Async actions for API calls

// Fetch all dividends
export const fetchAllDividends = createAsyncThunk(
    'dividends/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data;  // Make sure to return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Fetch dividends by company ID
export const fetchDividendsByCompanyId = createAsyncThunk(
    'dividends/fetchByCompanyId',
    async (companyId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/company/${companyId}`);
            return response.data.map((dividend) => ({
                ...dividend,
                companyName: dividend.company?.name || 'Unknown' 
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Add a new dividend
export const addDividend = createAsyncThunk(
    'dividends/add',
    async (dividend, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_BASE_URL, dividend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update a dividend
export const updateDividend = createAsyncThunk(
    'dividends/update',
    async ({ id, updatedDividend }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, updatedDividend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete a dividend
export const deleteDividend = createAsyncThunk(
    'dividends/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const dividendSlice = createSlice({
    name: 'dividends',
    initialState: {
        dividends: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all dividends
            .addCase(fetchAllDividends.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDividends.fulfilled, (state, action) => {
                state.loading = false;
                state.dividends = action.payload || [];  // Default to empty array if payload is null
            })
            .addCase(fetchAllDividends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Fetch dividends by company ID
            .addCase(fetchDividendsByCompanyId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDividendsByCompanyId.fulfilled, (state, action) => {
                state.loading = false;
                state.dividends = action.payload || [];  // Default to empty array if payload is null
            })
            .addCase(fetchDividendsByCompanyId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Add dividend cases
            .addCase(addDividend.pending, (state) => {
                state.loading = true;
            })
            .addCase(addDividend.fulfilled, (state, action) => {
                state.loading = false;
                state.dividends = [...state.dividends, action.payload];
            })
            .addCase(addDividend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Update dividend cases
            .addCase(updateDividend.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDividend.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.dividends.findIndex((dividend) => dividend.id === action.payload.id);
                if (index !== -1) {
                    state.dividends[index] = action.payload;
                }
            })
            .addCase(updateDividend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            // Delete dividend cases
            .addCase(deleteDividend.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDividend.fulfilled, (state, action) => {
                state.loading = false;
                state.dividends = state.dividends.filter((dividend) => dividend.id !== action.payload);
            })
            .addCase(deleteDividend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

// Selectors
export const selectDividends = (state) => state.dividends?.dividends || [];
export const selectDividendLoading = (state) => state.dividends?.loading || false;
export const selectDividendError = (state) => state.dividends?.error || null;

export default dividendSlice.reducer;

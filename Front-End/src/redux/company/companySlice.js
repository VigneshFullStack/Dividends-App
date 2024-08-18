import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the API base URL
const API_BASE_URL = 'https://localhost:7256/api/companies';

// Async actions for API calls

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch companies';
            return rejectWithValue(message);
        }
    }
);

// Add a new company
export const addCompany = createAsyncThunk(
    'companies/addCompany',
    async (company, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_BASE_URL, company, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add company';
            return rejectWithValue(message);
        }
    }
);

// Update a company by ID
export const updateCompany = createAsyncThunk(
    'companies/updateCompany',
    async ({ id, company }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, company, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || `Failed to update company with ID: ${id}`;
            return rejectWithValue(message);
        }
    }
);

// Delete a company by ID
export const deleteCompany = createAsyncThunk(
    'companies/deleteCompany',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${id}`);
            return id;
        } catch (error) {
            const message = error.response?.data?.message || error.message || `Failed to delete company with ID: ${id}`;
            return rejectWithValue(message);
        }
    }
);

const companySlice = createSlice({
    name: 'companies',
    initialState: {
        companies: [],
        selectedCompany: null, 
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedCompany(state, action) {
            state.selectedCompany = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch companies cases
            .addCase(fetchCompanies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add company cases
            .addCase(addCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.companies.push(action.payload);
            })
            .addCase(addCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update company cases
            .addCase(updateCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.companies.findIndex((c) => c.id === action.payload.id);
                if (index !== -1) {
                    state.companies[index] = action.payload;
                }
            })
            .addCase(updateCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete company cases
            .addCase(deleteCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.companies = state.companies.filter((c) => c.id !== action.payload);
            })
            .addCase(deleteCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectCompanies = (state) => state.companies.companies;
export const selectSelectedCompany = (state) => state.companies.selectedCompany;
export const selectLoading = (state) => state.companies.loading;
export const selectError = (state) => state.companies.error;

export const { setSelectedCompany } = companySlice.actions;

export default companySlice.reducer;

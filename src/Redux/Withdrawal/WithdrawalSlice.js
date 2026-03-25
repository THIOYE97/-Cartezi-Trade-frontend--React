
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

// Async Thunks
export const withdrawalRequest = createAsyncThunk(
    "withdrawal/withdrawalRequest",
    async ({ amount, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/withdrawal/${amount}`, null, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("withdrawal ---- ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const proceedWithdrawal = createAsyncThunk(
    "withdrawal/proceedWithdrawal",
    async ({ id, jwt, accept }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/admin/withdrawal/${id}/proceed/${accept}`, null, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("procceed withdrawal ---- ", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const getWithdrawalHistory = createAsyncThunk(
    "withdrawal/getWithdrawalHistory",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/withdrawal', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("get withdrawal history ---- ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getAllWithdrawalRequest = createAsyncThunk(
    "withdrawal/getAllWithdrawalRequest",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/admin/withdrawal', {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("get withdrawal requests ---- ", response.data);
            return response.data;
        } catch (error) {
            console.log("error ", error);
            return rejectWithValue(error.message);
        }
    }
);

export const addPaymentDetails = createAsyncThunk(
    "withdrawal/addPaymentDetails",
    async ({ paymentDetails, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/payment-details`, paymentDetails, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("withdrawal ---- ", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const getPaymentDetails = createAsyncThunk(
    "withdrawal/getPaymentDetails",
    async ({ jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/payment-details`, {
                headers: { Authorization: `Bearer ${jwt}` }
            });
            console.log("get payment details ---- ", response.data);
            return response.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    withdrawal: null,
    history: [],
    loading: false,
    error: null,
    paymentDetails: null, // Fixed capitalization to match logic
    requests: []
};

const withdrawalSlice = createSlice({
    name: "withdrawal",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // withdrawalRequest
            .addCase(withdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawalRequest.fulfilled, (state, action) => {
                state.withdrawal = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(withdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // proceedWithdrawal
            .addCase(proceedWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(proceedWithdrawal.fulfilled, (state, action) => {
                state.requests = state.requests.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.loading = false;
                state.error = null;
            })
            .addCase(proceedWithdrawal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getWithdrawalHistory
            .addCase(getWithdrawalHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWithdrawalHistory.fulfilled, (state, action) => {
                state.history = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getWithdrawalHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllWithdrawalRequest
            .addCase(getAllWithdrawalRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllWithdrawalRequest.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllWithdrawalRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // addPaymentDetails
            .addCase(addPaymentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPaymentDetails.fulfilled, (state, action) => {
                state.paymentDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addPaymentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Fixed error handling
            })

            // getPaymentDetails
            .addCase(getPaymentDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPaymentDetails.fulfilled, (state, action) => {
                state.paymentDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getPaymentDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Fixed error handling
            });
    },
});

export default withdrawalSlice.reducer;

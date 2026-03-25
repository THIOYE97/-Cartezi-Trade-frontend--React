import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

export const getUserWallet = createAsyncThunk(
  "wallet/getUserWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/wallet");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getWalletTransactions = createAsyncThunk(
  "wallet/getWalletTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/wallet/transactions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Crée une Stripe Checkout Session et redirige vers Stripe
export const paymentHandler = createAsyncThunk(
  "wallet/paymentHandler",
  async ({ amount }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/payment/stripe/amount/${amount}`);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Vérifie le statut d'un dépôt après retour de Stripe
export const checkDepositStatus = createAsyncThunk(
  "wallet/checkDepositStatus",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/wallet/deposit/status?order_id=${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const transferMoney = createAsyncThunk(
  "wallet/transferMoney",
  async ({ walletId, reqData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/wallet/${walletId}/transfer`, reqData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  userWallet: null,
  loading: false,
  error: null,
  transactions: [],
  depositStatus: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(getUserWallet.pending, pending)
      .addCase(getUserWallet.fulfilled, (state, action) => {
        state.userWallet = action.payload;
        state.loading = false;
      })
      .addCase(getUserWallet.rejected, rejected)

      .addCase(getWalletTransactions.pending, pending)
      .addCase(getWalletTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(getWalletTransactions.rejected, rejected)

      .addCase(paymentHandler.pending, pending)
      .addCase(paymentHandler.fulfilled, (state) => { state.loading = false; })
      .addCase(paymentHandler.rejected, rejected)

      .addCase(checkDepositStatus.fulfilled, (state, action) => {
        state.depositStatus = action.payload;
      })

      .addCase(transferMoney.pending, pending)
      .addCase(transferMoney.fulfilled, (state, action) => {
        state.userWallet = action.payload;
        state.loading = false;
      })
      .addCase(transferMoney.rejected, rejected);
  },
});

export const { clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
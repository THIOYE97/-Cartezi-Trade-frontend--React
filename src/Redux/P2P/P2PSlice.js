import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

// ── Offres ────────────────────────────────────────────────
export const fetchOffers = createAsyncThunk(
  "p2p/fetchOffers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/p2p/offers", { params });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  "p2p/fetchOfferById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/p2p/offers/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const createOffer = createAsyncThunk(
  "p2p/createOffer",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/p2p/offers", payload);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const updateOfferStatus = createAsyncThunk(
  "p2p/updateOfferStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/offers/${id}/status`, { status });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ── Trades ────────────────────────────────────────────────
export const fetchMyTrades = createAsyncThunk(
  "p2p/fetchMyTrades",
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/p2p/trades/my", {
        params: status ? { status } : {},
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const fetchTradeById = createAsyncThunk(
  "p2p/fetchTradeById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/p2p/trades/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const createTrade = createAsyncThunk(
  "p2p/createTrade",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/p2p/trades", payload);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const lockEscrow = createAsyncThunk(
  "p2p/lockEscrow",
  async ({ tradeId, escrowTxHash }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/trades/${tradeId}/escrow`, {
        escrowTxHash,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const confirmPaymentSent = createAsyncThunk(
  "p2p/confirmPaymentSent",
  async ({ tradeId, paymentProofUrl }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/trades/${tradeId}/payment-sent`, {
        paymentProofUrl,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const completeTrade = createAsyncThunk(
  "p2p/completeTrade",
  async ({ tradeId, releaseTxHash, commissionTxHash }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/trades/${tradeId}/complete`, {
        releaseTxHash,
        commissionTxHash,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const openDispute = createAsyncThunk(
  "p2p/openDispute",
  async ({ tradeId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/trades/${tradeId}/dispute`, {
        reason,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const cancelTrade = createAsyncThunk(
  "p2p/cancelTrade",
  async (tradeId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/p2p/trades/${tradeId}/cancel`);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ── Messages ──────────────────────────────────────────────
export const fetchMessages = createAsyncThunk(
  "p2p/fetchMessages",
  async (tradeId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/p2p/trades/${tradeId}/messages`);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "p2p/sendMessage",
  async ({ tradeId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/p2p/trades/${tradeId}/messages`, {
        content,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ── Rating ────────────────────────────────────────────────
export const rateTrade = createAsyncThunk(
  "p2p/rateTrade",
  async ({ tradeId, score, comment }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/p2p/trades/${tradeId}/rate`, {
        score,
        comment,
      });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────
const p2pSlice = createSlice({
  name: "p2p",
  initialState: {
    offers: [],
    currentOffer: null,
    trades: [],
    currentTrade: null,
    messages: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearCurrentTrade: (state) => { state.currentTrade = null; state.messages = []; },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const actionPending = (state) => { state.actionLoading = true; state.error = null; };
    const rejected = (state, action) => {
      state.loading = false;
      state.actionLoading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchOffers.pending, pending)
      .addCase(fetchOffers.fulfilled, (state, a) => { state.offers = a.payload; state.loading = false; })
      .addCase(fetchOffers.rejected, rejected)

      .addCase(fetchOfferById.pending, pending)
      .addCase(fetchOfferById.fulfilled, (state, a) => { state.currentOffer = a.payload; state.loading = false; })
      .addCase(fetchOfferById.rejected, rejected)

      .addCase(createOffer.pending, actionPending)
      .addCase(createOffer.fulfilled, (state, a) => {
        state.offers.unshift(a.payload);
        state.actionLoading = false;
      })
      .addCase(createOffer.rejected, rejected)

      .addCase(updateOfferStatus.fulfilled, (state, a) => {
        state.offers = state.offers.map((o) =>
          o.id === a.payload.id ? a.payload : o
        );
      })

      .addCase(fetchMyTrades.pending, pending)
      .addCase(fetchMyTrades.fulfilled, (state, a) => { state.trades = a.payload; state.loading = false; })
      .addCase(fetchMyTrades.rejected, rejected)

      .addCase(fetchTradeById.pending, pending)
      .addCase(fetchTradeById.fulfilled, (state, a) => { state.currentTrade = a.payload; state.loading = false; })
      .addCase(fetchTradeById.rejected, rejected)

      .addCase(createTrade.pending, actionPending)
      .addCase(createTrade.fulfilled, (state, a) => {
        state.currentTrade = a.payload;
        state.actionLoading = false;
      })
      .addCase(createTrade.rejected, rejected)

      .addCase(lockEscrow.pending, actionPending)
      .addCase(lockEscrow.fulfilled, (state, a) => { state.currentTrade = a.payload; state.actionLoading = false; })
      .addCase(lockEscrow.rejected, rejected)

      .addCase(confirmPaymentSent.pending, actionPending)
      .addCase(confirmPaymentSent.fulfilled, (state, a) => { state.currentTrade = a.payload; state.actionLoading = false; })
      .addCase(confirmPaymentSent.rejected, rejected)

      .addCase(completeTrade.pending, actionPending)
      .addCase(completeTrade.fulfilled, (state, a) => { state.currentTrade = a.payload; state.actionLoading = false; })
      .addCase(completeTrade.rejected, rejected)

      .addCase(openDispute.fulfilled, (state, a) => { state.currentTrade = a.payload; })
      .addCase(cancelTrade.fulfilled, (state, a) => { state.currentTrade = a.payload; })

      .addCase(fetchMessages.fulfilled, (state, a) => { state.messages = a.payload; })
      .addCase(sendMessage.fulfilled, (state, a) => { state.messages.push(a.payload); });
  },
});

export const { clearError, clearCurrentTrade, addMessage } = p2pSlice.actions;
export default p2pSlice.reducer;
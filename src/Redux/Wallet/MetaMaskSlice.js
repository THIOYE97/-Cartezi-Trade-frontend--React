import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  connectMetaMask,
  getMetaMaskBalance,
  isMetaMaskInstalled,
} from "@/services/metamaskService";

export const connectWallet = createAsyncThunk(
  "metamask/connectWallet",
  async (_, { rejectWithValue }) => {
    try {
      const address = await connectMetaMask();
      const balance = await getMetaMaskBalance(address);
      return { address, balance };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshMetaMaskBalance = createAsyncThunk(
  "metamask/refreshBalance",
  async (address, { rejectWithValue }) => {
    try {
      const balance = await getMetaMaskBalance(address);
      return balance;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const metamaskSlice = createSlice({
  name: "metamask",
  initialState: {
    address: null,
    balance: null,
    loading: false,
    error: null,
    isInstalled: isMetaMaskInstalled(),
  },
  reducers: {
    disconnectWallet: (state) => {
      state.address = null;
      state.balance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.address = action.payload.address;
        state.balance = action.payload.balance;
        state.loading = false;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(refreshMetaMaskBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      });
  },
});

export const { disconnectWallet } = metamaskSlice.actions;
export default metamaskSlice.reducer;
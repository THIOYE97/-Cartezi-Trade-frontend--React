
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api, { API_BASE_URL } from "@/Api/api";

// Async Thunks
export const fetchCoinList = createAsyncThunk(
    "coin/fetchCoinList",
    async (page, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/coins?page=${page}`);
            console.log("-------", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const getTop50CoinList = createAsyncThunk(
    "coin/getTop50CoinList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/coins/top50`);
            console.log("top 50", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTreadingCoinList = createAsyncThunk(
    "coin/fetchTreadingCoinList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/coins/trading`);
            console.log("trading coins", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMarketChart = createAsyncThunk(
    "coin/fetchMarketChart",
    async ({ coinId, days, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/coins/${coinId}/chart?days=${days}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCoinById = createAsyncThunk(
    "coin/fetchCoinById",
    async (coinId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`);
            console.log("coin by id", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCoinDetails = createAsyncThunk(
    "coin/fetchCoinDetails",
    async ({ coinId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/coins/details/${coinId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("coin details", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const searchCoin = createAsyncThunk(
    "coin/searchCoin",
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await api.get(`/coins/search?q=${keyword}`);
            console.log("search coin", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSimplePrices = createAsyncThunk(
  "coin/fetchSimplePrices",
  async (coinIds, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/coins/prices?ids=${coinIds.join(",")}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
    coinList: [],
    top50: [],
    searchCoinList: [],
    marketChart: { data: [], loading: false },
    coinById: null,
    coinDetails: null,
    loading: false,
    error: null,
};

const coinSlice = createSlice({
    name: "coin",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchCoinList
            .addCase(fetchCoinList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoinList.fulfilled, (state, action) => {
                state.coinList = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCoinList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getTop50CoinList
            .addCase(getTop50CoinList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTop50CoinList.fulfilled, (state, action) => {
                state.top50 = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getTop50CoinList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchTreadingCoinList
            .addCase(fetchTreadingCoinList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTreadingCoinList.fulfilled, (state, action) => {
                state.treadingCoin = action.payload; // Note: Original reducer put this in "treadingCoin" which wasn't in initialState but was in map code
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTreadingCoinList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchMarketChart
            .addCase(fetchMarketChart.pending, (state) => {
                state.marketChart = { loading: true, data: [] };
                state.error = null;
            })
            .addCase(fetchMarketChart.fulfilled, (state, action) => {
                state.marketChart = { data: action.payload.prices, loading: false };
                state.error = null;
            })
            .addCase(fetchMarketChart.rejected, (state, action) => {
                state.marketChart = { loading: false, data: [] };
                state.error = null; // Original reducer didn't set error here, kept null
            })

            // fetchCoinById
            .addCase(fetchCoinById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoinById.fulfilled, (state, action) => {
                state.coinDetails = action.payload; // Original matches this
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCoinById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchCoinDetails
            .addCase(fetchCoinDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoinDetails.fulfilled, (state, action) => {
                state.coinDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCoinDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // searchCoin
            .addCase(searchCoin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCoin.fulfilled, (state, action) => {
                state.searchCoinList = action.payload.coins;
                state.loading = false;
                state.error = null;
            })
            .addCase(searchCoin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default coinSlice.reducer;

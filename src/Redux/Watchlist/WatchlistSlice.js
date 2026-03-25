
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";
import { existInWatchlist } from "@/Util/existInWatchlist";

// Async Thunks
export const getUserWatchlist = createAsyncThunk(
    "watchlist/getUserWatchlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/watchlist/user');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addItemToWatchlist = createAsyncThunk(
    "watchlist/addItemToWatchlist",
    async (coinId, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/api/watchlist/add/coin/${coinId}`);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    watchlist: null,
    loading: false,
    error: null,
    items: [],
};

const watchlistSlice = createSlice({
    name: "watchlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getUserWatchlist
            .addCase(getUserWatchlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserWatchlist.fulfilled, (state, action) => {
                state.watchlist = action.payload;
                state.items = action.payload.coins;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // addItemToWatchlist
            .addCase(addItemToWatchlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToWatchlist.fulfilled, (state, action) => {
                // Logic to toggle item in local state
                const updatedItems = existInWatchlist(state.items, action.payload)
                    ? state.items.filter((item) => item.id !== action.payload.id)
                    : [action.payload, ...state.items];

                state.items = updatedItems;
                state.loading = false;
                state.error = null;
            })
            .addCase(addItemToWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default watchlistSlice.reducer;

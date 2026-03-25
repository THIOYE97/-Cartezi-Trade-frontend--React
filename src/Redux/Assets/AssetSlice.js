
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

// Async Thunks
export const getAssetById = createAsyncThunk(
    "asset/getAssetById",
    async ({ assetId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/assets/${assetId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getAssetDetails = createAsyncThunk(
    "asset/getAssetDetails",
    async ({ coinId, jwt }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/assets/coin/${coinId}/user`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("asset details --- ", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getUserAssets = createAsyncThunk(
    "asset/getUserAssets",
    async (jwt, { rejectWithValue }) => {
        try {
            const response = await api.get("/api/assets", {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    asset: null,
    userAssets: [],
    loading: false,
    error: null,
    assetDetails: null,
};

const assetSlice = createSlice({
    name: "asset",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getAssetById
            .addCase(getAssetById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssetById.fulfilled, (state, action) => {
                state.asset = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAssetById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAssetDetails
            .addCase(getAssetDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssetDetails.fulfilled, (state, action) => {
                state.assetDetails = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAssetDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getUserAssets
            .addCase(getUserAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserAssets.fulfilled, (state, action) => {
                state.userAssets = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default assetSlice.reducer;

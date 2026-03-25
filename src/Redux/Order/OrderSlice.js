
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/Api/api";

// Async Thunks
export const payOrder = createAsyncThunk(
    "order/payOrder",
    async ({ jwt, orderData, amount }, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/orders/pay', orderData, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            console.log("order success", response.data);
            return response.data;
        } catch (error) {
            console.log("error", error);
            return rejectWithValue(error.message);
        }
    }
);

export const getOrderById = createAsyncThunk(
    "order/getOrderById",
    async ({ jwt, orderId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// getAllOrdersForUser — plus besoin de passer jwt, l'intercepteur s'en charge
export const getAllOrdersForUser = createAsyncThunk(
  "order/getAllOrdersForUser",
  async ({ orderType, assetSymbol } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/orders", {
        params: {
          order_type: orderType,
          asset_symbol: assetSymbol,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
    order: null,
    orders: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // payOrder
            .addCase(payOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payOrder.fulfilled, (state, action) => {
                state.order = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(payOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getOrderById
            .addCase(getOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.order = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllOrdersForUser
            .addCase(getAllOrdersForUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrdersForUser.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllOrdersForUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api, { API_BASE_URL } from "@/Api/api";

/* ===============================
   INITIAL STATE
================================ */

const token = localStorage.getItem("jwt");

const initialState = {
  user: null,
  jwt: token || null,
  loading: false,
  error: null
};

/* ===============================
   AUTH INITIALIZATION
================================ */

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) return null;

      const result = await dispatch(getUser(token));
      if (result.meta.requestStatus === "rejected") {
        localStorage.removeItem("jwt");
        return null;
      }

      return token;
    } catch (error) {
      localStorage.removeItem("jwt");
      return rejectWithValue(error.message);
    }
  }
);

/* ===============================
   REGISTER
================================ */

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const data = response.data;

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        // ✅ Fetcher le profil après signup
        await dispatch(getUser(data.jwt));
        userData.navigate("/");
        return data.jwt;
      }

      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ===============================
   LOGIN
================================ */

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
      const data = response.data;

      if (data.twoFactorAuthEnabled) {
        userData.navigate(`/two-factor-auth/${data.session}`);
        return null;
      }

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        // ✅ Fetcher le profil immédiatement après login
        await dispatch(getUser(data.jwt));
        userData.navigate("/");
        return data.jwt;
      }

      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ===============================
   TWO STEP VERIFICATION
================================ */

export const twoStepVerification = createAsyncThunk(
  "auth/twoStepVerification",
  async ({ otp, session, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/two-factor/otp/${otp}`,
        {},
        { params: { id: session } }
      );
      const data = response.data;

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        await dispatch(getUser(data.jwt));
        navigate("/");
        return data.jwt;
      }

      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ===============================
   GET USER PROFILE
================================ */

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (token, { rejectWithValue }) => {

    try {

      const response = await axios.get(
        `${API_BASE_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   LOGOUT
================================ */

export const logout = createAsyncThunk(
  "auth/logout",
  async () => {

    localStorage.removeItem("jwt");

    return null;

  }
);

/* ===============================
   SEND VERIFICATION OTP
================================ */

export const sendVerificationOtp = createAsyncThunk(
  "auth/sendVerificationOtp",
  async ({  verificationType }, { rejectWithValue }) => {

    try {

      const response = await api.post(
        `/api/users/verification/${verificationType}/send-otp`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   VERIFY OTP
================================ */

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({  otp }, { rejectWithValue }) => {

    try {

      const response = await api.patch(
        `/api/users/verification/verify-otp/${otp}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   ENABLE 2FA
================================ */

export const enableTwoStepAuthentication = createAsyncThunk(
  "auth/enableTwoStepAuthentication",
  async ({  otp }, { rejectWithValue }) => {

    try {

      const response = await api.patch(
        `/api/users/enable-two-factor/verify-otp/${otp}`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );

      return response.data;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   RESET PASSWORD OTP
================================ */

export const sendResetPassowrdOTP = createAsyncThunk(
  "auth/sendResetPassowrdOTP",
  async ({ sendTo, verificationType, navigate }, { rejectWithValue }) => {

    try {

      const response = await axios.post(
        `${API_BASE_URL}/auth/users/reset-password/send-otp`,
        { sendTo, verificationType }
      );

      const user = response.data;

      navigate(`/reset-password/${user.session}`);

      return user;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   VERIFY RESET PASSWORD OTP
================================ */

export const verifyResetPassowrdOTP = createAsyncThunk(
  "auth/verifyResetPassowrdOTP",
  async ({ otp, password, session, navigate }, { rejectWithValue }) => {

    try {

      const response = await axios.patch(
        `${API_BASE_URL}/auth/users/reset-password/verify-otp`,
        { otp, password },
        { params: { id: session } }
      );

      navigate("/password-update-successfully");

      return response.data;

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }
);

/* ===============================
   SLICE
================================ */

const authSlice = createSlice({

  name: "auth",

  initialState,

  reducers: {

    clearAuthError: (state) => {
      state.error = null;
    }

  },

  extraReducers: (builder) => {

    builder

      /* Initialize */

      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
      })

      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.jwt = null;
        state.user = null;
      })


      /* Register */

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* Login */

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* Two Step */

      .addCase(twoStepVerification.pending, (state) => {
        state.loading = true;
      })

      .addCase(twoStepVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload;
      })

      .addCase(twoStepVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* Get User */

      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* Logout */

      .addCase(logout.fulfilled, (state) => {
        state.jwt = null;
        state.user = null;
        state.loading = false;
      });


  }

});

/* ===============================
   SELECTORS
================================ */

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectJwt = (state) => state.auth.jwt;
export const selectIsAuthenticated = (state) => !!state.auth.jwt;

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;
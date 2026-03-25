import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/AuthSlice";
import coinReducer from "./Coin/CoinSlice";
import walletReducer from "./Wallet/WalletSlice";
import metamaskReducer from "./Wallet/MetaMaskSlice";
import orderReducer from "./Order/OrderSlice";
import assetReducer from "./Assets/AssetSlice";
import watchlistReducer from "./Watchlist/WatchlistSlice";
import withdrawalReducer from "./Withdrawal/WithdrawalSlice";
import p2pReducer from "./P2P/P2PSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    coin: coinReducer,
    wallet: walletReducer,
    metamask: metamaskReducer,
    order: orderReducer,
    asset: assetReducer,
    watchlist: watchlistReducer,
    withdrawal: withdrawalReducer,
    p2p: p2pReducer,
  },
});
/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon, BookmarkIcon } from "@radix-ui/react-icons";
import StockChart from "./StockChart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TreadingForm from "./TreadingForm";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoinDetails } from "@/Redux/Coin/CoinSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { existInWatchlist } from "@/Util/existInWatchlist";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/WatchlistSlice";
import { getUserWallet } from "@/Redux/Wallet/WalletSlice";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const StockDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { coin, watchlist, auth } = useSelector((store) => store);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    dispatch(
      fetchCoinDetails({
        coinId: id,
        jwt: auth.jwt || localStorage.getItem("jwt"),
      })
    );
  }, [id]);

  useEffect(() => {
    dispatch(getUserWatchlist());
    dispatch(getUserWallet(localStorage.getItem("jwt")));
  }, []);

  const handleAddToWatchlist = () => {
    dispatch(addItemToWatchlist(coin.coinDetails?.id));
  };

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }

  const isPositive = coin.coinDetails?.market_data?.market_cap_change_24h >= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Coin Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={coin.coinDetails?.image?.large} />
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {coin.coinDetails?.name}
                </h1>
                <span className={`uppercase ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
                  {coin.coinDetails?.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-2xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  ${coin.coinDetails?.market_data?.current_price?.usd?.toLocaleString()}
                </span>
                <span className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {coin.coinDetails?.market_data?.market_cap_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddToWatchlist}
              variant="ghost"
              size="icon"
              className={`h-10 w-10 ${isLight
                ? "border border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                : "border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800"
                }`}
            >
              {existInWatchlist(watchlist.items, coin.coinDetails) ? (
                <BookmarkFilledIcon className={`h-5 w-5 ${isLight ? "text-black" : "text-white"}`} />
              ) : (
                <BookmarkIcon className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-neutral-400"}`} />
              )}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className={`font-medium px-6 ${isLight
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-neutral-200"
                  }`}>
                  Trade
                </Button>
              </DialogTrigger>
              <DialogContent className={isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}>
                <DialogHeader>
                  <DialogTitle className={`text-center ${isLight ? "text-gray-900" : "text-white"}`}>
                    Trade {coin.coinDetails?.symbol?.toUpperCase()}
                  </DialogTitle>
                </DialogHeader>
                <TreadingForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Chart */}
      {/* Chart card existante */}
<div className="card p-6">
  <StockChart coinId={coin.coinDetails?.id} />

  {/* Attribution CoinGecko sous le chart */}
  <div className="flex justify-end mt-4 pt-4 border-t border-neutral-800">
    <a
      href="https://www.coingecko.com?utm_source=cartezi_trade&utm_medium=referral"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 group"
    >
      <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
        Powered by CoinGecko API
      </span>
      <img
        src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d2fad96cb1b2efb0dbe4dc2e4933.png"
        alt="CoinGecko"
        className="h-3 opacity-40 group-hover:opacity-70 transition-opacity"
      />
    </a>
  </div>
</div>
      </div>
    
  );
};

export default StockDetails;

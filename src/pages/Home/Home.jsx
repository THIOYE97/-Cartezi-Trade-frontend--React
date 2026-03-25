/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { CryptoCard } from "./CryptoCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/CoinSlice";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

const Home = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { coin, auth } = useSelector((store) => store);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchCoinList(page));
  }, [page]);

  useEffect(() => {
    dispatch(fetchCoinDetails({
      coinId: "bitcoin",
      jwt: auth.jwt || localStorage.getItem("jwt"),
    }))
  }, []);

  useEffect(() => {
    if (category == "top50") {
      dispatch(getTop50CoinList());
    } else if (category == "trading") {
      dispatch(fetchTreadingCoinList())
    }
  }, [category]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (coin.loading) {
    return (
      <div className="min-h-screen animate-fadeIn">
        <div className="px-4 pt-16 pb-12">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4">
            <Skeleton className="h-12 w-64 md:w-96 rounded-lg" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="p-4 border rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

// Remplacer le bloc error existant par :
if (coin.error) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">Market data unavailable</p>
      <button
        onClick={() => dispatch(fetchCoinList(page))}
        className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 text-sm"
      >
        Retry
      </button>
    </div>
  );
}

  return (
    <div className="min-h-screen animate-fadeIn">
      {/* Hero Section */}
      <div className="px-4 pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-semibold mb-4 tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            {t("home.title")}
          </h1>
          <p className={`text-lg max-w-xl mx-auto ${isLight ? "text-gray-600" : "text-neutral-400"}`}>
            {t("home.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {["all", "top50"].map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 h-9 text-sm font-medium transition-all ${category === cat
                ? isLight
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-neutral-200"
                : isLight
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
            >
              {cat === "all" ? t("home.allCoins") : t("home.top50")}
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <Input
            className="w-full max-w-md h-12 rounded-full px-6 bg-transparent border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-violet-500 transition-all font-medium placeholder:text-gray-400"
            placeholder={t("home.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Crypto Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {(category === "all"
            ? coin.coinList
            : category === "top50"
              ? coin.top50
              : coin.treadingCoin
          )
            ?.filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, index) => (
              <div
                key={item.id}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CryptoCard coin={item} index={index} />
              </div>
            ))}
        </div>
            {/* CoinGecko Attribution — au-dessus de la pagination */}
<div className="flex justify-center mb-6">
  
  <a
    href="https://www.coingecko.com?utm_source=cartezi_trade&utm_medium=referral"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 group"
  >
    <span className={`text-xs ${isLight ? "text-gray-400" : "text-neutral-600"}`}>
      Data provided by
    </span>

<img
  src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d2fad96cb1b2efb0dbe4dc2e4933.png"
  alt="CoinGecko"
  className="h-4 opacity-60"
  referrerPolicy="no-referrer"
  onError={(e) => {
    e.target.onerror = null;
    e.target.replaceWith(Object.assign(document.createElement("span"), {
      textContent: "CoinGecko",
      className: "text-xs text-neutral-500",
    }));
  }}
/>
  </a>
</div>
        {/* Pagination */}
        {category === "all" && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className={`h-9 px-4 disabled:opacity-30 rounded-lg ${isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              {t("home.previous")}
            </Button>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  variant="ghost"
                  onClick={() => handlePageChange(num)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${page === num
                    ? isLight
                      ? "bg-black text-white"
                      : "bg-white text-black"
                    : isLight
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  {num}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={() => handlePageChange(page + 1)}
              className={`h-9 px-4 rounded-lg ${isLight
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
            >
              {t("home.next")}
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

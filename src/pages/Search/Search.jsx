/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { searchCoin } from "@/Redux/Coin/CoinSlice";
import { useNavigate } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { useTheme } from "@/context/ThemeContext";

const SearchCoin = () => {
  const dispatch = useDispatch();
  const { coin } = useSelector((store) => store);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleSearchCoin = () => {
    if (keyword.trim()) {
      dispatch(searchCoin(keyword));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchCoin();
    }
  };

  if (coin.loading) {
    return <SpinnerBackdrop />
  }

  return (
    <div className="min-h-screen animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className={`text-3xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            Search
          </h1>
          <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
            Find any cryptocurrency
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="card p-2 flex items-center gap-2">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by name or symbol..."
              className={`h-12 text-base bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${isLight ? "placeholder:text-gray-400" : "placeholder:text-neutral-600"
                }`}
            />
            <Button
              onClick={handleSearchCoin}
              className={`h-12 px-6 rounded-lg ${isLight
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white text-black hover:bg-neutral-200"
                }`}
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mb-10">
          <p className={`text-xs mb-3 uppercase tracking-wider ${isLight ? "text-gray-500" : "text-neutral-600"}`}>
            Popular
          </p>
          <div className="flex flex-wrap gap-2">
            {["Bitcoin", "Ethereum", "Solana", "Cardano", "Polkadot", "Dogecoin"].map((coinName) => (
              <button
                key={coinName}
                onClick={() => {
                  setKeyword(coinName);
                  dispatch(searchCoin(coinName));
                }}
                className={`px-4 py-2 card-hover text-sm ${isLight
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-neutral-400 hover:text-white"
                  }`}
              >
                {coinName}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {coin.searchCoinList && coin.searchCoinList.length > 0 && (
          <div className="card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className={`hover:bg-transparent ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
                  <TableHead className={`w-16 ${isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}`}>Rank</TableHead>
                  <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Coin</TableHead>
                  <TableHead className={`text-right ${isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}`}>Symbol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coin.searchCoinList?.map((item) => (
                  <TableRow
                    onClick={() => navigate(`/market/${item.id}`)}
                    key={item.id}
                    className={`cursor-pointer ${isLight ? "border-gray-200 hover:bg-gray-50" : "border-neutral-800 hover:bg-neutral-800/50"}`}
                  >
                    <TableCell className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>
                      #{item.market_cap_rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.large} alt={item.name} />
                        </Avatar>
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right uppercase ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                      {item.symbol}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* No Results */}
        {coin.searchCoinList && coin.searchCoinList.length === 0 && keyword && (
          <div className="text-center py-20">
            <p className={isLight ? "text-gray-500" : "text-neutral-500"}>No results found for "{keyword}"</p>
          </div>
        )}

        {/* Initial State */}
        {!coin.searchCoinList && !keyword && (
          <div className="text-center py-20">
            <SearchIcon className={`h-12 w-12 mx-auto mb-4 ${isLight ? "text-gray-300" : "text-neutral-700"}`} />
            <p className={isLight ? "text-gray-500" : "text-neutral-500"}>Enter a search term to find cryptocurrencies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCoin;

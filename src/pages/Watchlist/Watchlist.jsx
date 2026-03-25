import { useEffect, useState } from "react";
import { addItemToWatchlist, getUserWatchlist } from "@/Redux/Watchlist/WatchlistSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const Watchlist = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { watchlist } = useSelector((store) => store);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserWatchlist());
  }, [page]);

  const handleAddToWatchlist = (id) => {
    dispatch(addItemToWatchlist(id))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
          {t("watchlist.title")}
        </h1>
        <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
          {t("watchlist.subtitle")}
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className={`hover:bg-transparent ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
              <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Coin</TableHead>
              <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Price</TableHead>
              <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>24h Change</TableHead>
              <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Market Cap</TableHead>
              <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Volume</TableHead>
              <TableHead className={`text-right ${isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}`}>Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchlist.items?.map((item) => (
              <TableRow
                key={item.id}
                className={isLight ? "border-gray-200 hover:bg-gray-50" : "border-neutral-800 hover:bg-neutral-800/50"}
              >
                <TableCell>
                  <div
                    onClick={() => navigate(`/market/${item.id}`)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.image} alt={item.symbol} />
                    </Avatar>
                    <div>
                      <p className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.name}</p>
                      <p className={`text-xs uppercase ${isLight ? "text-gray-500" : "text-neutral-500"}`}>{item.symbol}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  ${item.current_price?.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={item.market_cap_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"}>
                    {item.market_cap_change_percentage_24h > 0 ? "+" : ""}
                    {item.market_cap_change_percentage_24h?.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className={isLight ? "text-gray-700" : "text-neutral-300"}>
                  ${(item.market_cap / 1e9).toFixed(2)}B
                </TableCell>
                <TableCell className={isLight ? "text-gray-700" : "text-neutral-300"}>
                  ${(item.total_volume / 1e9).toFixed(2)}B
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleAddToWatchlist(item.id)}
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 hover:text-red-500 hover:bg-red-500/10 ${isLight ? "text-gray-400" : "text-neutral-500"}`}
                  >
                    <BookmarkFilledIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {(!watchlist.items || watchlist.items.length === 0) && (
          <div className="py-16 text-center">
            <p className={isLight ? "text-gray-500" : "text-neutral-500"}>{t("watchlist.empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

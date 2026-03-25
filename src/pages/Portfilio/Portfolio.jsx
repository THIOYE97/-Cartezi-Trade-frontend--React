/* eslint-disable no-unused-vars */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAssets } from "@/Redux/Assets/AssetSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TreadingHistory from "./TreadingHistory";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const Portfolio = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("portfolio");
  const { asset } = useSelector((store) => store);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserAssets(localStorage.getItem("jwt")));
  }, []);

  const handleTabChange = (value) => {
    setCurrentTab(value);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
          {t("portfolio.title")}
        </h1>
        <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
          {t("portfolio.subtitle")}
        </p>
      </div>

      {/* Tab Select */}
      <div className="mb-6">
        <Select onValueChange={handleTabChange} defaultValue="portfolio">
          <SelectTrigger className={`w-[160px] ${isLight
            ? "bg-white border-gray-200 hover:border-gray-300"
            : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
            }`}>
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className={isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}>
            <SelectItem value="portfolio" className={isLight ? "hover:bg-gray-100" : "hover:bg-neutral-800"}>
              {t("portfolio.portfolio")}
            </SelectItem>
            <SelectItem value="history" className={isLight ? "hover:bg-gray-100" : "hover:bg-neutral-800"}>
              {t("portfolio.history")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {currentTab === "portfolio" ? (
        <div className="card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className={`hover:bg-transparent ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
                <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Asset</TableHead>
                <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Price</TableHead>
                <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>Holdings</TableHead>
                <TableHead className={isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}>24h Change</TableHead>
                <TableHead className={`text-right ${isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"}`}>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asset.loading ? (
                [1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item} className={`${isLight ? "border-gray-200" : "border-neutral-800"}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                asset.userAssets?.map((item) => (
                  <TableRow
                    onClick={() => navigate(`/market/${item.coin.id}`)}
                    key={item.id}
                    className={`cursor-pointer transition-all duration-200 ${isLight
                      ? "border-gray-200 hover:bg-gray-100 hover:scale-[1.01] hover:shadow-sm"
                      : "border-neutral-800 hover:bg-neutral-800 hover:scale-[1.01] hover:shadow-md bg-transparent"
                      }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.coin.image} alt={item.coin.symbol} />
                        </Avatar>
                        <div>
                          <p className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.coin.name}</p>
                          <p className={`text-xs uppercase ${isLight ? "text-gray-500" : "text-neutral-500"}`}>{item.coin.symbol}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${item.coin.current_price?.toLocaleString()}
                    </TableCell>
                    <TableCell className={isLight ? "text-gray-700" : "text-neutral-300"}>
                      {item.quantity} {item.coin.symbol?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <span className={item.coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"}>
                        {item.coin.price_change_percentage_24h > 0 ? "+" : ""}
                        {item.coin.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${(item.coin.current_price * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {(!asset.userAssets || asset.userAssets.length === 0) && (
            <div className="py-16 text-center">
              <p className={isLight ? "text-gray-500" : "text-neutral-500"}>{t("portfolio.noAssets")}</p>
            </div>
          )}
        </div>
      ) : (
        <TreadingHistory />
      )}
    </div>
  );
};

export default Portfolio;

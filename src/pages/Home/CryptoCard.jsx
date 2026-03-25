import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import CoinImage from "@/components/coingecko/CoinImage";

export function CryptoCard({ coin, index }) {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isLight = theme === "light";

    const formatNumber = (num) => {
        if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
        return `$${num?.toFixed(2)}`;
    };

    const formatPrice = (price) => {
        if (price >= 1) {
            return `$${price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
        return `$${price?.toFixed(6)}`;
    };

    const isPositive = coin.market_cap_change_percentage_24h >= 0;

    return (
        <div
            onClick={() => navigate(`/market/${coin.id}`)}
            className="card-hover p-5 cursor-pointer group relative"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={coin.image} alt={coin.symbol} />
                    </Avatar>
                    <div>
                        <h3 className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {coin.name}
                        </h3>
                        <p className={`text-sm uppercase ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
                            {coin.symbol}
                        </p>
                    </div>
                </div>
                <span className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-neutral-600"}`}>
                    #{index + 1}
                </span>
            </div>

            {/* Price */}
            <div className="mb-4">
                <p className={`text-2xl font-semibold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                    {formatPrice(coin.current_price)}
                </p>
                <div className={`flex items-center gap-1 mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : (
                        <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                        {isPositive ? "+" : ""}{coin.market_cap_change_percentage_24h?.toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className={`flex items-center justify-between pt-4 border-t ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
                <div>
                    <p className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>Market Cap</p>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-neutral-300"}`}>
                        {formatNumber(coin.market_cap)}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>Volume 24h</p>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-neutral-300"}`}>
                        {formatNumber(coin.total_volume)}
                    </p>
                </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-neutral-500"}`} />
            </div>
        </div>
    );
}

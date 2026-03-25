import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAllOrdersForUser } from "@/Redux/Order/OrderSlice";
import { readableDate } from "@/Util/readableDate";
import { useTheme } from "@/context/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

// Adapté à la structure PostgreSQL — coin_data est un objet JSONB
function getCoinData(item) {
  const raw = item.coin_data;
  if (!raw) return { name: "Unknown", symbol: "?", image: null };
  // coin_data peut être un objet ou une string JSON selon le driver pg
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  return {
    name: data.name || "Unknown",
    symbol: data.symbol || "?",
    image: data.image?.large || data.image?.small || data.image || null,
  };
}

// Calcul P/L pour un ordre SELL
function calculatePnL(item) {
  // unit_price = prix unitaire au moment de l'ordre
  // buy_price stocké dans assets — on n'a pas le coût d'acquisition ici
  // On affiche la valeur totale reçue pour SELL
  if (item.order_type !== "SELL") return null;
  return Number(item.price);
}

const TradingHistory = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    dispatch(getAllOrdersForUser({}));
  }, [dispatch]);

  const orders = order.orders || [];

  return (
    <div className="card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow
            className={`hover:bg-transparent ${
              isLight ? "border-gray-200" : "border-neutral-800"
            }`}
          >
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Date
            </TableHead>
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Asset
            </TableHead>
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Unit Price
            </TableHead>
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Quantity
            </TableHead>
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Type
            </TableHead>
            <TableHead
              className={
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }
            >
              Status
            </TableHead>
            <TableHead
              className={`text-right ${
                isLight ? "text-gray-500 font-medium" : "text-neutral-500 font-medium"
              }`}
            >
              Total
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Skeletons pendant le chargement */}
          {order.loading &&
            [1, 2, 3, 4, 5].map((i) => (
              <TableRow
                key={i}
                className={
                  isLight ? "border-gray-200" : "border-neutral-800"
                }
              >
                <TableCell>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-12 rounded" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded" /></TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}

          {/* Données réelles */}
          {!order.loading &&
            orders.map((item) => {
              const coin = getCoinData(item);
              const isBuy = item.order_type === "BUY";
              const unitPrice = Number(item.unit_price);
              const quantity = Number(item.quantity);
              const total = Number(item.price);
              const date = readableDate(item.timestamp);

              return (
                <TableRow
                  key={item.id}
                  className={
                    isLight
                      ? "border-gray-200 hover:bg-gray-50"
                      : "border-neutral-800 hover:bg-neutral-800/50"
                  }
                >
                  {/* Date */}
                  <TableCell>
                    <p
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {date.date}
                    </p>
                    <p
                      className={`text-xs ${
                        isLight ? "text-gray-500" : "text-neutral-500"
                      }`}
                    >
                      {date.time}
                    </p>
                  </TableCell>

                  {/* Asset */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={coin.image}
                          alt={coin.symbol}
                        />
                        <AvatarFallback
                          className={`text-xs font-bold uppercase ${
                            isLight
                              ? "bg-gray-100 text-gray-700"
                              : "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {coin.symbol?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className={`font-medium text-sm ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {coin.name}
                        </p>
                        <p
                          className={`text-xs uppercase ${
                            isLight ? "text-gray-500" : "text-neutral-500"
                          }`}
                        >
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Unit price */}
                  <TableCell
                    className={`font-medium ${
                      isLight ? "text-gray-700" : "text-neutral-300"
                    }`}
                  >
                    ${unitPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </TableCell>

                  {/* Quantity */}
                  <TableCell
                    className={
                      isLight ? "text-gray-700" : "text-neutral-300"
                    }
                  >
                    {quantity.toFixed(6)}{" "}
                    <span
                      className={`text-xs uppercase ${
                        isLight ? "text-gray-400" : "text-neutral-500"
                      }`}
                    >
                      {coin.symbol}
                    </span>
                  </TableCell>

                  {/* Type badge */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        isBuy
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {isBuy ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {item.order_type}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        item.status === "SUCCESS"
                          ? "bg-green-500/10 text-green-500"
                          : item.status === "PENDING"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>

                  {/* Total */}
                  <TableCell
                    className={`text-right font-medium ${
                      isBuy
                        ? isLight
                          ? "text-gray-900"
                          : "text-white"
                        : "text-green-500"
                    }`}
                  >
                    {isBuy ? "-" : "+"}$
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {/* État vide */}
      {!order.loading && orders.length === 0 && (
        <div className="py-16 text-center">
          <TrendingUp
            className={`h-10 w-10 mx-auto mb-3 ${
              isLight ? "text-gray-300" : "text-neutral-700"
            }`}
          />
          <p
            className={`text-sm ${
              isLight ? "text-gray-500" : "text-neutral-500"
            }`}
          >
            No trading history yet
          </p>
          <p
            className={`text-xs mt-1 ${
              isLight ? "text-gray-400" : "text-neutral-600"
            }`}
          >
            Your orders will appear here after your first trade
          </p>
        </div>
      )}

      {/* Erreur */}
      {order.error && (
        <div className="py-8 text-center">
          <p className="text-red-500 text-sm">{order.error}</p>
        </div>
      )}
    </div>
  );
};

export default TradingHistory;
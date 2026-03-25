import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForUser } from "@/Redux/Order/OrderSlice";
import { fetchMyTrades } from "@/Redux/P2P/P2PSlice";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import {
  TrendingUp, TrendingDown, ArrowLeftRight,
  Bookmark, ArrowDownRight, ArrowUpRight
} from "lucide-react";
import api from "@/Api/api";

const TYPE_CONFIG = {
  ORDER_BUY:           { icon: TrendingUp,    color: "text-green-500",  bg: "bg-green-500/10"  },
  ORDER_SELL:          { icon: TrendingDown,   color: "text-red-500",    bg: "bg-red-500/10"    },
  P2P_TRADE_CREATED:   { icon: ArrowLeftRight, color: "text-blue-400",   bg: "bg-blue-500/10"   },
  P2P_TRADE_COMPLETED: { icon: ArrowLeftRight, color: "text-green-500",  bg: "bg-green-500/10"  },
  WATCHLIST_ADD:       { icon: Bookmark,       color: "text-violet-400", bg: "bg-violet-500/10" },
  DEPOSIT:             { icon: ArrowDownRight, color: "text-green-500",  bg: "bg-green-500/10"  },
  WITHDRAWAL:          { icon: ArrowUpRight,   color: "text-red-500",    bg: "bg-red-500/10"    },
};

function safeDate(val) {
  if (!val) return { date: "—", time: "" };
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return { date: "—", time: "" };
    const pad = (n) => String(n).padStart(2, "0");
    return {
      date: `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
  } catch {
    return { date: "—", time: "" };
  }
}

function safeN(val, dec = 2) {
  const n = Number(val);
  if (!isFinite(n)) return "0";
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: dec });
}

const Activity = () => {
  const { order, p2p } = useSelector((s) => s);
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLight = theme === "light";
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    dispatch(getAllOrdersForUser({}));
    dispatch(fetchMyTrades());
    api.get("/api/users/activity")
      .then((r) => setActivities(Array.isArray(r.data) ? r.data : []))
      .catch(() => setActivities([]));
  }, [dispatch]);

  const allItems = useMemo(() => {
    try {
      const orderItems = (order.orders || []).map((o) => ({
        id: String(o?.id || Math.random()),
        type: o?.order_type === "BUY" ? "ORDER_BUY" : "ORDER_SELL",
        title: `${o?.order_type || ""} ${String(o?.coin_id || "").toUpperCase()}`,
        description: `${safeN(o?.quantity, 6)} @ $${safeN(o?.unit_price)}`,
        amount: `${o?.order_type === "SELL" ? "+" : "-"}$${safeN(o?.price)}`,
        date: o?.timestamp || null,
      }));

      const tradeItems = (p2p.trades || []).map((t) => ({
        id: String(t?.id || Math.random()),
        type: t?.status === "COMPLETED" ? "P2P_TRADE_COMPLETED" : "P2P_TRADE_CREATED",
        title: `P2P — ${String(t?.coin_id || "").toUpperCase()}`,
        description: `${safeN(t?.quantity, 6)} ${t?.coin_id || ""}${t?.payment_method ? " · " + t.payment_method.replace(/_/g, " ") : ""}`,
        amount: `$${safeN(t?.total_fiat)}`,
        date: t?.created_at || null,
        status: t?.status,
      }));

      const actItems = (activities || []).map((a) => ({
        id: String(a?.id || Math.random()),
        type: a?.type || "DEPOSIT",
        title: a?.title || "",
        description: a?.description || "",
        date: a?.created_at || null,
      }));

      return [...orderItems, ...tradeItems, ...actItems]
        .filter((i) => Boolean(i.date))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch {
      return [];
    }
  }, [order.orders, p2p.trades, activities]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className={"text-2xl font-semibold mb-1 " + (isLight ? "text-gray-900" : "text-white")}>
          {t("activity.title")}
        </h1>
        <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
          {t("activity.subtitle")}
        </p>
      </div>

      {allItems.length === 0 ? (
        <div className="py-20 text-center">
          <p className={isLight ? "text-gray-400" : "text-neutral-600"}>
            {t("activity.noActivity")}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allItems.map((item) => {
            const cfg = TYPE_CONFIG[item.type] || {
              icon: ArrowLeftRight, color: "text-neutral-400", bg: "bg-neutral-800",
            };
            const Icon = cfg.icon;
            const { date, time } = safeDate(item.date);
            return (
              <div
                key={item.id}
                className={"card p-4 flex items-center justify-between transition-all " + (isLight ? "" : "hover:border-neutral-700")}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={"h-9 w-9 shrink-0 rounded-lg flex items-center justify-center " + cfg.bg}>
                    <Icon className={"h-4 w-4 " + cfg.color} />
                  </div>
                  <div className="min-w-0">
                    <p className={"font-medium text-sm truncate " + (isLight ? "text-gray-900" : "text-white")}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className={"text-xs mt-0.5 truncate " + (isLight ? "text-gray-500" : "text-neutral-500")}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {item.amount && (
                    <p className={"text-sm font-medium " + cfg.color}>{item.amount}</p>
                  )}
                  {item.status && (
                    <span className={"text-xs px-2 py-0.5 rounded " + (
                      item.status === "COMPLETED"     ? "bg-green-500/10 text-green-500"   :
                      item.status === "PENDING"       ? "bg-orange-500/10 text-orange-400" :
                      item.status === "ESCROW_LOCKED" ? "bg-blue-500/10 text-blue-400"     :
                      "bg-neutral-800 text-neutral-500"
                    )}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  )}
                  <p className={"text-xs mt-1 " + (isLight ? "text-gray-400" : "text-neutral-600")}>
                    {date} {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activity;

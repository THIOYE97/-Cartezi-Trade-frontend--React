import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTrades } from "@/Redux/P2P/P2PSlice";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentBadge from "@/components/p2p/PaymentBadge";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_COLORS = {
  PENDING:       "bg-orange-500/10 text-orange-400",
  ESCROW_LOCKED: "bg-blue-500/10 text-blue-400",
  PAYMENT_SENT:  "bg-violet-500/10 text-violet-400",
  COMPLETED:     "bg-green-500/10 text-green-500",
  DISPUTED:      "bg-red-500/10 text-red-500",
  CANCELLED:     "bg-neutral-500/10 text-neutral-500",
  EXPIRED:       "bg-neutral-500/10 text-neutral-500",
};

const MyTrades = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { p2p, auth } = useSelector((s) => s);

  useEffect(() => {
    dispatch(fetchMyTrades());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">{t("p2p.myTrades")}</h1>
          <p className="text-neutral-500">{t("p2p.tradesDescription")}</p>
        </div>
        <button
          onClick={() => navigate("/p2p")}
          className="text-sm text-neutral-500 hover:text-white transition-colors"
        >
          {t("p2p.viewMarket")}
        </button>
      </div>

      {p2p.loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : p2p.trades.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-500">{t("p2p.noTrades")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {p2p.trades.map((trade) => {
            const isSeller = auth.user?.id === trade.seller_id;
            return (
              <div
                key={trade.id}
                onClick={() => navigate(`/p2p/trades/${trade.id}`)}
                className="card p-4 flex items-center justify-between cursor-pointer hover:border-neutral-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-white font-semibold text-sm">
                      {Number(trade.quantity).toFixed(6)}
                    </p>
                    <p className="text-neutral-500 text-xs uppercase">{trade.coin_id}</p>
                  </div>
                  <div className="h-8 w-px bg-neutral-800" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        isSeller ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                      }`}>
                        {isSeller ? "SELL" : "BUY"}
                      </span>
                      <span className="text-neutral-500 text-xs">{t("p2p.with")}</span>
                      <span className="text-white text-xs font-medium">
                        {isSeller ? trade.buyer_name : trade.seller_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <PaymentBadge method={trade.payment_method} />
                      <span className="text-neutral-600 text-xs">
                        ${Number(trade.total_fiat).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[trade.status] || ""}`}>
                    {trade.status.replace("_", " ")}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTrades;
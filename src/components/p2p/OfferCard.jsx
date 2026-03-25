import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import PaymentBadge from "./PaymentBadge";

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((s) => s);
  const isMine = auth.user?.id === offer.seller_id;

  return (
    <div
      onClick={() => navigate(`/p2p/offers/${offer.id}`)}
      className="card p-5 cursor-pointer hover:border-neutral-600 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-semibold text-sm">
            {offer.seller_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium text-sm">{offer.seller_name}</p>
              {isMine && (
                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  You
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-neutral-500 text-xs">
                {Number(offer.seller_rating).toFixed(1)} ({offer.seller_ratings_count} trades)
              </span>
            </div>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
          offer.offer_type === "SELL"
            ? "bg-green-500/10 text-green-500"
            : "bg-red-500/10 text-red-500"
        }`}>
          {offer.offer_type === "SELL" ? (
            <TrendingDown className="h-3 w-3" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          {offer.offer_type}
        </span>
      </div>

      {/* Coin + Prix */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-white">
            ${Number(offer.price_per_unit).toLocaleString()}
          </span>
          <span className="text-neutral-500 text-sm uppercase">{offer.coin_id}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
          <span>Qty: {Number(offer.quantity)} {offer.coin_id}</span>
          <span className="h-1 w-1 rounded-full bg-neutral-700" />
          <span>
            {offer.currency} {Number(offer.min_amount).toLocaleString()} —{" "}
            {Number(offer.max_amount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Méthodes de paiement */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {offer.payment_methods?.map((m) => (
          <PaymentBadge key={m} method={m} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
        <span className="text-xs text-neutral-600">
          {offer.country} · {offer.total_trades} completed
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          offer.status === "OPEN"
            ? "bg-green-500/10 text-green-500"
            : "bg-neutral-500/10 text-neutral-500"
        }`}>
          {offer.status}
        </span>
      </div>
    </div>
  );
};

export default OfferCard;
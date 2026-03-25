import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOfferById, createTrade } from "@/Redux/P2P/P2PSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PaymentBadge from "@/components/p2p/PaymentBadge";
import { Star, ArrowLeft, Shield } from "lucide-react";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { useTranslation } from "react-i18next";



const P2POffer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { p2p, auth } = useSelector((s) => s);
  const offer = p2p.currentOffer;

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchOfferById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (offer?.payment_methods?.length) {
      setSelectedMethod(offer.payment_methods[0]);
    }
  }, [offer]);

  const quantity = offer
    ? (Number(amount) / Number(offer.price_per_unit)).toFixed(8)
    : 0;

  const handleTrade = async () => {
    setError("");
    if (!amount || Number(amount) <= 0) {
      return setError("Enter a valid amount");
    }
    if (Number(amount) < Number(offer.min_amount) ||
        Number(amount) > Number(offer.max_amount)) {
      return setError(
        `Amount must be between ${offer.min_amount} and ${offer.max_amount} ${offer.currency}`
      );
    }

    const result = await dispatch(createTrade({
      offerId: offer.id,
      quantity: Number(quantity),
      paymentMethod: selectedMethod,
    }));

    if (!result.error) {
      navigate(`/p2p/trades/${result.payload.id}`);
    } else {
      setError(result.payload);
    }
  };

  if (p2p.loading) return <SpinnerBackdrop />;
  if (!offer) return null;

  const isMine = auth.user?.id === offer.seller_id;
  const commission = Number(quantity) * Number(offer.commission_rate || 0.015);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Back */}
      <button
        onClick={() => navigate("/p2p")}
        className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("p2p.backToMarket")}
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Info offre */}
        <div className="md:col-span-2 space-y-4">
          <div className="card p-6">
            {/* Vendeur */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-800">
              <div className="h-14 w-14 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-xl">
                {offer.seller_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-lg">{offer.seller_name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">
                    {Number(offer.seller_rating).toFixed(1)}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    ({offer.seller_ratings_count} trades)
                  </span>
                </div>
                <p className="text-neutral-500 text-sm mt-0.5">
                  {offer.country} · {offer.region}
                </p>
              </div>
            </div>

            {/* Détails */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-500">Price</span>
                <span className="text-white font-semibold">
                  ${Number(offer.price_per_unit).toLocaleString()} / {offer.coin_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("p2p.available")}</span>
                <span className="text-white">{Number(offer.quantity)} {offer.coin_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("p2p.limit")}</span>
                <span className="text-white">
                  ${Number(offer.min_amount).toLocaleString()} — ${Number(offer.max_amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">{t("p2p.commission")}</span>
                <span className="text-neutral-400 text-sm">
                  {(Number(offer.commission_rate) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Méthodes */}
            <div className="mt-5 pt-5 border-t border-neutral-800">
              <p className="text-neutral-500 text-sm mb-2">{t("p2p.paymentMethods")}</p>
              <div className="flex flex-wrap gap-2">
                {offer.payment_methods?.map((m) => (
                  <PaymentBadge key={m} method={m} size="lg" />
                ))}
              </div>
            </div>

            {/* Terms */}
            {offer.terms && (
              <div className="mt-5 pt-5 border-t border-neutral-800">
                <p className="text-neutral-500 text-sm mb-2">{t("p2p.terms")}</p>
                <p className="text-neutral-300 text-sm leading-relaxed">{offer.terms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire trade */}
        <div className="card p-5 h-fit">
          {isMine ? (
            <div className="text-center py-4">
              <p className="text-neutral-500 text-sm">{t("p2p.yourOffer")}</p>
            </div>
          ) : !auth.user ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-neutral-500 text-sm">{t("p2p.loginToTrade")}</p>
              <Button
                onClick={() => navigate("/signin")}
                className="w-full bg-white text-black"
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white font-medium">
                {offer.offer_type === "SELL" ? "Buy" : "Sell"} {offer.coin_id}
              </p>

              {/* Montant */}
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">
                  {t("p2p.amount")} (USD)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 bg-neutral-800 border-neutral-700"
                  placeholder={`${offer.min_amount} - ${offer.max_amount}`}
                />
              </div>

              {/* Quantité calculée */}
              {amount && Number(amount) > 0 && (
                <div className="p-3 rounded-lg bg-neutral-800/50 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t("p2p.youReceive")}</span>
                    <span className="text-white font-medium">
                      {quantity} {offer.coin_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">{t("p2p.commission")}</span>
                    <span className="text-neutral-400">
                      -{commission.toFixed(8)} {offer.coin_id}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-700 pt-2">
                    <span className="text-neutral-500">{t("p2p.netReceived")}</span>
                    <span className="text-green-500 font-medium">
                      {(Number(quantity) - commission).toFixed(8)} {offer.coin_id}
                    </span>
                  </div>
                </div>
              )}

              {/* Méthode paiement */}
              <div>
                <label className="text-xs text-neutral-400 mb-1.5 block">
                  {t("p2p.paymentMethod")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {offer.payment_methods?.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMethod(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        selectedMethod === m
                          ? "border-white bg-neutral-800 text-white"
                          : "border-neutral-800 text-neutral-500"
                      }`}
                    >
                      {m.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                onClick={handleTrade}
                disabled={p2p.actionLoading || !amount || !selectedMethod}
                className="w-full h-11 bg-white text-black hover:bg-neutral-200 font-medium disabled:opacity-50"
              >
                {p2p.actionLoading ? "Processing..." : `Trade ${offer.coin_id}`}
              </Button>

              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Shield className="h-3.5 w-3.5" />
                <span>{t("p2p.cryptoLocked")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default P2POffer;
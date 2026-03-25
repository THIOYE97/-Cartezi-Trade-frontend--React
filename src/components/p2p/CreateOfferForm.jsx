import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOffer } from "@/Redux/P2P/P2PSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import EscrowLockButton from "./EscrowLockButton";

const PAYMENT_METHODS = ["WAVE", "ORANGE_MONEY", "MTN", "BANK", "CRYPTO"];
const REGIONS = ["AFRICA", "EUROPE", "ALL"];
const COINS = ["bitcoin", "ethereum", "solana", "usdt", "bnb"];

const CreateOfferForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { p2p } = useSelector((s) => s);

  // ← useState DANS le composant
  const [createdOffer, setCreatedOffer] = useState(null);
  const [form, setForm] = useState({
    offerType: "SELL",
    coinId: "bitcoin",
    quantity: "",
    pricePerUnit: "",
    minAmount: "",
    maxAmount: "",
    paymentMethods: [],
    region: "AFRICA",
    country: "",
    terms: "",
  });

  const toggleMethod = (method) => {
    setForm((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  const handleSubmit = async () => {
    const result = await dispatch(createOffer({
      ...form,
      quantity: Number(form.quantity),
      pricePerUnit: Number(form.pricePerUnit),
      minAmount: Number(form.minAmount),
      maxAmount: Number(form.maxAmount),
    }));
    if (!result.error) {
      setCreatedOffer(result.payload);
    }
  };

  // ← Si offre créée, montrer l'étape escrow
  if (createdOffer) {
    return (
      <div className="space-y-4 py-2">
        <div className="flex items-center gap-2 text-green-500 text-sm">
          <CheckCircle className="h-4 w-4" />
          Offer created — lock your crypto to activate it
        </div>
        <EscrowLockButton
          offer={createdOffer}
          onSuccess={() => onSuccess?.()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 py-2">
      {/* Type BUY/SELL */}
      <div className="flex gap-2">
        {["SELL", "BUY"].map((t) => (
          <button
            key={t}
            onClick={() => setForm((p) => ({ ...p, offerType: t }))}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all ${
              form.offerType === t
                ? t === "SELL"
                  ? "bg-green-500/10 border-green-500/40 text-green-500"
                  : "bg-red-500/10 border-red-500/40 text-red-500"
                : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Coin */}
      <div>
        <label className="text-xs text-neutral-400 mb-1.5 block">Cryptocurrency</label>
        <div className="flex flex-wrap gap-2">
          {COINS.map((c) => (
            <button
              key={c}
              onClick={() => setForm((p) => ({ ...p, coinId: c }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border uppercase transition-all ${
                form.coinId === c
                  ? "border-white bg-neutral-800 text-white"
                  : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Quantité + Prix */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Quantity</label>
          <Input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
            className="h-10 bg-neutral-800 border-neutral-700 text-sm"
            placeholder="0.001"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Price per unit (USD)</label>
          <Input
            type="number"
            value={form.pricePerUnit}
            onChange={(e) => setForm((p) => ({ ...p, pricePerUnit: e.target.value }))}
            className="h-10 bg-neutral-800 border-neutral-700 text-sm"
            placeholder="70000"
          />
        </div>
      </div>

      {/* Min/Max */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Min amount (USD)</label>
          <Input
            type="number"
            value={form.minAmount}
            onChange={(e) => setForm((p) => ({ ...p, minAmount: e.target.value }))}
            className="h-10 bg-neutral-800 border-neutral-700 text-sm"
            placeholder="10"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Max amount (USD)</label>
          <Input
            type="number"
            value={form.maxAmount}
            onChange={(e) => setForm((p) => ({ ...p, maxAmount: e.target.value }))}
            className="h-10 bg-neutral-800 border-neutral-700 text-sm"
            placeholder="700"
          />
        </div>
      </div>

      {/* Méthodes de paiement */}
      <div>
        <label className="text-xs text-neutral-400 mb-1.5 block">Payment methods accepted</label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => toggleMethod(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                form.paymentMethods.includes(m)
                  ? "border-violet-500/40 bg-violet-500/10 text-violet-400"
                  : "border-neutral-800 text-neutral-500 hover:border-neutral-600"
              }`}
            >
              {m.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Région + Pays */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Region</label>
          <div className="flex gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setForm((p) => ({ ...p, region: r }))}
                className={`flex-1 py-2 rounded-lg text-xs border transition-all ${
                  form.region === r
                    ? "border-white bg-neutral-800 text-white"
                    : "border-neutral-800 text-neutral-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-neutral-400 mb-1.5 block">Country code</label>
          <Input
            value={form.country}
            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value.toUpperCase() }))}
            className="h-10 bg-neutral-800 border-neutral-700 text-sm uppercase"
            placeholder="SN, CI, FR..."
            maxLength={2}
          />
        </div>
      </div>

      {/* Terms */}
      <div>
        <label className="text-xs text-neutral-400 mb-1.5 block">Terms (optional)</label>
        <textarea
          value={form.terms}
          onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))}
          className="w-full h-20 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:border-neutral-500"
          placeholder="Payment within 15 minutes via Wave..."
        />
      </div>

      {p2p.error && (
        <p className="text-red-500 text-sm text-center">{p2p.error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={
          p2p.actionLoading ||
          !form.quantity || !form.pricePerUnit ||
          !form.minAmount || !form.maxAmount ||
          !form.paymentMethods.length
        }
        className="w-full h-11 bg-white text-black hover:bg-neutral-200 font-medium disabled:opacity-50"
      >
        {p2p.actionLoading ? "Creating..." : "Create Offer"}
      </Button>
    </div>
  );
};

export default CreateOfferForm;

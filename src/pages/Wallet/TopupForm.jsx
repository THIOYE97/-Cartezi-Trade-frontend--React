import { paymentHandler } from "@/Redux/Wallet/WalletSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

const TopupForm = () => {
  const [amount, setAmount] = useState("");
  const { wallet } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || value < 1) return;
    dispatch(paymentHandler({ amount: value }));
  };

  return (
    <div className="pt-6 space-y-6">
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Amount (USD)</label>
        <Input
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500 text-center text-xl"
          placeholder="0.00"
          type="number"
          min="1"
        />
      </div>

      {/* Quick select */}
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Quick select</label>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(String(val))}
              className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                amount === String(val)
                  ? "border-white bg-neutral-800 text-white"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white"
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>

      {/* Stripe badge */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800 bg-neutral-900/50">
    <img
  src="https://js.stripe.com/v3/fingerprinted/img/stripe-logo-blurple-ea87e36a5b914db6f8f3f5e2.svg"
  alt="Stripe"
  className="h-5 opacity-70"
  referrerPolicy="no-referrer"
/>
        <span className="text-neutral-400 text-sm">Secured by Stripe</span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!amount || Number(amount) < 1 || wallet.loading}
        className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg disabled:opacity-50"
      >
        {wallet.loading ? "Redirecting..." : `Deposit ${amount ? `$${amount}` : ""}`}
      </Button>
    </div>
  );
};

export default TopupForm;
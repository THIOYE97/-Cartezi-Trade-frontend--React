import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { lockEthInEscrow, waitForConfirmation } from "@/services/escrowService";
import api from "@/Api/api";
import { Shield, Loader2, CheckCircle, ExternalLink } from "lucide-react";

const EscrowLockButton = ({ offer, onSuccess }) => {
  const [step, setStep] = useState("idle");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const isEth = offer.coin_id === "ethereum";

  const handleLock = async () => {
    setError("");
    if (!window.ethereum) return setError("MetaMask required.");

    try {
      if (!isEth) {
        return setError("Only ETH escrow supported for now");
      }

      const amountEth = Number(offer.quantity);
      const totalToSend = amountEth * 1.01; // +1% commission

      setStep("sending");
      const { txHash: hash } = await lockEthInEscrow(totalToSend);
      setTxHash(hash);

      setStep("confirming");
      await waitForConfirmation(hash);

      setStep("verifying");
      await api.post(`/api/p2p/offers/${offer.id}/verify-escrow`, {
        txHash: hash,
        quantityEth: amountEth,
      });

      setStep("done");
      onSuccess?.(hash);
    } catch (e) {
      setError(e.message || "Transaction failed");
      setStep("idle");
    }
  };

  const STEPS = {
    sending:    "Sending transaction...",
    confirming: "Waiting for confirmation (~30s)...",
    verifying:  "Verifying on-chain...",
  };

  if (step === "done") {
    return (
      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
        <div>
          <p className="text-green-500 font-medium text-sm">Crypto locked in escrow ✓</p>
          <a
            href={`${import.meta.env.VITE_ETHERSCAN_URL || "https://sepolia.etherscan.io"}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 text-xs hover:text-neutral-300 flex items-center gap-1 mt-0.5"
          >
            View on Etherscan <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
        <p className="text-white text-sm font-medium mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-violet-400" />
          Escrow via MetaMask
        </p>
        <div className="space-y-1 text-xs text-neutral-400">
          <div className="flex justify-between">
            <span>Quantity to lock</span>
            <span className="text-white">{offer.quantity} {offer.coin_id}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform commission (1%)</span>
            <span>{(Number(offer.quantity) * 0.01).toFixed(8)} {offer.coin_id}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-700 pt-1 mt-1">
            <span>Total to send</span>
            <span className="text-white font-medium">
              {(Number(offer.quantity) * 1.01).toFixed(8)} {offer.coin_id}
            </span>
          </div>
        </div>
      </div>

      {step !== "idle" && (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{STEPS[step]}</span>
        </div>
      )}

      {txHash && step === "confirming" && (
        <a
          href={`${import.meta.env.VITE_ETHERSCAN_URL || "https://sepolia.etherscan.io"}/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:underline flex items-center gap-1"
        >
          Track on Etherscan <ExternalLink className="h-3 w-3" />
        </a>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        onClick={handleLock}
        disabled={step !== "idle"}
        className="w-full bg-white text-black hover:bg-neutral-200 font-medium disabled:opacity-50"
      >
        {step === "idle" ? (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Lock {(Number(offer.quantity) * 1.01).toFixed(6)} ETH in Escrow
          </>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
      </Button>

      <p className="text-xs text-neutral-600 text-center">
        Funds held by Cartezi Trade — released when trade completes
      </p>
    </div>
  );
};

export default EscrowLockButton;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeById, lockEscrow, confirmPaymentSent, completeTrade, openDispute, cancelTrade } from "@/Redux/P2P/P2PSlice";
import TradeChat from "@/components/p2p/TradeChat";
import PaymentBadge from "@/components/p2p/PaymentBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { useTranslation } from "react-i18next";


const STATUS_STEPS = ["PENDING", "ESCROW_LOCKED", "PAYMENT_SENT", "COMPLETED"];
const STATUS_INFO = {
  PENDING:       { label: "Waiting for escrow", color: "text-orange-400" },
  ESCROW_LOCKED: { label: "Crypto locked",      color: "text-blue-400"  },
  PAYMENT_SENT:  { label: "Payment sent",       color: "text-violet-400"},
  COMPLETED:     { label: "Completed",          color: "text-green-500" },
  DISPUTED:      { label: "Disputed",           color: "text-red-500"   },
  CANCELLED:     { label: "Cancelled",          color: "text-neutral-500"},
  EXPIRED:       { label: "Expired",            color: "text-neutral-500"},
};

const P2PTrade = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { p2p, auth } = useSelector((s) => s);
  const trade = p2p.currentTrade;
  const [escrowHash, setEscrowHash] = useState("");
  const [releaseHash, setReleaseHash] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [showDispute, setShowDispute] = useState(false);

  useEffect(() => {
    dispatch(fetchTradeById(id));
    const interval = setInterval(() => dispatch(fetchTradeById(id)), 10000);
    return () => clearInterval(interval);
  }, [id, dispatch]);

  if (p2p.loading && !trade) return <SpinnerBackdrop />;
  if (!trade) return null;

  const isSeller = auth.user?.id === trade.seller_id;
  const isBuyer  = auth.user?.id === trade.buyer_id;
  const status   = trade.status;
  const info     = STATUS_INFO[status] || {};
  const stepIdx  = STATUS_STEPS.indexOf(status);
  const expiresAt = trade.expires_at ? new Date(trade.expires_at) : null;
  const remaining = expiresAt ? Math.max(0, expiresAt - Date.now()) : 0;
  const minutes   = Math.floor(remaining / 60000);
  const seconds   = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <button onClick={() => navigate("/p2p/trades")} className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        {t("p2p.backToTrades")}
      </button>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-neutral-500 text-xs mb-1">{t("p2p.trade")} #{trade.id.slice(-8)}</p>
                <h2 className="text-white text-xl font-semibold">{Number(trade.quantity).toFixed(8)} {trade.coin_id}</h2>
                <p className="text-neutral-400 text-sm mt-0.5">@ ${Number(trade.unit_price).toLocaleString()} · Total ${Number(trade.total_fiat).toLocaleString()} {trade.currency}</p>
              </div>
              <span className={"font-medium text-sm " + info.color}>{info.label}</span>
            </div>
            {!["DISPUTED","CANCELLED","EXPIRED"].includes(status) && (
              <div className="flex gap-2 mb-4">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className={"h-2 flex-1 rounded-full transition-all " + (i <= stepIdx ? "bg-white" : "bg-neutral-800")} />
                ))}
              </div>
            )}
            {expiresAt && ["ESCROW_LOCKED","PENDING"].includes(status) && remaining > 0 && (
              <div className="flex items-center gap-2 text-orange-400 text-sm mb-4">
                <Clock className="h-4 w-4" />
                <span>{t("p2p.expiresIn")} {minutes}:{String(seconds).padStart(2, "0")}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm border-t border-neutral-800 pt-4">
              <div>
                <p className="text-neutral-500 mb-1">{t("p2p.seller")}</p>
                <p className="text-white font-medium">{trade.seller_name}</p>
                <p className="text-neutral-600 text-xs">{trade.seller_email}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">{t("p2p.buyer")}</p>
                <p className="text-white font-medium">{trade.buyer_name}</p>
                <p className="text-neutral-600 text-xs">{trade.buyer_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-800">
              <span className="text-neutral-500 text-sm">{t("p2p.payment")}</span>
              <PaymentBadge method={trade.payment_method} size="lg" />
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="text-white font-medium">{t("p2p.actions")}</h3>

            {status === "PENDING" && isSeller && (
              <div className="space-y-3">
                <p className="text-neutral-400 text-sm">{t("p2p.sendToEscrow")} {Number(trade.quantity).toFixed(8)} {trade.coin_id} to escrow via MetaMask, then paste the transaction hash.</p>
                <Input value={escrowHash} onChange={(e) => setEscrowHash(e.target.value)} className="bg-neutral-800 border-neutral-700 font-mono text-xs" placeholder="0x... MetaMask transaction hash" />
                <Button onClick={() => dispatch(lockEscrow({ tradeId: id, escrowTxHash: escrowHash }))} disabled={!escrowHash || p2p.actionLoading} className="w-full bg-white text-black hover:bg-neutral-200">
                  {p2p.actionLoading ? "Locking..." : "Lock Escrow"}
                </Button>
              </div>
            )}

            {status === "PENDING" && isBuyer && (
              <div className="p-4 rounded-lg bg-neutral-800/50 text-center">
                <p className="text-neutral-400 text-sm">{t("p2p.waitingForSeller")}</p>
              </div>
            )}

            {status === "ESCROW_LOCKED" && isBuyer && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium text-sm">{t("p2p.cryptoLocked")}</span>
                  </div>
                  <p className="text-neutral-400 text-sm">{t("p2p.cryptoLockedDetails")} {trade.currency} {Number(trade.total_fiat).toLocaleString()} via <strong className="text-white">{trade.payment_method.replace("_", " ")}</strong> to the seller, then confirm below.</p>
                  {trade.escrow_tx_hash && (
                    <p className="text-neutral-600 font-mono text-xs mt-2 break-all">Escrow tx: {trade.escrow_tx_hash}</p>
                  )}
                </div>
                <Input value={proofUrl} onChange={(e) => setProofUrl(e.target.value)} className="bg-neutral-800 border-neutral-700 text-sm" placeholder="Payment proof URL (screenshot, reference...)" />
                <Button onClick={() => dispatch(confirmPaymentSent({ tradeId: id, paymentProofUrl: proofUrl }))} disabled={p2p.actionLoading} className="w-full bg-white text-black hover:bg-neutral-200">
                  {p2p.actionLoading ? "Confirming..." : "I've Sent the Payment"}
                </Button>
              </div>
            )}

            {status === "ESCROW_LOCKED" && isSeller && (
              <div className="p-4 rounded-lg bg-neutral-800/50 text-center">
                <p className="text-neutral-400 text-sm">{t("p2p.waitingForBuyer")}</p>
              </div>
            )}

            {status === "PAYMENT_SENT" && isSeller && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <p className="text-violet-400 font-medium text-sm mb-1">{t("p2p.buyerConfirmedPayment")}</p>
                  <p className="text-neutral-400 text-sm">{t("p2p.checkYourAccount")} {trade.payment_method.replace("_", " ")} {t("p2p.ifPaymentReceived")}</p>
                  {trade.payment_proof_url && (
                    <a href={trade.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline mt-1 block">
                      {t("p2p.viewPaymentProof")}
                    </a>
                  )}
                </div>
                <Input value={releaseHash} onChange={(e) => setReleaseHash(e.target.value)} className="bg-neutral-800 border-neutral-700 font-mono text-xs" placeholder="0x... Release transaction hash" />
                <Button onClick={() => dispatch(completeTrade({ tradeId: id, releaseTxHash: releaseHash }))} disabled={!releaseHash || p2p.actionLoading} className="w-full bg-green-500 text-white hover:bg-green-600">
                  {p2p.actionLoading ? "Releasing..." : "Release Crypto & Complete"}
                </Button>
              </div>
            )}

            {status === "PAYMENT_SENT" && isBuyer && (
              <div className="p-4 rounded-lg bg-neutral-800/50 text-center">
                <p className="text-neutral-400 text-sm">{t("p2p.waitingForSeller")}</p>
              </div>
            )}

            {status === "COMPLETED" && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-green-500 font-medium text-sm">{t("p2p.tradeCompleted")}</p>
                  {trade.release_tx_hash && (
                    <p className="text-neutral-500 font-mono text-xs mt-0.5 break-all">{trade.release_tx_hash}</p>
                  )}
                </div>
              </div>
            )}

            {status === "PENDING" && (
              <Button onClick={() => dispatch(cancelTrade(id))} variant="ghost" className="w-full text-red-500 hover:bg-red-500/10">
                {t("p2p.cancelTrade")}
              </Button>
            )}

            {["ESCROW_LOCKED","PAYMENT_SENT"].includes(status) && (
              showDispute ? (
                <div className="space-y-2">
                  <Input value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} className="bg-neutral-800 border-neutral-700 text-sm" placeholder="Describe the issue..." />
                  <div className="flex gap-2">
                    <Button onClick={() => dispatch(openDispute({ tradeId: id, reason: disputeReason }))} disabled={!disputeReason} className="flex-1 bg-red-500 text-white hover:bg-red-600">Open Dispute</Button>
                    <Button onClick={() => setShowDispute(false)} variant="ghost" className="flex-1">{t("p2p.cancel")}</Button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowDispute(true)} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-red-500 transition-colors">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {t("p2p.reportIssue")}
                </button>
              )
            )}
          </div>
        </div>

        <div className="lg:col-span-2 card flex flex-col" style={{ minHeight: "500px" }}>
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-white font-medium text-sm">{t("p2p.tradeChat")}</h3>
            <p className="text-neutral-600 text-xs mt-0.5">{isSeller ? "With " + trade.buyer_name : "With " + trade.seller_name}</p>
          </div>
          <div className="flex-1 min-h-0">
            <TradeChat tradeId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PTrade;

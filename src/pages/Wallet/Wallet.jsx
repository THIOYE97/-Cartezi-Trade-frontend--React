import {
  getUserWallet,
  getWalletTransactions,
  checkDepositStatus,
} from "@/Redux/Wallet/WalletSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CopyIcon,
  ReloadIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  DollarSign,
  WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopupForm from "./TopupForm";
import TransferForm from "./TransferForm";
import WithdrawForm from "./WithdrawForm";
import { getPaymentDetails } from "@/Redux/Withdrawal/WithdrawalSlice";
import { useLocation, useNavigate } from "react-router-dom";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import MetaMaskButton from "@/components/wallet/MetaMaskButton";
import { refreshMetaMaskBalance } from "@/Redux/Wallet/MetaMaskSlice";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Wallet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wallet } = useSelector((store) => store);
  const { address, balance } = useSelector((s) => s.metamask);
  const query = useQuery();
  const orderId = query.get("order_id");
  const depositSuccess = query.get("deposit");
  const { t } = useTranslation();

  // Vérifier statut dépôt Stripe après retour
  useEffect(() => {
    if (orderId && depositSuccess === "success") {
      dispatch(checkDepositStatus(orderId)).then(() => {
        dispatch(getUserWallet());
        navigate("/wallet", { replace: true });
      });
    }
  }, [orderId, depositSuccess]);

  useEffect(() => {
    dispatch(getUserWallet());
    dispatch(getWalletTransactions());
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  if (wallet.loading && !wallet.userWallet) {
    return <SpinnerBackdrop />;
  }

  if (wallet.error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {wallet.error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn space-y-6">

      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-white mb-1">{t("wallet.title")}</h1>
        <p className="text-neutral-500">{t("wallet.subtitle")}</p>
      </div>

      {/* Grille — Cartezi Wallet + MetaMask côte à côte */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* ── Cartezi Wallet ── */}
        <Card className="card">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                  <WalletIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium text-white">
                    Cartezi Balance
                  </CardTitle>
                  <div className="flex items-center gap-2 text-neutral-500 text-xs mt-0.5">
                    <span className="font-mono">
                      #{wallet.userWallet?.id?.slice(0, 16)}
                    </span>
                    <CopyIcon
                      onClick={() => copyToClipboard(wallet.userWallet?.id)}
                      className="h-3 w-3 cursor-pointer hover:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
              <ReloadIcon
                onClick={() => dispatch(getUserWallet())}
                className="w-4 h-4 cursor-pointer text-neutral-500 hover:text-white transition-colors"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-semibold text-white">
                ${Number(wallet.userWallet?.balance || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-neutral-500 text-sm">USD</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex-1 h-16 card-hover flex flex-col items-center justify-center gap-1.5 rounded-xl">
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-neutral-400">{t("wallet.deposit")}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-center text-white">
                      {t("wallet.deposit")} Funds
                    </DialogTitle>
                  </DialogHeader>
                  <TopupForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex-1 h-16 card-hover flex flex-col items-center justify-center gap-1.5 rounded-xl">
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-neutral-400">{t("wallet.withdraw")}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-center text-white">
                      {t("wallet.withdraw")} Funds
                    </DialogTitle>
                  </DialogHeader>
                  <WithdrawForm />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex-1 h-16 card-hover flex flex-col items-center justify-center gap-1.5 rounded-xl">
                    <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-neutral-400">{t("wallet.transfer")}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-800">
                  <DialogHeader>
                    <DialogTitle className="text-center text-white">
                      {t("wallet.transfer")} Funds
                    </DialogTitle>
                  </DialogHeader>
                  <TransferForm />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* ── MetaMask Wallet ── */}
        <Card className="card">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    className="h-6 w-6"
                    alt="MetaMask"
                  />
                </div>
                <div>
                  <CardTitle className="text-base font-medium text-white">
                    MetaMask
                  </CardTitle>
                  <p className="text-neutral-500 text-xs mt-0.5">
                    {address
                      ? `${address.slice(0, 8)}...${address.slice(-6)}`
                      : "Not connected"}
                  </p>
                </div>
              </div>
              {address && (
                <ReloadIcon
                  onClick={() => dispatch(refreshMetaMaskBalance(address))}
                  className="w-4 h-4 cursor-pointer text-neutral-500 hover:text-white transition-colors"
                />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {address ? (
              <>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-semibold text-white">
                    {Number(balance).toFixed(6)}
                  </span>
                  <span className="text-neutral-500 text-sm">ETH</span>
                </div>

                {/* Actions MetaMask */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(address)
                    }
                    className="flex-1 h-16 card-hover flex flex-col items-center justify-center gap-1.5 rounded-xl"
                  >
                    <CopyIcon className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs text-neutral-400">Copy</span>
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/address/${address}`,
                        "_blank"
                      )
                    }
                    className="flex-1 h-16 card-hover flex flex-col items-center justify-center gap-1.5 rounded-xl"
                  >
                    <ExternalLink className="h-4 w-4 text-neutral-400" />
                    <span className="text-xs text-neutral-400">Etherscan</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 gap-4">
                <p className="text-neutral-500 text-sm text-center">
                  Connect your MetaMask {t("wallet.title")} to view your ETH balance
                </p>
                <MetaMaskButton />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">{t("wallet.history")}</h2>
          <UpdateIcon
            onClick={() => dispatch(getWalletTransactions())}
            className="h-4 w-4 cursor-pointer text-neutral-500 hover:text-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          {wallet.transactions?.map((item, index) => (
            <div
              key={item.id || index}
              className="card p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    Number(item.amount) > 0
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  {Number(item.amount) > 0 ? (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white capitalize">
                    {item.purpose?.toLowerCase().replace(/_/g, " ") ||
                      item.type}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  Number(item.amount) > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Number(item.amount) > 0 ? "+" : ""}
                {Number(item.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}{" "}
                USD
              </span>
            </div>
          ))}

          {(!wallet.transactions || wallet.transactions.length === 0) && (
            <div className="py-12 text-center">
              <p className="text-neutral-500 text-sm">{t("wallet.noTransactions")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
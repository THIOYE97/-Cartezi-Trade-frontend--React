import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffers } from "@/Redux/P2P/P2PSlice";
import OfferCard from "@/components/p2p/OfferCard";
import CreateOfferForm from "@/components/p2p/CreateOfferForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const COINS   = ["All", "bitcoin", "ethereum", "solana", "usdt"];
const REGIONS = ["All", "AFRICA", "EUROPE"];
const METHODS = ["All", "WAVE", "ORANGE_MONEY", "MTN", "BANK", "CRYPTO"];
const TYPES   = ["All", "SELL", "BUY"];

const P2PMarket = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { p2p, auth } = useSelector((s) => s);
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [filters, setFilters] = useState({
    coinId: "", region: "", paymentMethod: "", offerType: "",
  });
  const [openCreate, setOpenCreate] = useState(false);

  const load = () => {
    const params = {};
    if (filters.coinId)        params.coinId        = filters.coinId;
    if (filters.region)        params.region        = filters.region;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters.offerType)     params.offerType     = filters.offerType;
    dispatch(fetchOffers(params));
  };

  useEffect(() => { load(); }, [filters]);

  const setFilter = (key, val) =>
    setFilters((p) => ({ ...p, [key]: val === "All" ? "" : val }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl font-semibold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
            {t("p2p.market")}
          </h1>
          <p className={isLight ? "text-gray-500" : "text-neutral-500"}>
            {t("p2p.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={load}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-neutral-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {auth.user && (
            <>
              <Button
                onClick={() => navigate("/p2p/trades")}
                variant="outline"
                className="h-9 border-neutral-800 text-neutral-300 hover:text-white"
              >
                {t("p2p.myTrades")}
              </Button>

              <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                <DialogTrigger asChild>
                  <Button className="h-9 bg-white text-black hover:bg-neutral-200 gap-2">
                    <Plus className="h-4 w-4" />
                    {t("p2p.createOffer")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-900 border-neutral-800 max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">New P2P Offer</DialogTitle>
                  </DialogHeader>
                  <CreateOfferForm onSuccess={() => { setOpenCreate(false); load(); }} />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-4 mb-6 space-y-3">
        <FilterRow label="Type"    options={TYPES}   active={filters.offerType     || "All"} onSelect={(v) => setFilter("offerType", v)} />
        <FilterRow label="Coin"    options={COINS}   active={filters.coinId        || "All"} onSelect={(v) => setFilter("coinId", v)} />
        <FilterRow label="Region"  options={REGIONS} active={filters.region        || "All"} onSelect={(v) => setFilter("region", v)} />
        <FilterRow label="Payment" options={METHODS} active={filters.paymentMethod || "All"} onSelect={(v) => setFilter("paymentMethod", v)} />
      </div>

      {/* Grille d'offres */}
      {p2p.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-40" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : p2p.offers.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-500 mb-3">{t("p2p.noOffers")}</p>
          {auth.user && (
            <Button
              onClick={() => setOpenCreate(true)}
              className="bg-white text-black hover:bg-neutral-200"
            >
              Be the first to create an offer
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {p2p.offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant filtre réutilisable
const FilterRow = ({ label, options, active, onSelect }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-neutral-600 w-16 shrink-0">{label}</span>
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
            active === opt
              ? "border-white bg-neutral-800 text-white"
              : "border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
          }`}
        >
          {opt.replace("_", " ")}
        </button>
      ))}
    </div>
  </div>
);

export default P2PMarket;
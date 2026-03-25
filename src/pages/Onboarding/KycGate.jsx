import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { logout, getUser } from "@/Redux/Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import api from "@/Api/api";
import SumsubWebSdk from "@sumsub/websdk-react";

const KycGate = () => {
  const { auth } = useSelector((s) => s);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pollingRef = useRef(null);

  useEffect(() => {
    if (auth.user?.kycStatus === "GREEN" || auth.user?.verified === true) {
      navigate("/", { replace: true });
    }
  }, [auth.user?.kycStatus, auth.user?.verified, navigate]);

  useEffect(() => {
    if (token) {
      pollingRef.current = setInterval(() => {
        dispatch(getUser(localStorage.getItem("jwt")));
      }, 4000);
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [token, dispatch]);

  useEffect(() => {
    if (auth.user?.kycStatus === "GREEN" || auth.user?.verified === true) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      navigate("/", { replace: true });
    }
  }, [auth.user?.kycStatus, auth.user?.verified, navigate]);

  // ← Fonction manquante ajoutée ici
  const handleStartKyc = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/users/kyc/token");
      setToken(data.token);
    } catch (e) {
      setError(e.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleKycMessage = async (type, payload) => {
    console.log("Sumsub event:", type, payload);
    dispatch(getUser(localStorage.getItem("jwt")));
  };

  if (auth.user?.kycStatus === "GREEN" || auth.user?.verified === true) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Cartezi Trade</h1>
          <p className="text-neutral-500 text-sm">{t("kyc.subtitle")}</p>
        </div>
        <div className="card p-6">
          {!token ? (
            <div className="space-y-6 text-center">
              <div className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto text-4xl">🛡️</div>
              <div>
                <h2 className="text-white font-semibold text-lg mb-2">{t("kyc.title")}</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">{t("kyc.desc")}</p>
              </div>
              <div className="p-4 rounded-lg bg-neutral-800/50 text-left space-y-2">
                {[t("kyc.id"), t("kyc.selfie"), t("kyc.proof")].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-neutral-300">
                    <span className="text-green-500">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                onClick={handleStartKyc}
                disabled={loading}
                className="w-full h-11 bg-white text-black hover:bg-neutral-200 font-medium"
              >
                {loading ? t("kyc.loading") : t("kyc.start")}
              </Button>
              <button
                onClick={() => { dispatch(logout()); navigate("/"); }}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                {t("kyc.signout")}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-neutral-400 text-sm text-center mb-4">{t("kyc.complete")}</p>
              <SumsubWebSdk
                accessToken={token}
                expirationHandler={handleStartKyc}
                config={{ lang: i18n.language || "en" }}
                onMessage={handleKycMessage}
                onError={(err) => {
                  console.error("Sumsub error:", err);
                  setError("Verification error. Please try again.");
                  setToken("");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KycGate;
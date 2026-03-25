import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/Api/api";
import { getUser } from "@/Redux/Auth/AuthSlice";
import SumsubWebSdk from "@sumsub/websdk-react";

const COUNTRIES = [
  "Senegal","Côte d'Ivoire","Mali","Burkina Faso","Guinea","Cameroon",
  "Nigeria","Ghana","Togo","Benin","France","Belgium","Germany",
  "United Kingdom","USA","Canada","Other"
];

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((s) => s);
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sumsubToken, setSumsubToken] = useState("");

  const [form, setForm] = useState({
    fullName:    auth.user?.fullName || "",
    dateOfBirth: "",
    nationality: "",
    addressLine: "",
    city:        "",
    country:     "",
    postcode:    "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // STEPS : 0=Identity 1=Address 2=Email 3=KYC
  const STEPS = [
    t("onboarding.identity"),
    t("onboarding.address"),
    t("onboarding.verifyEmail"),
    "KYC",
  ];

  const handleNextStep1 = () => {
    if (!form.fullName || !form.dateOfBirth || !form.nationality) {
      return setError(t("onboarding.required"));
    }
    setError("");
    setStep(1);
  };

  const handleNextStep2 = () => {
    if (!form.country) return setError(t("onboarding.selectCountryRequired"));
    setError("");
    setStep(2);
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/api/users/verification/EMAIL/send-otp");
      setOtpSent(true);
    } catch (e) {
      setError(e.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

const handleEmailVerify = async () => {
  if (!otp || otp.length !== 6) return setError("Enter the 6-digit code");
  setLoading(true);
  setError("");
  try {
    // 1. Vérifier OTP email
    await api.patch(`/api/users/verification/verify-otp/${otp}`);
    
    // 2. Sauvegarder profil
    await api.post("/api/users/onboarding", form);
    
    // 3. Obtenir token Sumsub
    const { data } = await api.post("/api/users/kyc/token");
    setSumsubToken(data.token);
    
    // 4. Passer au KYC — NE PAS appeler getUser ici
    // getUser est appelé seulement dans handleKycMessage et handleSkipKyc
    setStep(3);
  } catch (e) {
    setError(e.response?.data?.message || t("common.error"));
  } finally {
    setLoading(false);
  }
};

  const handleRefreshKycToken = async () => {
    try {
      const { data } = await api.post("/api/users/kyc/token");
      setSumsubToken(data.token);
    } catch {}
  };

const handleKycMessage = async (type) => {
  if (
    type === "idCheck.applicantReviewComplete" ||
    type === "idCheck.onApplicantSubmitted"
  ) {
    await dispatch(getUser(localStorage.getItem("jwt")));
    navigate("/");
  }
};

  const handleSkipKyc = async () => {
    await dispatch(getUser(localStorage.getItem("jwt")));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Cartezi Trade</h1>
          <p className="text-neutral-500 text-sm">
            {t("onboarding.title")} {t("onboarding.subtitle")}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={"flex-1 h-1 rounded-full transition-all " + (i <= step ? "bg-white" : "bg-neutral-800")}
            />
          ))}
        </div>
        <p className="text-neutral-500 text-xs mb-6">
          {t("onboarding.step")} {step + 1} {t("onboarding.of")} {STEPS.length} — {STEPS[step]}
        </p>

        <div className={"card p-6 space-y-5" + (step === 3 ? " p-0 overflow-hidden" : "")}>

          {/* ── Step 0 — Identity ─────────────────────── */}
          {step === 0 && (
            <>
              <h2 className="text-white font-medium">{t("onboarding.identity")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.fullName")} *</label>
                  <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="bg-neutral-800 border-neutral-700" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.dateOfBirth")} *</label>
                  <Input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} className="bg-neutral-800 border-neutral-700" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.nationality")} *</label>
                  <Input value={form.nationality} onChange={(e) => set("nationality", e.target.value)} className="bg-neutral-800 border-neutral-700" placeholder="Senegalese" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleNextStep1} className="w-full bg-white text-black hover:bg-neutral-200">
                {t("onboarding.continue")}
              </Button>
            </>
          )}

          {/* ── Step 1 — Address ──────────────────────── */}
          {step === 1 && (
            <>
              <h2 className="text-white font-medium">{t("onboarding.address")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.country")} *</label>
                  <select
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="w-full h-10 bg-neutral-800 border border-neutral-700 rounded-lg px-3 text-sm text-white focus:outline-none"
                  >
                    <option value="">{t("onboarding.selectCountry")}</option>
                    {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.city")}</label>
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} className="bg-neutral-800 border-neutral-700" placeholder="Dakar" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.addressLine")}</label>
                  <Input value={form.addressLine} onChange={(e) => set("addressLine", e.target.value)} className="bg-neutral-800 border-neutral-700" placeholder="123 Rue principale" />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 mb-1.5 block">{t("onboarding.postcode")}</label>
                  <Input value={form.postcode} onChange={(e) => set("postcode", e.target.value)} className="bg-neutral-800 border-neutral-700" placeholder="10000" />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-2">
                <Button onClick={() => setStep(0)} variant="ghost" className="flex-1 text-neutral-400">{t("onboarding.back")}</Button>
                <Button onClick={handleNextStep2} className="flex-1 bg-white text-black hover:bg-neutral-200">{t("onboarding.continue")}</Button>
              </div>
            </>
          )}

          {/* ── Step 2 — Verify Email ─────────────────── */}
          {step === 2 && (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-3xl">✉️</div>
              <div>
                <h2 className="text-white font-medium">{t("onboarding.verifyEmail")}</h2>
                <p className="text-neutral-500 text-sm mt-1">{auth.user?.email}</p>
              </div>

              {!otpSent ? (
                <Button onClick={handleSendOtp} disabled={loading} className="w-full bg-white text-black hover:bg-neutral-200">
                  {loading ? t("common.loading") : t("onboarding.sendCode")}
                </Button>
              ) : (
                <div className="space-y-4 text-left">
                  <p className="text-neutral-400 text-sm text-center">{t("onboarding.enterCode")}</p>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="bg-neutral-800 border-neutral-700 text-center text-xl tracking-widest font-mono"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <Button onClick={handleEmailVerify} disabled={loading || otp.length !== 6} className="w-full bg-white text-black hover:bg-neutral-200">
                    {loading ? t("common.loading") : t("onboarding.complete")}
                  </Button>
                  <button onClick={handleSendOtp} className="text-xs text-neutral-600 hover:text-white w-full text-center">
                    {t("onboarding.resend")}
                  </button>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button onClick={() => setStep(1)} className="text-xs text-neutral-600 hover:text-white w-full text-center">
                ← {t("onboarding.back")}
              </button>
            </div>
          )}

          {/* ── Step 3 — KYC Sumsub ──────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h2 className="text-white font-semibold text-lg">{t("kyc.title")}</h2>
                <p className="text-neutral-400 text-sm mt-1">{t("kyc.complete")}</p>
              </div>

              {sumsubToken ? (
                <SumsubWebSdk
                  accessToken={sumsubToken}
                  expirationHandler={handleRefreshKycToken}
                  config={{ lang: i18n.language || "en" }}
                  onMessage={handleKycMessage}
                  onError={(err) => {
                    console.error("Sumsub error:", err);
                    setError("Verification error. Please try again.");
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-500 text-sm">Loading verification...</p>
                </div>
              )}

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button onClick={handleSkipKyc} className="text-xs text-neutral-600 hover:text-neutral-400 w-full text-center pt-2">
                {t("kyc.signout")}
              </button>
            </div>
          )}

        </div>

        <p className="text-neutral-700 text-xs text-center mt-6">{t("onboarding.encrypted")}</p>
      </div>
    </div>
  );
};

export default Onboarding;

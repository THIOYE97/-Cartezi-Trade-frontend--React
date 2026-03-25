import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/Api/api";
import { getUser } from "@/Redux/Auth/AuthSlice";

const PhoneVerificationForm = () => {
  const dispatch = useDispatch();
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [session, setSession] = useState("");
  const [step, setStep]       = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSend = async () => {
    setError("");
    if (!phone || !/^\+[1-9]\d{7,14}$/.test(phone)) {
      return setError("Enter a valid phone number (e.g. +221771234567)");
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/users/phone/send-otp", { phone });
      setSession(data.session);
      setStep("otp");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) return setError("Enter the 6-digit code");
    setLoading(true);
    try {
      await api.patch("/api/users/phone/verify-otp", { sessionId: session, otp });
      await dispatch(getUser(localStorage.getItem("jwt")));
      setStep("done");
    } catch (e) {
      setError(e.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="py-8 text-center space-y-3">
        <p className="text-4xl">✅</p>
        <p className="text-white font-medium">Phone verified!</p>
        <p className="text-neutral-500 text-sm">{phone}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      {step === "phone" ? (
        <>
          <div>
            <label className="text-xs text-neutral-400 mb-1.5 block">
              WhatsApp number (with country code)
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-neutral-800 border-neutral-700"
              placeholder="+221771234567"
            />
            <p className="text-xs text-neutral-600 mt-1.5">
              You will receive a WhatsApp message with a 6-digit code
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={handleSend}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-neutral-200"
          >
            {loading ? "Sending..." : "Send WhatsApp code"}
          </Button>
        </>
      ) : (
        <>
          <div>
            <p className="text-neutral-400 text-sm mb-4 text-center">
              Code sent to <strong className="text-white">{phone}</strong> via WhatsApp
            </p>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="bg-neutral-800 border-neutral-700 text-center text-xl tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full bg-white text-black hover:bg-neutral-200"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <button
            onClick={() => setStep("phone")}
            className="text-xs text-neutral-600 hover:text-white w-full text-center"
          >
            ← Change number
          </button>
        </>
      )}
    </div>
  );
};

export default PhoneVerificationForm;
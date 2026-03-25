import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import PhoneVerificationForm from "@/components/profile/PhoneVerificationForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import AccountVarificationForm from "./AccountVarificationForm";
import { enableTwoStepAuthentication, verifyOtp, logout } from "@/Redux/Auth/AuthSlice";
import { ExitIcon, PersonIcon, LockClosedIcon, CheckCircledIcon, EnvelopeClosedIcon, MobileIcon, GlobeIcon, HomeIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Shield, MapPin, Calendar, Flag, ShieldCheck, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import api from "@/Api/api";

const KycStatusBadge = ({ status }) => {
  const map = {
    GREEN:       { label: "KYC Verified",   cls: "bg-green-500/10 text-green-500 border-green-500/20" },
    RED:         { label: "KYC Rejected",   cls: "bg-red-500/10 text-red-500 border-red-500/20" },
    PENDING:     { label: "KYC Pending",    cls: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
    NOT_STARTED: { label: "KYC Not started",cls: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20" },
  };
  const info = map[status] || map.NOT_STARTED;
  return <Badge className={`px-3 py-1 ${info.cls}`}>{info.label}</Badge>;
};

const Profile = () => {
  const { t } = useTranslation();
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [kycData, setKycData] = useState(null);
  const [kycLoading, setKycLoading] = useState(false);

  useEffect(() => {
    setKycLoading(true);
    api.get("/api/users/kyc/status")
      .then((r) => setKycData(r.data))
      .catch(() => {})
      .finally(() => setKycLoading(false));
  }, []);

  const handleEnableTwoStepVerification = (otp) => dispatch(enableTwoStepAuthentication({ jwt: localStorage.getItem("jwt"), otp }));
  const handleVerifyOtp = (otp) => dispatch(verifyOtp({ jwt: localStorage.getItem("jwt"), otp }));
  const handleLogout = () => { dispatch(logout()); navigate("/"); };

  const user = auth.user;

  const personalInfo = [
    { icon: EnvelopeClosedIcon, label: t("profile.email"),       value: user?.email },
    { icon: PersonIcon,         label: t("profile.fullName"),    value: user?.fullName },
    { icon: Calendar,           label: t("profile.dateOfBirth"), value: user?.dateOfBirth || kycData?.fixedInfo?.dob || "—" },
    { icon: Flag,               label: t("profile.nationality"), value: user?.nationality || kycData?.fixedInfo?.nationality || "—" },
    {
      icon: MobileIcon,
      label: t("profile.phone"),
      value: user?.phone
        ? `${user.phone} ${user.phoneVerified ? "✓" : "(unverified)"}`
        : t("profile.noPhone"),
    },
  ];

  const addressInfo = [
    { icon: HomeIcon,  label: t("profile.addressLine"), value: user?.addressLine || kycData?.fixedInfo?.addresses?.[0]?.street || "—" },
    { icon: MapPin,    label: t("profile.city"),        value: user?.city || kycData?.fixedInfo?.addresses?.[0]?.town || "—" },
    { icon: GlobeIcon, label: t("profile.country"),     value: user?.country || kycData?.fixedInfo?.country || "—" },
    { icon: null,      label: t("profile.postcode"),    value: user?.postcode || kycData?.fixedInfo?.addresses?.[0]?.postCode || "—" },
  ];

  // Données KYC Sumsub enrichies
  const kycInfo = kycData ? [
    { label: "KYC Status",      value: kycData.kycStatus || "—" },
    { label: "Review Status",   value: kycData.reviewStatus || "—" },
    { label: "Applicant ID",    value: kycData.applicantId ? `...${kycData.applicantId.slice(-8)}` : "—" },
    { label: "First Name",      value: kycData.fixedInfo?.firstName || kycData.info?.firstNameEn || "—" },
    { label: "Last Name",       value: kycData.fixedInfo?.lastName  || kycData.info?.lastNameEn  || "—" },
    { label: "Date of Birth",   value: kycData.fixedInfo?.dob       || "—" },
    { label: "Country",         value: kycData.fixedInfo?.country   || "—" },
  ] : [];

  if (!user && !auth.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className={isLight ? "text-gray-500" : "text-neutral-500"}>{t("profile.notLoggedIn")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fadeIn">
      {auth.loading && <SpinnerBackdrop />}

      {user && (
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* ── Header ── */}
          <div className={`relative rounded-2xl p-8 mb-8 overflow-hidden ${
            isLight ? "bg-gradient-to-br from-gray-100 to-gray-50" : "bg-gradient-to-br from-neutral-900 to-neutral-800"
          }`}>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? "#000" : "#fff"} 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }} />
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <Avatar className={`h-24 w-24 ring-4 ${isLight ? "ring-white shadow-lg" : "ring-neutral-700"}`}>
                  <AvatarFallback className={`text-3xl font-bold ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                    {user?.fullName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user?.verified && (
                  <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-4 ring-white">
                    <CheckCircledIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className={`text-3xl font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                  {user?.fullName}
                </h1>
                <p className={`text-base mb-4 ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                  {user?.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {/* Email verification */}
                  <Badge className={`px-3 py-1 ${user?.emailVerified
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"}`}>
                    {user?.emailVerified ? "✉️ Email Verified" : "✉️ Email Unverified"}
                  </Badge>
                  {/* KYC */}
                  <KycStatusBadge status={user?.kycStatus || kycData?.kycStatus} />
                  {/* 2FA */}
                  <Badge className={`px-3 py-1 ${user?.twoFactorAuth?.enabled
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"}`}>
                    {user?.twoFactorAuth?.enabled ? "🔒 2FA On" : "2FA Off"}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className={`rounded-xl ${isLight ? "border-red-200 text-red-600 hover:bg-red-50" : "border-red-500/30 text-red-500 hover:bg-red-500/10"}`}
              >
                <ExitIcon className="mr-2 h-4 w-4" />
                {t("profile.logout")}
              </Button>
            </div>
          </div>

          {/* ── Info Grid ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <PersonIcon className="h-5 w-5" />
                  {t("profile.personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {personalInfo.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? "border-gray-100" : "border-neutral-800"}`}>
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-neutral-500"}`} />}
                      <span className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-400"}`}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <MapPin className="h-5 w-5" />
                  {t("profile.address")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {addressInfo.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between py-3 border-b last:border-0 ${isLight ? "border-gray-100" : "border-neutral-800"}`}>
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-neutral-500"}`} />}
                      <span className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-400"}`}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ── KYC Sumsub Card ── */}
          <Card className={`rounded-2xl border mb-6 ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                {user?.kycStatus === "GREEN"
                  ? <ShieldCheck className="h-5 w-5 text-green-500" />
                  : <ShieldAlert className="h-5 w-5 text-orange-400" />
                }
                Identity Verification (KYC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {kycLoading ? (
                <p className="text-neutral-500 text-sm">Loading KYC data...</p>
              ) : kycData?.kycStatus === "NOT_STARTED" ? (
                <div className="flex items-center justify-between">
                  <p className="text-neutral-400 text-sm">Identity not verified yet</p>
                  <Button
                    size="sm"
                    onClick={() => navigate("/kyc")}
                    className={`rounded-lg ${isLight ? "bg-black text-white" : "bg-white text-black"}`}
                  >
                    Start Verification
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {kycInfo.filter(i => i.value !== "—").map((item) => (
                    <div key={item.label} className={`flex flex-col p-3 rounded-lg ${isLight ? "bg-gray-50" : "bg-neutral-800/50"}`}>
                      <span className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>{item.label}</span>
                      <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Security ── */}
          <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            <Shield className="h-5 w-5" />
            {t("profile.security")}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 2FA */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${user?.twoFactorAuth?.enabled ? "bg-green-500/10" : isLight ? "bg-gray-100" : "bg-neutral-800"}`}>
                    <LockClosedIcon className={`h-6 w-6 ${user?.twoFactorAuth?.enabled ? "text-green-500" : isLight ? "text-gray-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{t("profile.twoFactor")}</h3>
                      <Badge className={`text-xs border-0 ${user?.twoFactorAuth?.enabled ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                        {user?.twoFactorAuth?.enabled ? t("profile.active") : t("profile.inactive")}
                      </Badge>
                    </div>
                    <p className={`text-xs mb-3 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
                      {user?.twoFactorAuth?.enabled ? t("profile.protected2fa") : t("profile.add2fa")}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className={`rounded-lg text-xs ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                          {user?.twoFactorAuth?.enabled ? t("profile.manage2fa") : t("profile.enable2fa")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`rounded-2xl ${isLight ? "bg-white" : "bg-neutral-900 border-neutral-800"}`}>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            {user?.twoFactorAuth?.enabled ? "Manage 2FA" : "Enable 2FA"}
                          </DialogTitle>
                        </DialogHeader>
                        <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${user?.phoneVerified ? "bg-green-500/10" : isLight ? "bg-gray-100" : "bg-neutral-800"}`}>
                    <MobileIcon className={`h-6 w-6 ${user?.phoneVerified ? "text-green-500" : isLight ? "text-gray-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{t("profile.phoneVerification")}</h3>
                      <Badge className={`text-xs border-0 ${user?.phoneVerified ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                        {user?.phoneVerified ? t("profile.verified") : t("profile.pending")}
                      </Badge>
                    </div>
                    <p className={`text-xs mb-3 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
                      {user?.phone || t("profile.noPhone")}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className={`rounded-lg text-xs ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                          {user?.phoneVerified ? t("profile.changeNumber") : t("profile.verifyPhone")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`rounded-2xl ${isLight ? "bg-white" : "bg-neutral-900 border-neutral-800"}`}>
                        <DialogHeader>
                          <DialogTitle className="text-center">{t("profile.phoneVerification")}</DialogTitle>
                        </DialogHeader>
                        <PhoneVerificationForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Verification */}
            <Card className={`rounded-2xl border ${isLight ? "bg-white border-gray-200" : "bg-neutral-900 border-neutral-800"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${user?.verified ? "bg-green-500/10" : isLight ? "bg-gray-100" : "bg-neutral-800"}`}>
                    <CheckCircledIcon className={`h-6 w-6 ${user?.verified ? "text-green-500" : isLight ? "text-gray-500" : "text-neutral-400"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{t("profile.accountVerification")}</h3>
                      <Badge className={`text-xs border-0 ${user?.verified ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                        {user?.verified ? t("profile.verified") : t("profile.pending")}
                      </Badge>
                    </div>
                    <p className={`text-xs mb-3 ${isLight ? "text-gray-500" : "text-neutral-500"}`}>
                      {user?.verified ? t("profile.identityVerified") : t("profile.verifyIdentity")}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className={`rounded-lg text-xs ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                          {user?.verified ? t("profile.viewStatus") : t("profile.verifyNow")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={`rounded-2xl ${isLight ? "bg-white" : "bg-neutral-900 border-neutral-800"}`}>
                        <DialogHeader>
                          <DialogTitle className="text-center">
                            {user?.verified ? "Verification Status" : "Account Verification"}
                          </DialogTitle>
                        </DialogHeader>
                        <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

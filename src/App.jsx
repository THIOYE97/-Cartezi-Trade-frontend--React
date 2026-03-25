import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, Suspense, lazy } from "react";
import { initializeAuth } from "./Redux/Auth/AuthSlice";
import { shouldShowNavbar } from "./Util/shouldShowNavbar";
import { Toaster } from "@/components/ui/toaster";

const Navbar = lazy(() => import("./pages/Navbar/Navbar"));
const Home = lazy(() => import("./pages/Home/Home"));
const Portfolio = lazy(() => import("./pages/Portfilio/Portfolio"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const StockDetails = lazy(() => import("./pages/StockDetails/StockDetails"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Notfound = lazy(() => import("./pages/Notfound/Notfound"));
const Wallet = lazy(() => import("./pages/Wallet/Wallet"));
const Watchlist = lazy(() => import("./pages/Watchlist/Watchlist"));
const TwoFactorAuth = lazy(() => import("./pages/Auth/TwoFactorAuth"));
const ResetPasswordForm = lazy(() => import("./pages/Auth/ResetPassword"));
const PasswordUpdateSuccess = lazy(() => import("./pages/Auth/PasswordUpdateSuccess"));
const LoginWithGoogle = lazy(() => import("./pages/Auth/LoginWithGoogle"));
const AuthCallback = lazy(() => import("./pages/Auth/AuthCallback"));
const Withdrawal = lazy(() => import("./pages/Wallet/Withdrawal"));
const PaymentDetails = lazy(() => import("./pages/Wallet/PaymentDetails"));
const WithdrawalAdmin = lazy(() => import("./Admin/Withdrawal/WithdrawalAdmin"));
const Activity = lazy(() => import("./pages/Activity/Activity"));
const SearchCoin = lazy(() => import("./pages/Search/Search"));
const Footer = lazy(() => import("./pages/Footer/Footer"));
const P2PMarket  = lazy(() => import("./pages/P2P/P2PMarket"));
const P2POffer   = lazy(() => import("./pages/P2P/P2POffer"));
const P2PTrade   = lazy(() => import("./pages/P2P/P2PTrade"));
const MyTrades   = lazy(() => import("./pages/P2P/MyTrades"));
const Onboarding = lazy(() => import("./pages/Onboarding/Onboarding"));
const KycGate = lazy(() => import("./pages/Onboarding/KycGate"));

const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/p2p", role: "ROLE_USER" },           // ← ajouter
  { path: "/p2p/offers/:id", role: "ROLE_USER" }, // ← ajouter
  { path: "/p2p/trades", role: "ROLE_USER" },     // ← ajouter
  { path: "/p2p/trades/:id", role: "ROLE_USER" }, // ← ajouter
  { path: "/admin/withdrawal", role: "ROLE_ADMIN" },
];

function App() {

  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (auth.loading) {
    return <div>Loading user...</div>;
  }

  const showNavbar = auth.user
    ? shouldShowNavbar(location.pathname, routes, auth.user?.role)
    : false;

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>

     
{auth.user && !auth.user.onboardingDone ? (
  <Routes><Route path="*" element={<Onboarding />} /></Routes>

) : auth.user && !auth.user.verified && auth.user.kycStatus !== "GREEN" ? (
  <Routes>
    <Route path="*" element={<KycGate />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>

) : auth.user ? (
          <>
            {showNavbar && <Navbar />}

            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Portfolio />} path="/portfolio" />
              <Route element={<Activity />} path="/activity" />
              <Route element={<Wallet />} path="/wallet" />
              <Route element={<Withdrawal />} path="/withdrawal" />
              <Route element={<PaymentDetails />} path="/payment-details" />
              <Route element={<Wallet />} path="/wallet/:order_id" />
              <Route element={<StockDetails />} path="/market/:id" />
              <Route element={<Watchlist />} path="/watchlist" />
              <Route element={<Profile />} path="/profile" />
              <Route element={<SearchCoin />} path="/search" />
              <Route element={<P2PMarket />}  path="/p2p" />
              <Route element={<P2POffer />}   path="/p2p/offers/:id" />
              <Route element={<P2PTrade />}   path="/p2p/trades/:id" />
              <Route element={<MyTrades />}   path="/p2p/trades" />
              <Route element={<Onboarding />} path="/onboarding" />

              {auth.user.role === "ROLE_ADMIN" && (
                <Route element={<WithdrawalAdmin />} path="/admin/withdrawal" />
              )}

              <Route element={<Notfound />} path="*" />
            </Routes>
            

            <Footer />
          </>
        ) : (
          <Routes>
            <Route element={<Auth />} path="/" />
            <Route element={<Auth />} path="/signup" />
            <Route element={<Auth />} path="/signin" />
            <Route element={<Auth />} path="/forgot-password" />
            <Route element={<LoginWithGoogle />} path="/login-with-google" />
            <Route element={<AuthCallback />} path="/auth/google/success" />
            <Route element={<ResetPasswordForm />} path="/reset-password/:session" />
            <Route element={<PasswordUpdateSuccess />} path="/password-update-successfully" />
            <Route element={<TwoFactorAuth />} path="/two-factor-auth/:session" />
            <Route element={<Notfound />} path="*" />
          </Routes>
        )}
  
      </Suspense>

      <Toaster />
    </>
    
  );
}

export default App;

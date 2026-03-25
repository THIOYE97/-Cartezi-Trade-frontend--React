import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  AvatarIcon, DragHandleHorizontalIcon, MagnifyingGlassIcon,
  SunIcon, MoonIcon, ExitIcon, PersonIcon,
} from "@radix-ui/react-icons";
import { Home, PieChart, Bookmark, Activity, Wallet, ArrowLeftRight } from "lucide-react";
import SideBar from "../SideBar/SideBar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/context/ThemeContext";
import { logout } from "@/Redux/Auth/AuthSlice";
import MetaMaskButton from "@/components/wallet/MetaMaskButton";

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language?.startsWith("en");
  return (
    <button
      onClick={() => i18n.changeLanguage(isEn ? "fr" : "en")}
      className="h-9 px-2.5 rounded-lg text-xs font-medium border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
    >
      {isEn ? "🇫🇷" : "🇬🇧"}
    </button>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navLinks = [
    { name: t("nav.home"),      path: "/",          icon: <Home className="h-4 w-4" /> },
    { name: t("nav.p2p"),       path: "/p2p",       icon: <ArrowLeftRight className="h-4 w-4" /> },
    { name: t("nav.portfolio"), path: "/portfolio", icon: <PieChart className="h-4 w-4" /> },
    { name: t("nav.watchlist"), path: "/watchlist", icon: <Bookmark className="h-4 w-4" /> },
    { name: t("nav.activity"),  path: "/activity",  icon: <Activity className="h-4 w-4" /> },
    { name: t("nav.wallet"),    path: "/wallet",    icon: <Wallet className="h-4 w-4" /> },
  ];

  return (
    <div className={`sticky top-0 left-0 right-0 z-50 backdrop-blur-xl ${
      isLight ? "bg-white/80 border-b border-neutral-200" : "bg-black/80 border-b border-neutral-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <DragHandleHorizontalIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className={`w-72 border-r ${isLight ? "bg-white border-neutral-200" : "bg-black border-neutral-800"}`}
                side="left"
              >
                <SheetHeader>
                  <SheetTitle>
                    <span className={`text-xl font-semibold ${isLight ? "text-black" : "text-white"}`}>
                      Cartezi Trade
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <SideBar />
              </SheetContent>
            </Sheet>

            <div onClick={() => navigate("/")} className="cursor-pointer">
              <span className={`text-xl font-semibold ${isLight ? "text-black" : "text-white"}`}>
                Cartezi Trade
              </span>
            </div>
          </div>

          {/* Center — nav links desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                onClick={() => navigate(link.path)}
                variant="ghost"
                className={`h-9 px-3 rounded-lg text-sm font-medium gap-2 ${
                  isLight
                    ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
              >
                {link.icon}
                {link.name}
              </Button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5">

            {/* MetaMask */}
            <div className="hidden md:block">
              <MetaMaskButton compact />
            </div>

            {/* Language */}
            <LanguageToggle />

            {/* Theme */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-lg ${
                isLight
                  ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              {isLight ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </Button>

            {/* Search */}
            <Button
              onClick={() => navigate("/search")}
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-lg ${
                isLight
                  ? "text-neutral-600 hover:text-black hover:bg-neutral-100"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className={`h-9 w-9 cursor-pointer ring-2 ring-offset-2 transition-all hover:ring-violet-500 ${
                  isLight
                    ? "ring-neutral-300 ring-offset-white"
                    : "ring-neutral-700 ring-offset-black"
                }`}>
                  {!auth.user ? (
                    <AvatarIcon className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <AvatarFallback className={`text-sm font-semibold ${isLight ? "bg-black text-white" : "bg-white text-black"}`}>
                      {auth.user?.fullName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className={`w-56 p-2 rounded-xl shadow-xl ${
                  isLight ? "bg-white border-neutral-200" : "bg-neutral-900 border-neutral-800"
                }`}
              >
                <div className={`px-3 py-3 mb-2 rounded-lg ${isLight ? "bg-neutral-50" : "bg-neutral-800/50"}`}>
                  <p className={`text-sm font-semibold truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                    {auth.user?.fullName}
                  </p>
                  <p className={`text-xs truncate ${isLight ? "text-gray-500" : "text-neutral-400"}`}>
                    {auth.user?.email}
                  </p>
                </div>

                <DropdownMenuItem
                  onClick={() => navigate(auth.user?.role === "ROLE_ADMIN" ? "/admin/withdrawal" : "/profile")}
                  className={`cursor-pointer rounded-lg px-3 py-2.5 ${
                    isLight ? "text-gray-700 hover:bg-gray-100" : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  <PersonIcon className="mr-3 h-4 w-4" />
                  {auth.user?.role === "ROLE_ADMIN" ? "Admin Panel" : t("profile.title")}
                </DropdownMenuItem>

                <DropdownMenuSeparator className={`my-2 ${isLight ? "bg-neutral-200" : "bg-neutral-800"}`} />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer rounded-lg px-3 py-2.5 text-red-500 hover:text-white hover:bg-red-500 transition-colors"
                >
                  <ExitIcon className="mr-3 h-4 w-4" />
                  <span className="font-medium">{t("profile.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

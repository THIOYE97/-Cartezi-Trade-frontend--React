import { logout } from "@/Redux/Auth/AuthSlice";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ExitIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  ActivityLogIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-4 w-4" /> },
  { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-4 w-4" /> },
  { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-4 w-4" /> },
  { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-4 w-4" /> },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-4 w-4" /> },
  { name: "Payment Details", path: "/payment-details", icon: <LandmarkIcon className="h-4 w-4" /> },
  { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-4 w-4" /> },
  { name: "Profile", path: "/profile", icon: <PersonIcon className="h-4 w-4" /> },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-4 w-4" /> },
];

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name == "Logout") {
      handleLogout();
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="mt-8 space-y-1">
      {menu.map((item) => (
        <div key={item.name}>
          <SheetClose className="w-full">
            <Button
              onClick={() => handleMenuClick(item)}
              variant="ghost"
              className={`flex items-center gap-3 py-3 w-full justify-start rounded-lg ${item.name === "Logout"
                ? "text-red-500 hover:text-red-500 hover:bg-red-500/10"
                : isLight
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                }`}
            >
              <span className="w-5">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Button>
          </SheetClose>
        </div>
      ))}
    </div>
  );
};

export default SideBar;

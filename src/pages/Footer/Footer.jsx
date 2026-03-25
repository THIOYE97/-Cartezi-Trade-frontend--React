import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const links = [
    { name: "Markets", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Watchlist", path: "/watchlist" },
    { name: "Activity", path: "/activity" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Github, href: "https://github.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
  ];

  return (
    <footer className={`border-t ${isLight ? "border-gray-200" : "border-neutral-800"}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
            Cartezi Trade
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm transition-colors ${
                  isLight
                    ? "text-gray-500 hover:text-gray-900"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social, index) => (
              
                <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                  isLight
                    ? "bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200"
                    : "bg-neutral-800/50 text-neutral-500 hover:text-white hover:bg-neutral-800"
                }`}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* CoinGecko Attribution */}
        <div
          className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isLight ? "border-gray-200" : "border-neutral-800/50"
          }`}
        >
          {/* Attribution CoinGecko */}
          
            <a
            href="https://www.coingecko.com?utm_source=cartezi_trade&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <span
              className={`text-xs ${
                isLight ? "text-gray-400" : "text-neutral-600"
              }`}
            >
              Price data provided by
            </span>
            
<img
  src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d2fad96cb1b2efb0dbe4dc2e4933.png"
  alt="CoinGecko"
  className="h-4 opacity-60"
  referrerPolicy="no-referrer"
  onError={(e) => {
    e.target.onerror = null;
    e.target.replaceWith(Object.assign(document.createElement("span"), {
      textContent: "CoinGecko",
      className: "text-xs text-neutral-500",
    }));
  }}    
/>
          </a>

          <p className={`text-sm ${isLight ? "text-gray-500" : "text-neutral-600"}`}>
            © {currentYear} Cartezi Trade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
const CoinGeckoAttribution = ({ align = "center", className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${
      align === "right" ? "justify-end" :
      align === "left"  ? "justify-start" :
      "justify-center"
    } ${className}`}>
      <a
        href="https://www.coingecko.com?utm_source=cartezi_trade&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 group"
      >
        <span className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
          Data powered by
        </span>
        <img
          src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d2fad96cb1b2efb0dbe4dc2e4933.png"
          alt="CoinGecko"
          className="h-3.5 opacity-40 group-hover:opacity-80 transition-opacity"
        />
      </a>
    </div>
  );
};

export default CoinGeckoAttribution;
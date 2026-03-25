const METHODS = {
  WAVE:         { label: "Wave",         color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  ORANGE_MONEY: { label: "Orange Money", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  MTN:          { label: "MTN MoMo",     color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  BANK:         { label: "Bank",         color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  CRYPTO:       { label: "Crypto",       color: "bg-green-500/10 text-green-400 border-green-500/20" },
};

const PaymentBadge = ({ method, size = "sm" }) => {
  const info = METHODS[method] || { label: method, color: "bg-neutral-500/10 text-neutral-400" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${info.color} ${size === "lg" ? "px-3 py-1 text-sm" : ""}`}>
      {info.label}
    </span>
  );
};

export default PaymentBadge;
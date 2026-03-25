const CoinImage = ({ src, alt, className = "h-8 w-8 rounded-full" }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    // Fallback : initiale du nom
    e.target.style.display = "none";
    e.target.nextSibling?.style.removeProperty("display");
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
      />
      <div
        className={`${className} bg-neutral-800 flex items-center justify-center text-white text-xs font-bold`}
        style={{ display: "none" }}
      >
        {alt?.[0]?.toUpperCase()}
      </div>
    </div>
  );
};

export default CoinImage;
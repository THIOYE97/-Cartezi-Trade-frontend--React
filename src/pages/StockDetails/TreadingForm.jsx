import { getAssetDetails } from "@/Redux/Assets/AssetSlice";
import { payOrder } from "@/Redux/Order/OrderSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const TreadingForm = () => {
  const { coin, asset, wallet } = useSelector((store) => store);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("BUY");

  const handleOnChange = (e) => {
    const amount = e.target.value;
    setAmount(amount);
    const volume = calculateBuyCost(amount, coin.coinDetails.market_data.current_price.usd);
    setQuantity(volume);
  };

  function calculateBuyCost(amountUSD, cryptoPrice) {
    let volume = amountUSD / cryptoPrice;
    let decimalPlaces = Math.max(2, cryptoPrice.toString().split(".")[0].length);
    return volume.toFixed(decimalPlaces);
  }

  const handleBuyCrypto = () => {
    dispatch(
      payOrder({
        jwt: localStorage.getItem("jwt"),
        amount,
        orderData: {
          coinId: coin.coinDetails?.id,
          quantity,
          orderType,
        },
      })
    );
  };

  useEffect(() => {
    dispatch(getAssetDetails({ coinId: coin.coinDetails.id, jwt: localStorage.getItem("jwt") }));
  }, []);

  const isInsufficientFunds = orderType === "BUY"
    ? quantity * coin.coinDetails?.market_data.current_price.usd > wallet.userWallet?.balance
    : asset.assetDetails?.quantity * coin.coinDetails?.current_price < amount;

  return (
    <div className="space-y-6 p-4">
      {/* Amount Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-neutral-500 mb-1 block">Amount (USD)</label>
          <Input
            className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500"
            placeholder="0.00"
            onChange={handleOnChange}
            type="number"
          />
        </div>
        <div>
          <label className="text-xs text-neutral-500 mb-1 block">Quantity</label>
          <div className="h-12 px-4 bg-neutral-800 border border-neutral-700 rounded-lg flex items-center justify-center min-w-[100px]">
            <span className="text-white font-medium">{quantity}</span>
          </div>
        </div>
      </div>

      {isInsufficientFunds && amount > 0 && (
        <p className="text-red-500 text-sm text-center">
          Insufficient {orderType === "BUY" ? "balance" : "quantity"}
        </p>
      )}

      {/* Coin Info */}
      <div className="flex items-center gap-3 p-4 bg-neutral-800/50 rounded-lg">
        <Avatar className="h-10 w-10">
          <AvatarImage src={coin.coinDetails?.image.large} />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{coin.coinDetails?.symbol?.toUpperCase()}</span>
            <span className="text-neutral-500">{coin.coinDetails?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">
              ${coin.coinDetails?.market_data.current_price.usd?.toLocaleString()}
            </span>
            <span className={coin.coinDetails?.market_data.market_cap_change_24h < 0 ? "text-red-500 text-sm" : "text-green-500 text-sm"}>
              {coin.coinDetails?.market_data.market_cap_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Order Type</span>
          <span className="text-white">Market Order</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">
            {orderType === "BUY" ? "Available Balance" : "Available Quantity"}
          </span>
          <span className="text-white font-medium">
            {orderType === "BUY"
              ? `$${wallet.userWallet?.balance?.toLocaleString() || 0}`
              : asset.assetDetails?.quantity || 0
            }
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        <DialogClose className="w-full">
          <Button
            onClick={handleBuyCrypto}
            className={`w-full h-12 font-medium rounded-lg ${orderType === "SELL"
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white text-black hover:bg-neutral-200"
              }`}
            disabled={
              quantity === 0 ||
              (orderType === "SELL" && !asset.assetDetails?.quantity) ||
              isInsufficientFunds
            }
          >
            {orderType === "BUY" ? "Buy" : "Sell"} {coin.coinDetails?.symbol?.toUpperCase()}
          </Button>
        </DialogClose>

        <Button
          onClick={() => setOrderType(orderType === "BUY" ? "SELL" : "BUY")}
          variant="ghost"
          className="w-full mt-2 text-neutral-400 hover:text-white"
        >
          {orderType === "BUY" ? "Switch to Sell" : "Switch to Buy"}
        </Button>
      </div>
    </div>
  );
};

export default TreadingForm;

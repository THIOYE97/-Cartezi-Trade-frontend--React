import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalRequest } from "@/Redux/Withdrawal/WithdrawalSlice";
import { DialogClose } from "@/components/ui/dialog";
import { maskAccountNumber } from "@/Util/maskAccountNumber";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";

const WithdrawForm = () => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const { wallet, withdrawal } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.toString().length < 6) {
      setAmount(value);
    }
  };

  const handleSubmit = () => {
    dispatch(withdrawalRequest({ jwt: localStorage.getItem("jwt"), amount }));
  };

  if (!withdrawal.paymentDetails) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-400">No payment method added</p>
        <Button
          onClick={() => navigate("/payment-details")}
          className="bg-white text-black hover:bg-neutral-200"
        >
          Add Payment Details
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-6">
      {/* Balance */}
      <div className="flex justify-between items-center p-4 bg-neutral-800 rounded-lg">
        <span className="text-neutral-400">Available Balance</span>
        <span className="text-white font-semibold">${wallet.userWallet?.balance?.toLocaleString()}</span>
      </div>

      {/* Amount Input */}
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Amount</label>
        <Input
          onChange={handleChange}
          value={amount}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500 text-center text-xl"
          placeholder="0.00"
          type="number"
        />
      </div>

      {/* Bank Info */}
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Transfer to</label>
        <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg">
          <div className="h-10 w-10 rounded-lg bg-neutral-700 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">{withdrawal.paymentDetails?.bankName}</p>
            <p className="text-neutral-500 text-sm">{maskAccountNumber(withdrawal.paymentDetails?.accountNumber)}</p>
          </div>
        </div>
      </div>

      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          disabled={!amount || amount <= 0}
          className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg disabled:opacity-50"
        >
          Withdraw {amount && `$${amount}`}
        </Button>
      </DialogClose>
    </div>
  );
};

export default WithdrawForm;

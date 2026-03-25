import { transferMoney } from "@/Redux/Wallet/WalletSlice";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useDispatch } from "react-redux";

const TransferForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    amount: "",
    walletId: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(
      transferMoney({
        jwt: localStorage.getItem("jwt"),
        walletId: formData.walletId,
        reqData: {
          amount: formData.amount,
          purpose: formData.purpose,
        },
      })
    );
  };

  return (
    <div className="pt-6 space-y-4">
      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Amount</label>
        <Input
          name="amount"
          onChange={handleChange}
          value={formData.amount}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500"
          placeholder="Enter amount"
          type="number"
        />
      </div>

      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Wallet ID</label>
        <Input
          name="walletId"
          onChange={handleChange}
          value={formData.walletId}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500"
          placeholder="Enter recipient wallet ID"
        />
      </div>

      <div>
        <label className="text-sm text-neutral-400 mb-2 block">Purpose</label>
        <Input
          name="purpose"
          onChange={handleChange}
          value={formData.purpose}
          className="h-12 bg-neutral-800 border-neutral-700 focus:border-neutral-600 rounded-lg placeholder:text-neutral-500"
          placeholder="Optional note"
        />
      </div>

      <DialogClose className="w-full">
        <Button
          onClick={handleSubmit}
          disabled={!formData.amount || !formData.walletId}
          className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-medium rounded-lg disabled:opacity-50"
        >
          Send
        </Button>
      </DialogClose>
    </div>
  );
};

export default TransferForm;

import { useDispatch, useSelector } from "react-redux";
import { connectWallet, disconnectWallet } from "@/Redux/Wallet/MetaMaskSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isMetaMaskInstalled } from "@/services/metamaskService";
import { useEffect } from "react";
import { Copy, ExternalLink, RefreshCw } from "lucide-react";
import { refreshMetaMaskBalance } from "@/Redux/Wallet/MetaMaskSlice";

const FOX = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg";

const MetaMaskButton = ({ compact = false }) => {
  const dispatch = useDispatch();
  const { address, balance, loading, error } = useSelector((s) => s.metamask);

  // Écouter changements compte/réseau
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountChange = (accounts) => {
      if (accounts.length === 0) {
        dispatch(disconnectWallet());
      } else {
        dispatch(connectWallet());
      }
    };

    const handleChainChange = () => {
      if (address) dispatch(refreshMetaMaskBalance(address));
    };

    window.ethereum.on("accountsChanged", handleAccountChange);
    window.ethereum.on("chainChanged", handleChainChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
      window.ethereum.removeListener("chainChanged", handleChainChange);
    };
  }, [dispatch, address]);

  const handleCopy = () => {
    if (address) navigator.clipboard.writeText(address);
  };

  const handleOpenEtherscan = () => {
    window.open(`https://etherscan.io/address/${address}`, "_blank");
  };

  // MetaMask non installé
  if (!isMetaMaskInstalled()) {
    return (
      <a

        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-xs font-medium transition-all ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <img src={FOX} className="h-4 w-4" alt="MetaMask" />
        {compact ? "Install" : "Install MetaMask"}
      </a>
    );
  }

  // Connecté — dropdown avec infos
  if (address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-all">
            <img src={FOX} className="h-4 w-4" alt="MetaMask" />
            <span className="text-orange-400 text-xs font-medium">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <span className="text-neutral-500 text-xs hidden sm:inline">
              {Number(balance).toFixed(4)} ETH
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-64 p-2 rounded-xl bg-neutral-900 border-neutral-800"
        >
          {/* Header */}
          <div className="px-3 py-3 mb-1 rounded-lg bg-neutral-800/50">
            <div className="flex items-center gap-2 mb-1">
              <img src={FOX} className="h-5 w-5" alt="MetaMask" />
              <span className="text-white text-sm font-semibold">MetaMask</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                Connected
              </span>
            </div>
            <p className="text-neutral-400 text-xs font-mono break-all">
              {address}
            </p>
            <p className="text-white font-semibold mt-2">
              {Number(balance).toFixed(6)} ETH
            </p>
          </div>

          <DropdownMenuItem
            onClick={handleCopy}
            className="cursor-pointer rounded-lg px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <Copy className="mr-3 h-4 w-4" />
            Copy address
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => dispatch(refreshMetaMaskBalance(address))}
            className="cursor-pointer rounded-lg px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <RefreshCw className="mr-3 h-4 w-4" />
            Refresh balance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleOpenEtherscan}
            className="cursor-pointer rounded-lg px-3 py-2 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            <ExternalLink className="mr-3 h-4 w-4" />
            View on Etherscan
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-neutral-800" />

          <DropdownMenuItem
            onClick={() => dispatch(disconnectWallet())}
            className="cursor-pointer rounded-lg px-3 py-2 text-red-500 hover:bg-red-500/10"
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Non connecté — bouton connect
  return (
    <Button
      onClick={() => dispatch(connectWallet())}
      disabled={loading}
      variant="ghost"
      size={compact ? "sm" : "default"}
      className="flex items-center gap-2 border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 rounded-lg px-3"
    >
      <img src={FOX} className="h-4 w-4" alt="MetaMask" />
      {loading
        ? "Connecting..."
        : compact
        ? "MetaMask"
        : "Connect MetaMask"}
    </Button>
  );
};

export default MetaMaskButton;
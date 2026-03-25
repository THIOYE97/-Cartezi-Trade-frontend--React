const PLATFORM_ESCROW_ADDRESS = import.meta.env.VITE_PLATFORM_WALLET_ADDRESS;
const ETHERSCAN_URL = import.meta.env.VITE_ETHERSCAN_URL || "https://sepolia.etherscan.io";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 en hex

export async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (err) {
    // Réseau pas encore ajouté — l'ajouter
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: SEPOLIA_CHAIN_ID,
          chainName: "Sepolia Testnet",
          nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://sepolia.infura.io/v3/"],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        }],
      });
    } else throw err;
  }
}

export async function getCurrentChainId() {
  return window.ethereum.request({ method: "eth_chainId" });
}

export async function lockEthInEscrow(amountEth) {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  if (!PLATFORM_ESCROW_ADDRESS ||
      !PLATFORM_ESCROW_ADDRESS.startsWith("0x") ||
      PLATFORM_ESCROW_ADDRESS.length !== 42) {
    throw new Error("Platform wallet address not configured");
  }

  // Vérifier et switcher sur Sepolia
  const chainId = await getCurrentChainId();
  if (chainId !== SEPOLIA_CHAIN_ID) {
    await switchToSepolia();
  }

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const from = accounts[0];

  const amountWei = BigInt(Math.round(amountEth * 1e18));
  const amountHex = "0x" + amountWei.toString(16);

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{ from, to: PLATFORM_ESCROW_ADDRESS, value: amountHex, gas: "0x5208" }],
  });

  return { txHash, from, amountEth };
}

export async function waitForConfirmation(txHash, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const receipt = await window.ethereum.request({
      method: "eth_getTransactionReceipt",
      params: [txHash],
    });
    if (receipt?.status === "0x1") return receipt;
    if (receipt?.status === "0x0") throw new Error("Transaction failed on-chain");
  }
  throw new Error("Transaction timeout after 90s");
}

// Prix ETH en USD via CoinGecko
export async function getEthPrice() {
  const r = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const data = await r.json();
  return data.ethereum.usd;
}


export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed. Please install it from metamask.io");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}

export async function getMetaMaskBalance(address) {
  if (!window.ethereum) throw new Error("MetaMask not available");

  const balance = await window.ethereum.request({
    method: "eth_getBalance",
    params: [address, "latest"],
  });

  // Convertir wei → ETH
  return (parseInt(balance, 16) / 1e18).toFixed(6);
}

export function isMetaMaskInstalled() {
  return typeof window !== "undefined" && Boolean(window.ethereum?.isMetaMask);
}

export async function watchAccountChanges(callback) {
  if (!window.ethereum) return;
  window.ethereum.on("accountsChanged", callback);
}

export async function watchNetworkChanges(callback) {
  if (!window.ethereum) return;
  window.ethereum.on("chainChanged", callback);
}
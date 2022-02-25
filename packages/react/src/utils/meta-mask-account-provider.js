import { useState, useEffect, createContext, useContext } from 'react';
import { networks } from './networks';

const MetaMaskAccountContext = createContext();

const targetChainId = '0x89';

export default function MetaMaskAccountProvider({ children }) {
  const [ethereum, setEthereum] = useState(undefined);
  const [network, setNetwork] = useState('');
  const [connectedAccount, setConnectedAccount] = useState(undefined);

  const setEthereumFromWindow = async () => {
    if (window.ethereum) {
      // Reload if chain changes, see <https://docs.metamask.io/guide/ethereum-provider.html#chainchanged>
      window.ethereum.on('chainChanged', handleChainChanged);

      // Reload the page when they change networks
      function handleChainChanged(_chainId) {
        window.location.reload();
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId === targetChainId) {
        setEthereum(window.ethereum);
        setNetwork(chainId);
      } else {
        console.log(`Please use ${networks[targetChainId].name}`);
      }
    }
  };
  useEffect(() => setEthereumFromWindow(), []);

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('We have an authorized account: ', account);
      setConnectedAccount(account);
    } else {
      console.log('No authorized accounts yet');
    }
  };

  const getConnectedAccount = async () => {
    if (ethereum) {
      const accounts = await ethereum.request({
        method: 'eth_accounts',
      });
      handleAccounts(accounts);
    }
  };
  useEffect(() => getConnectedAccount());

  const connectAccount = async () => {
    if (!window.ethereum) {
      console.error('Ethereum object is required to connect an account');
      return;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    handleAccounts(accounts);
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: targetChainId,
                  chainName: networks[targetChainId].name,
                  rpcUrls: [networks[targetChainId].rpcUrl], // Fix for your network
                  nativeCurrency: {
                    name: networks[targetChainId].coin,
                    symbol: networks[targetChainId].coin,
                    decimals: 18,
                  },
                  blockExplorerUrls: [networks[targetChainId].explorer],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert(
        'MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html'
      );
    }
  };

  const value = {
    ethereum,
    connectedAccount,
    connectAccount,
    targetChainId,
    network,
    switchNetwork,
  };

  return (
    <MetaMaskAccountContext.Provider value={value}>
      {children}
    </MetaMaskAccountContext.Provider>
  );
}

export function useMetaMaskAccount() {
  return useContext(MetaMaskAccountContext);
}

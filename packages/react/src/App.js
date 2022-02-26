import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import polygonLogo from './assets/polygonlogo.png';
import ethLogo from './assets/ethlogo.png';

import { networks } from './utils/networks';
import { useMetaMaskAccount } from './utils/meta-mask-account-provider';
import {
  getNftContract,
  openseaLink,
  gatewayLink,
  getJSONfromIPFS,
  getNameAttribute,
} from './utils/nftUtils';

// Constants
// const targetChainId = '0x13881'; // Polygon Mumbai Testnet
const targetChainId = '0x89'; // Polygon Mainnet
const COST = '0';
const TWITTER_HANDLE = 'zh';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { ethereum, network, switchNetwork, connectedAccount, connectAccount } =
    useMetaMaskAccount(targetChainId);
  const nftContract = getNftContract(ethereum);

  const [nfts, setNfts] = useState([]);
  // Create a stateful variable to store the network next to all the others
  const [loading, setLoading] = useState(false);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      if (ethereum && connectedAccount && nftContract) {
        // Get all the domain names from our contract
        const tokenIDs = await nftContract.walletOfOwner(connectedAccount);

        // For each name, get the record and the address
        const nftData = await Promise.all(
          tokenIDs.map(async (id) => {
            const tokenURI = await nftContract.tokenURI(id);
            return await getJSONfromIPFS(tokenURI);
          })
        );

        console.log('NFTS FETCHED ', nftData);
        setNfts(nftData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const setEventHandlers = () => {
    if (!ethereum || !nftContract || !connectedAccount) {
      return;
    }
    console.log('add event contract handlers');
    try {
      nftContract.on('Minted', async () => {
        console.log('event: minted');
        await fetchNFTs();
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (network === targetChainId) {
      fetchNFTs();
      setEventHandlers();
    }
  }, [!!nftContract, connectedAccount, network]);

  const mintNFT = async () => {
    // Don't run if the domain is empty
    if (!ethereum || !nftContract) {
      return;
    }
    console.log('Minting NFT');
    setLoading(true);
    try {
      console.log('Going to pop wallet now to pay gas...');
      const txParams =
        COST === '0'
          ? {}
          : {
              value: ethers.utils.parseEther(COST),
            };
      let tx = await nftContract.mint(1, txParams);
      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Check if the transaction was successfully completed
      if (receipt.status === 1) {
        console.log(
          `NFT minted! ${networks[targetChainId].explorer}tx/` + tx.hash
        );
      } else {
        alert('Transaction failed! Please try again');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <button
        onClick={connectAccount}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  const renderInputForm = () => {
    // If not on Polygon Mumbai Testnet, render the switch button
    if (network !== targetChainId) {
      return (
        <div className="connect-wallet-container">
          <h2>Please switch to {networks[targetChainId].name}</h2>
          {/* This button will call our switch network function */}
          <button className="cta-button mint-button" onClick={switchNetwork}>
            Click here to switch
          </button>
        </div>
      );
    }

    return (
      <div className="form-container">
        {/* If the editing variable is true, return the "Set record" and "Cancel" button */}
        <button
          className="cta-button mint-button"
          disabled={loading}
          onClick={mintNFT}
        >
          Mint
        </button>
      </div>
    );
  };

  const renderNFTs = () => {
    if (connectedAccount && nfts.length > 0) {
      return (
        <div className="mint-container">
          <p className="subtitle"> Recently minted NFTs!</p>
          <div className="mint-list">
            {nfts.map((nft, index) => {
              return (
                <div className="mint-item" key={index}>
                  <div className="mint-row">
                    <a
                      className="link"
                      href={openseaLink(index + 1)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        width="256"
                        height="256"
                        src={gatewayLink(nft.image)}
                        alt={nft.name}
                      />
                      <p className="underlined">
                        {getNameAttribute(nft.attributes)}
                      </p>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">Free NFTs</p>
              <p className="subtitle">Claim your own today.</p>
            </div>
            {/* Display a logo and wallet connection status*/}
            <div className="right">
              <img
                alt="Network logo"
                className="logo"
                src={
                  network && ['0x89', '0x13881'].includes(network)
                    ? polygonLogo
                    : ethLogo
                }
              />
              {connectedAccount ? (
                <p>
                  {' '}
                  Wallet: {connectedAccount.slice(0, 6)}...
                  {connectedAccount.slice(-4)}{' '}
                </p>
              ) : (
                <p> Not connected </p>
              )}
            </div>
          </header>
        </div>

        {!connectedAccount && renderNotConnectedContainer()}
        {connectedAccount && renderInputForm()}
        {nfts && renderNFTs()}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;

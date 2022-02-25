const INFURA_ID = 'FIX THIS';

const networks = {
  '0x1': {
    name: 'Mainnet',
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    explorer: 'https://etherscan.io/',
    coin: 'ETH',
  },
  '0x3': {
    name: 'Ropsten',
    rpcUrl: `https://popsten.infura.io/v3/${INFURA_ID}`,
    explorer: 'https://popsten.etherscan.io/',
    coin: 'ETH',
  },
  '0x2a': {
    name: 'Kovan',
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    explorer: 'https://kovan.etherscan.io/',
    coin: 'ETH',
  },
  '0x4': {
    name: 'Rinkeby',
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    explorer: 'https://rinkeby.etherscan.io/',
    coin: 'ETH',
  },
  '0x5': {
    name: 'Goerli',
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    explorer: 'https://goerli.etherscan.io/',
    coin: 'ETH',
  },
  '0x61': {
    name: 'BSC Testnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorer: 'https://www.bscscan.com/',
    coin: 'BNB',
  },
  '0x38': {
    name: 'BSC Mainnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorer: 'https://testnet.bscscan.com/',
    coin: 'BNB',
  },
  '0x89': {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com/',
    explorer: 'https://polygonscan.com/',
    coin: 'MATIC',
  },
  '0x13881': {
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    explorer: 'https://mumbai.polygonscan.com/',
    coin: 'MATIC',
  },
  '0xa86a': {
    name: 'AVAX Mainnet',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://cchain.explorer.avax.network/',
    coin: 'AVAX',
  },
};

export { networks };

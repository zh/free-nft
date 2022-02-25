import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import MetaMaskAccountProvider from './utils/meta-mask-account-provider';

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskAccountProvider>
      <App />
    </MetaMaskAccountProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

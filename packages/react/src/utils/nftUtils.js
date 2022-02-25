import { ethers } from 'ethers';
import { BufferList } from 'bl';
import abi from './WaifuGen.json';

const contractAddress = '0x5c284C2B3b22b4077A8255B3C134CD4AAD898468';
const contractABI = abi.abi;
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

export function getNftContract(ethereum) {
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}

export function openseaLink(id) {
  return `https://opensea.io/assets/mumbai/${contractAddress}/${id}`;
}

export function gatewayLink(cid) {
  return `https://ipfs.infura.io/ipfs/${cid.replace('ipfs://', '')}`;
}

export function getNameAttribute(attributes) {
  const name = attributes.filter((a) => a.trait_type === 'name');
  return name.length > 0 ? name[0].value : '';
}

export async function getJSONfromIPFS(cid) {
  if (cid === '' || cid === null || cid === undefined) {
    return;
  }
  for await (const file of ipfs.get(cid.replace('ipfs://', ''))) {
    if (file.content) {
      const buff = new BufferList();
      for await (const chunk of file.content) {
        buff.append(chunk);
      }
      return JSON.parse(buff.toString());
    }
  }
}

import React, { useCallback, useEffect, useState } from "react";
import Marketplace from "./abis/Marketplace.json";
import Web3 from 'web3';
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

const loadWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

export const Root = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [marketplace, setMarketplace] = useState<Contract>(null);

  const loadBlockchainData = async () => {
    const { web3 } = window;
    const [account] = await web3.eth.getAccounts();
    setAccount(account);

    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    const networkData = Marketplace.networks[networkId];

    if (networkData) {
      const marketplace = new web3.eth.Contract(Marketplace.abi as AbiItem[], networkData.address)
      setMarketplace(marketplace);
    } else {
      alert('Marketplace contract is not deployed in detected network.')
    }
  }

  const createProduct = async (name, price) => {
    marketplace.methods?.createProduct(name, price).send({ from: account }).on('receipt', () => {
      alert('Product was created')
    });
  }

  const connectWallet = async () => {
    await loadWeb3();
    await loadBlockchainData();
  }

  const isConnected = typeof account === "string";

  return <main style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", alignItems: "center" }}>
    <h1>
      {isConnected ? `Connected as ${account}` : 'Wallet is not connected'}
    </h1>
    {!isConnected && <button onClick={connectWallet}>
      Connect wallet
    </button>}
    <form onSubmit={(event) => {
      event.preventDefault()
      const formData = new FormData(event.target as HTMLFormElement);
      const name = formData.get('name');
      const price = parseInt(formData.get('price') as string, 10);

      createProduct(name, price);
    }}>
      <fieldset>
        <legend>Create product</legend>
        <label htmlFor="name">Product name</label>
        <input name="name" id="name" />
        <label htmlFor="price">Product price</label>
        <input name="price" type="number" id="price" />
      </fieldset>
      <button type="submit">Create product</button>
    </form>
  </main>
}
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Massabots from '../src/artifacts/contracts/Massabots.sol/Massabots.json';
import Head from 'next/head';

const MSBAdress = process.env.NEXT_PUBLIC_MSB_ADRESS;

export default function Home() {
  const [error, setError] = useState('');
  const [data, setData] = useState({});
  const [account, setAccount] = useState([]);

  useEffect(() => {
    fetchData();
    getAccounts();
  }, [])

  const getAccounts = async () => {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts);
      console.log(accounts[0]);
    }
  }

  const fetchData = async () => {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(MSBAdress, Massabots.abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)};
        setData(object);
      } catch(err) {
        setError(err);
      }
    }
  }

  const mint = async () => {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MSBAdress, Massabots.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      } catch(err) {
        setError(err);
      }
    }
  }

  const withdraw = async () => {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MSBAdress, Massabots.abi, signer);
      try {
        const transaction = await contract.withdraw();
        await transaction.wait();
      } catch(err) {
        setError(err);
      }
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Create a stunning web3 app with cats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {error && <p>{error}</p>}
      <h1 className='font-bold text-4xl mb-6'>Mint a Massabot NFT</h1>
      <p><span className='font-bold text-blue-600 text-2xl'>{data.totalSupply}</span> /30</p>
      <p>Each Massabot NFT costs {data.cost / 10**18} eth</p>
      <p className='text-sm text-gray-600 font-light'>(excluding gas fees)</p>
      <button onClick={mint} className="bg-blue-600 px-5 py-3 text-white font-bold rounded-lg mt-6">Buy one Massabot NFT</button>
      {account[0] == process.env.NEXT_PUBLIC_OWNER_ADRESS && 
        <button onClick={withdraw} className="bg-orange-600 px-4 py-2 text-white text-xs font-bold rounded-lg mt-6">Withdraw</button>
      }
      
    </div>
  )
}

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Massabots from '../src/artifacts/contracts/Massabots.sol/Massabots.json';
import Head from 'next/head';
import InfoUser from '../components/InfoUser';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { db } from "../firebase";
import AddToWhitelist from '../components/AddToWhitelist';

const MSBAdress = process.env.NEXT_PUBLIC_MSB_ADRESS;

export default function Home() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState({});
  const [account, setAccount] = useState([]);
  const [balance, setBalance] = useState();
  const [countData, setCountData] = useState(3);

  useEffect(() => {
    fetchData();
    getAccounts();
    getWhitelistCount();
  }, [])

  useEffect(() => {
    window.ethereum.addListener('connect', async (response) => {
      getAccounts();
    })
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    })
  
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    })
  
    window.ethereum.on('disconnect', () => {
      window.location.reload();
    })
  })

  const getWhitelistCount = () => {
    onSnapshot(
      query(collection(db, "whitelist"), orderBy("address", "desc")),
      (snapshot) => {
          setCountData(snapshot.size);
      })
  }

  const getAccounts = async () => {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(accounts[0]);
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    }
  }

  const fetchData = async () => {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(MSBAdress, Massabots.abi, provider);
      console.log(window.ethereum);
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
      {error && <p className="bg-red-200 p-4 text-sm text-red-900">{error}</p>}
      {success && <p className="bg-green-200 p-4 text-sm text-green-900">{success}</p>}
      { account.length > 0 &&
        <InfoUser account={account} balance={balance}/>
      }
      <AddToWhitelist
        countData={countData}
        setCountData={setCountData}
        getCount={getWhitelistCount}
        balance={balance}
        setBalance={setBalance}
        setError={setError}
        setSuccess={setSuccess}
        account={account}
      />
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

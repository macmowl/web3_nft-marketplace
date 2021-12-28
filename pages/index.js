import Head from 'next/head';
import Login from '../components/Login';
import { useMoralis } from 'react-moralis';

export default function Home() {
  const { isAuthenticated, logout, user } = useMoralis();

  if (!isAuthenticated) return <Login />

  return (
    <div className="h-screen flex justify-center items-center">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col items-center space-y-5'>
        <h1>BOOOOOOOOOM connecté</h1>
        <div className='text-center'>
          <p>Bienvenue <span className="text-green-700">{user.get("username")}</span></p>
          <p>Ouais, ton username est naze</p>
        </div>
        
        <button onClick={logout} className='px-5 py-3 bg-red-400 rounded-lg font-bold text-white'>Logout</button>
      </div>
      
    </div>
  )
}

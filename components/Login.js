import { useMoralis } from 'react-moralis';

const Login = () => {
    const { authenticate } = useMoralis();
    return (
        <div className="bg-black relative text-white h-screen">
            <h1>I am the login screen</h1>
            <div className="flex flex-col justify-center items-center h-4/6">
                <button onClick={authenticate} className="bg-yellow-500 p-5 rounded-lg font-bold hover:animate-pulse">Login with Metamask</button>
            </div>
        </div>
    )
}

export default Login

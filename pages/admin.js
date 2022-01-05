import {useEffect, useState} from 'react';
import { getSession, getProviders, useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase";
import { signOut } from "next-auth/react";
import {
    collection,
    deleteDoc,
    setDoc,
    doc,
    orderBy,
    query,
    getDocs,
    serverTimestamp
} from "@firebase/firestore";
import Login from '../components/Login';

export default function admin({ providers }) {
    const { data: session } = useSession();
    const [data, setData] = useState([]);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        try {
            const q = query(collection(db, "whitelist"), orderBy("address", "desc"));
            const querySnapshot = await getDocs(q);
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setData(items);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteAddress = async (e) => {
        await deleteDoc(doc(db, "whitelist", e.target.value));
        getData();
        setMessage('Address successfully deleted');
    }

    const addToWhitelist = async () => {
        let balance = 0;
        let id = uuidv4();
        let obj = {
            address,
            id,
            balance,
            timestamps: serverTimestamp()
        };
        try {
            await setDoc(doc(db, "whitelist", obj.id), obj);
            getData();
            setMessage('New address added');
        } catch (error) {
            console.log(error);
        }
    }

    if (!session) return <Login providers={providers} />;
    
    return (
        <div className="p-8">
            <div className="flex flex-col space-y-4">
                <button onClick={signOut}>Logout</button>
                {message && <p className="text-green-700">{message}</p>}
                <h1>Les outils d'admin</h1>
                <ul>
                    {
                        data.map(element => (
                            <li key={element.id}>{element.address} - {element.balance} <button className="p-2 bg-red-500 text-white rounded-sm" value={element.id} onClick={deleteAddress}>Remove</button></li>
                        ))
                    }
                </ul>
                <div className="flex space-x-3">
                    <input className="border p-2 border-gray-500 rounded-lg" type="text" onChange={e => setAddress(e.target.value)} />
                    <button className="rounded-md p-2 text-white bg-green-500" onClick={addToWhitelist}>Add to whitelist</button>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const providers = await getProviders();
    const session = await getSession(context);

    return {
        props: {
            providers,
            session,
        }
    }
  }
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
    collection,
    setDoc,
    doc,
    where,
    query,
    getDocs
} from "@firebase/firestore";
import { db } from "../firebase";

const AddToWhitelist = ({
    countData,
    setCountData,
    getCount,
    balance,
    setBalance,
    setError,
    setSuccess,
    account,
}) => {
    
    const createDoc = async (newData) => {
        getCount();
        //validate eth address
        if(newData.address.match(/^0x[a-fA-F0-9]{40}$/)) {
            //whitelist limmit exceeded
            if(countData < 5) {
                // address already in DB ?
                let i = 0;
                try {
                    const q = query(collection(db, "whitelist"), where("address", "==", newData.address));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        i++;
                        console.log('add one')
                    });
                    
                } catch (err) {
                    setError('err');
                    setSuccess('');
                }
                
                if (i < 1) {
                    if (balance >= 0.01) {
                        try {
                            const createDoc = await setDoc(doc(db, 'whitelist', newData.id), newData);
                            setSuccess('You have been added to the whitelist!');
                            setError('');
                        } catch (err) {
                            setError(err);
                            setSuccess('');
                        }
                    } else {
                        setError('Not enough founds on your wallet');
                        setSuccess('');
                    }
                } else {
                    setError('Address already in whitelist');
                    setSuccess('');
                }
            } else {
                setSuccess('');
                setError('Whitelist max limit exceeded')
            }
        } else {
            setSuccess('');
            setError('Invalid address');
        }
        setTimeout(getCount, 500);
    }

    return (
        <div>
            <button className="bg-blue-600 px-5 py-3 text-white font-bold rounded-lg mt-6" onClick={() => {
                createDoc({address: account[0], id: uuidv4(), balance: balance})
            }}>Go on whitelist</button>
        </div>
    )
}

export default AddToWhitelist

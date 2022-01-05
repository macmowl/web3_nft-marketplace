import { useState, useEffect } from 'react';

const InfoUser = ({ account, balance}) => {
    return (
        <>
            <h3 className="text-2xl mb-3">User details</h3>
            <div className="bg-orange-100 rounded-lg p-6 mb-10">
                <div>
                    <p className="text-sm text-red-300">You have {balance} ETH in your account.</p>
                    <p>Your address is {account[0]}</p>
                </div>
            </div>
        </>
    )
}

export default InfoUser

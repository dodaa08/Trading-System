import React, { useState, useEffect } from 'react';
import { Luggage } from 'lucide-react';
import axios from 'axios';

function HeaderC() {
    const [quote, setQuote] = useState("");  
    const [volume, setVolume] = useState("");
    const [balance, setBalance] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await axios.post("http://10.12.80.135:3000/quote", {
                    userId: 1,
                    side: 'ask',
                    price: 200000,
                    quantity: 10
                });
                console.log(res.data);
                setQuote(res.data);  
            } catch (error) {
                console.error(error);
                setError("Failed to fetch quote");
            }
        };

        const fetchVolume = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/volume");
                console.log(res.data);
                setVolume(res.data.totalVolume); 
            } catch (error) {
                console.error(error);
                setError("Failed to fetch volume");
            }
        };


        const getBalance = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/balance", {
                    userId: 1,
                });
                console.log(res.data);
                setBalance(res.data.balance);
            }
            catch (error) {
                console.error(error);
                setError("Failed to fetch balance");
            }
        }

        getBalance();
        fetchVolume();
        fetchQuote(); 
    }, []); 

    return (
        <>
            <div className="bg-black/95 flex items-center justify-between px-10 py-4 border-b border-gray-800">
                {/* Left side - Logo */}
                    <a href="/" className="text-white hover:text-blue-400 transition">
                <div className="flex items-center gap-4">
                        <Luggage className="h-10 w-10 text-white" />
                    <div className="text-white text-2xl font-bold tracking-tight">SellMeUp</div>
                </div>
                    </a>

                {/* Right side - Volume, Quote, and Last Traded */}
                <div className="flex items-center gap-8">
                    {/* Volume */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg font-semibold text-blue-500">24h Volume</h1>
                        <span className="text-xl font-semibold text-white">{volume ? `$${volume}` : 'Loading...'}</span>
                    </div>

                    {/* Quote */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg font-semibold text-green-500">Quote</h1>
                        <span className="text-xl font-semibold text-white">
                            {quote.quantity ? `${quote.quantity} BTC - $${quote.price}` : 'Loading...'}
                        </span>
                    </div>

                    {/* Last Traded */}
                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg font-semibold text-yellow-500">Last Traded</h1>
                        <span className="text-xl font-semibold text-white">$</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <h1 className="text-lg font-semibold text-yellow-500">Balance</h1>
                        <span className="text-xl font-semibold text-white">${balance ? balance : error}</span>
                        {/* <span className="text-xl font-semibold text-white">BTC</span> */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default HeaderC;

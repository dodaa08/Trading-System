import React, { useState, useEffect } from "react";
import { Luggage } from "lucide-react";
import axios from "axios";
import {Link} from 'react-router-dom';



function HeaderC() {
  const [quote, setQuote] = useState("");
  const [volume, setVolume] = useState("");
  const [balance, setBalance] = useState(0);
  const [BTC, setBTC] = useState(0);
  const [error, setError] = useState("");
  const [checkUser, setCheckUser] = useState(false);

  

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await axios.get("https://trading-system-5.onrender.com/quote");
        console.log(res.data);
        setQuote(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch quote");
      }
    };

    const fetchVolume = async () => {
      try {
        const res = await axios.get("https://trading-system-5.onrender.com/volume");
        if (res.data && res.data.totalVolume !== undefined) {
          setVolume(res.data.totalVolume);
        } else {
          throw new Error("Invalid volume data");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch volume");
      }
      
    };

    const checkU = async () => {
      try {
        const check = localStorage.getItem('userId');
        if (check) {
          setCheckUser(true);
        }
      }
      catch (error) {
        console.error(error);
        setError("Failed to check user");
      }
    }

    const getBalance = async () => {
      try {
        const res = await axios.post("https://trading-system-5.onrender.com/balance", {
          userId: localStorage.getItem('userId'),
        });
        if (res.data && res.data.BTC !== undefined) {
          setBalance(res.data.balance);
          setBTC(res.data.BTC);
        } else {
          throw new Error("Invalid balance data");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch balance");
      }
    };

    // Run all fetch functions
    checkU();
    getBalance();
    fetchVolume();
    fetchQuote();
  }, []);

  return (
    <div className="bg-black/95 flex items-center justify-between px-10 py-4 border-b border-gray-800">
      {/* Left side - Logo */}
      <a href="/" className="text-white hover:text-blue-400 transition">
        <div className="flex items-center gap-4">
          <Luggage className="h-10 w-10 text-white" />
          <div className="text-white text-2xl font-bold tracking-tight">Trading Engine</div>
        </div>
      </a>

      <div className="flex items-center space-x-2">
        {
          !checkUser ? (
            <>
             <Link to="/create-user">
          <button className="text-xl border-2 py-2 px-5 rounded-xl border-gray-700 hover:border-gray-600 transition duration-200">Create User</button>
          </Link>
            </>
          ) : (
            <>
            {/* <h1>user created</h1> */}
            </>
          )
        }
         
        </div>

      {/* Right side - Volume, Quote, and Balance */}
      <div className="flex items-center gap-8">
        {/* Volume */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-blue-500">24h Volume</h1>
          <span className="text-xl font-semibold text-white">
            {volume ? `$${volume}` : "Loading..."}
          </span>
        </div>

        {/* Quote */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-green-500">Quote</h1>
          <span className="text-xl font-semibold text-white">
            {quote ? 
               `${quote}`
              : "Loading..."}
          </span>
        </div>

        {/* Balance */}
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold text-yellow-500">Balance</h1>
          <span className="text-xl font-semibold text-white">
            {balance !== null ? `$ ${balance}, ${BTC} BTC` : error || "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HeaderC;

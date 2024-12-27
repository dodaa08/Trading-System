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
        setQuote(res.data || 0);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch quote");
      }
    };

    const fetchVolume = async () => {
      try {
        const res = await axios.get("https://trading-system-5.onrender.com/volume");
        if (res.data && res.data.totalVolume !== undefined) {
          setVolume(res.data.totalVolume || 0);
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
        const check = localStorage.getItem("userId");
        if(check){
          const res = await axios.post("https://trading-system-5.onrender.com/balance", {
            userId: localStorage.getItem('userId'),
          });
          if (res.data && res.data.BTC !== undefined) {
            setBalance(res.data.balance);
            setBTC(res.data.BTC);
          } else {
            throw new Error("Invalid balance data");
          }
        }
        else{
          setBTC(0);
          setBalance(0);
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
    <div className="bg-black/95 w-full flex flex-wrap items-center justify-between px-4 sm:px-10 py-4 border-b border-gray-800">

      
<a href="/" className="flex items-center gap-4 text-white hover:text-blue-400 transition">
  <Luggage className="h-8 sm:h-10 text-white" />
  <div className="text-white text-xl sm:text-2xl font-bold tracking-tight">
    Trading Engine
  </div>
 
</a>


<div className="flex items-center space-x-2">
  {!checkUser ? (
    <div className="flex gap-10">
    <Link to="/create-user">
      <button className="text-sm sm:text-base border-2 py-1 sm:py-2 px-3 sm:px-5 rounded-xl border-gray-700 hover:border-gray-600 transition duration-200">
        Create User
      </button>
    </Link>
    <Link to="https://youtu.be/UW00Ub6g9ds?si=pD7VKO3uEZmixQcW" target="_blank" rel="noopener noreferrer">
    <div className="text-white text-l border-2 py-1 hover:bg-gray-800 transition duration-200 px-5 rounded-xl border-gray-600 sm:text-2xl font-bold tracking-tight">
    How it works
  </div>
    </Link>
    </div>
  ) : null}
</div>


<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-4 sm:mt-0">
  <div className="text-center sm:text-left">
    <h1 className="text-sm sm:text-base font-semibold text-blue-500">24h Volume</h1>
    <span className="text-base sm:text-lg font-semibold text-white">
      {volume ? `$${volume}` : "Loading..."}
    </span>
  </div>
  <div className="text-center sm:text-left">
    <h1 className="text-sm sm:text-base font-semibold text-green-500">Quote</h1>
    <span className="text-base sm:text-lg font-semibold text-white">
      {quote ? `${quote}` : "Loading..."}
    </span>
  </div>
  <div className="text-center sm:text-left">
    <h1 className="text-sm sm:text-base font-semibold text-yellow-500">Balance</h1>
    <span className="text-base sm:text-lg font-semibold text-white">
      {balance !== null ? `$ ${balance}, ${BTC} BTC` : error || "Loading..."}
    </span>
  </div>
</div>

    </div>
  );
}

export default HeaderC;

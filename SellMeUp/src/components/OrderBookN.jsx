import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";

function OrderBookN() {
    const [bid, setBid] = useState([]);
    const [ask, setAsk] = useState([]);
    const [animateBids, setAnimateBids] = useState([]);
    const [animateAsks, setAnimateAsks] = useState([]);
    const [checkUser, setCheckUser] = useState(false);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/bids");
                setBid(res.data.bids);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchAsks = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/asks");
                setAsk(res.data.asks);
            } catch (error) {
                console.log(error);
            }
        };

        const checkU = () => {
            try {
                const check = localStorage.getItem("userId");
                if (check) {
                    setCheckUser(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBids();
        fetchAsks();
        checkU();
    }, []);

    useEffect(() => {
        const shuffleArray = (array) => {
            const shuffledArray = [...array];
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        };

        const interval = setInterval(() => {
            setAnimateBids(shuffleArray(bid));
            setAnimateAsks(shuffleArray(ask));
        }, 2000);

        return () => clearInterval(interval);
    }, [bid, ask]);

    const formatNumber = (number) => new Intl.NumberFormat().format(number);

    return (
        <div className="border-2 border-gray-700 rounded-lg text-white p-4 bg-black/90 w-max max-w-2xl mx-auto">
            {/* Table Header */}
            <div className="flex justify-between gap-10 border-b border-gray-600 pb-2 text-gray-300 font-mono text-lg">
                <h1 className="w-1/4 text-left">Quantity (BTC)</h1>
                <h1 className="w-1/4 text-left">Price (USD)</h1>
                <h1 className="w-1/4 text-left">Exchange</h1>
                <h1 className="w-1/4 text-right">Total (BTC)</h1>
            </div>

            {/* Bids */}
            {animateBids.reduce((acc, bid, index) => {
                const runningTotal = (acc.runningTotal + bid.quantity);
                acc.elements.push(
                    <div key={index} className="flex gap-10 items-center py-1 border-b border-gray-800">
                        <div className="w-1/4 text-left bg-red-500/50 text-gray-100 px-2 py-1" style={{ width: `${(bid.quantity / 50) * 100}%` }}>
                            {bid.quantity}
                        </div>
                        <div className="w-1/4 text-left text-red-400">{formatNumber(bid.price)}</div>
                        <div className="w-1/4 flex items-center text-left">
                            <ArrowLeftRight className="text-yellow-400 mr-2" /> Binance
                        </div>
                        <div className="w-1/4 text-right text-green-400">
                            {formatNumber(runningTotal)}
                        </div>
                    </div>
                );
                acc.runningTotal = runningTotal;
                return acc;
            }, { runningTotal: 0, elements: [] }).elements}

            {/* Asks */}
            {animateAsks.reduce((acc, ask, index) => {
                const runningTotal = (acc.runningTotal + ask.quantity);
                acc.elements.push(
                    <div key={index} className="flex gap-10 items-center py-1 border-b border-gray-800">
                        <div className="w-1/4 text-left bg-green-500/50 text-gray-100 px-2 py-1" style={{ width: `${(ask.quantity / 50) * 100}%` }}>
                            {ask.quantity}
                        </div>
                        <div className="w-1/4 text-left text-green-400">{formatNumber(ask.price)}</div>
                        <div className="w-1/4 flex items-center text-left">
                            <ArrowLeftRight className="text-green-400 mr-2" /> Binance
                        </div>
                        <div className="w-1/4 text-right text-green-400">
                            {formatNumber(runningTotal)}
                        </div>
                    </div>
                );
                acc.runningTotal = runningTotal;
                return acc;
            }, { runningTotal: 0, elements: [] }).elements}

            {/* User Buttons */}
            {checkUser && (
                <div className="flex justify-center mt-4">
                    <Link to="/create">
                        <button className="border border-gray-600 px-4 py-2 rounded-md hover:border-gray-400 transition duration-200">
                            Create Bids/Asks
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default OrderBookN;

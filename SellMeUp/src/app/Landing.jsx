import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderC from '../components/HeaderC';
import OrderBookN from '../components/OrderBookN';
import OrderDepth from '../components/OrderDepth';

function Landing() {
    const [Bids, setBids] = useState([]);
    const [Asks, setAsks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bidsResponse = await axios.get("https://trading-system-5.onrender.com/bids");
                setBids(bidsResponse.data.bids);
                const asksResponse = await axios.get("https://trading-system-5.onrender.com/asks");
                setAsks(asksResponse.data.asks);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch order book data.");
            }
        };

        fetchData();
    }, []);

    const data = { bids: Bids, asks: Asks };

    return (
        <div className="bg-black h-full w-full text-white ">
            <div>
            <HeaderC />
            </div>
            <div className="bg-black h-screen py-10 flex flex-wrap justify-evenly ">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="">
                            <OrderBookN />
                        </div>
                        <div className="">
                            <OrderDepth data={data} />
                        </div>
                       
                        
                    </>
                )}
                
            </div>
        </div>
    );
}

export default Landing;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderC from '../components/HeaderC';
import OrderBookN from '../components/OrderBookN';
import OrderDepth from '../components/OrderDepth';
import Quote from '../components/Quote';

function Landing() {
    const [Bids, setBids] = useState([]);
    const [Asks, setAsks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bidsResponse = await axios.get("http://10.12.80.135:3000/bids");
                setBids(bidsResponse.data.bids);
                const asksResponse = await axios.get("http://10.12.80.135:3000/asks");
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
        <div className="bg-black h-full w-full text-white">
            <HeaderC />
            <div className="flex flex-wrap justify-evenly ">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="py-10">
                            <OrderBookN />
                        </div>
                        <div className="py-20">
                            <OrderDepth data={data} />
                        </div>
                       
                        
                    </>
                )}
                
            </div>
        </div>
    );
}

export default Landing;

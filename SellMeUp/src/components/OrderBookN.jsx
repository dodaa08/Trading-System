import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderDepth from './OrderDepth';
import {Link} from 'react-router-dom';

function OrderBookN() {
    const [bid, setBid] = useState([]);
    const [ask, setAsk] = useState([]);
    const [animateBids, setAnimateBids] = useState([]);
    const [animateAsks, setAnimateAsks] = useState([]);
    
    useEffect(() => {
        const fetchBids = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/bids");
                setBid(res.data.bids);
            } catch (Error) {
                console.log(Error);
            }
        }
        const fetchAsks = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/asks");
                setAsk(res.data.asks);
            } catch (Error) {
                console.log(Error);
            }
        }
        fetchBids();
        fetchAsks();
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
        }, 2000); // Shuffle every 2 seconds

        return () => clearInterval(interval);
    }, [bid, ask]);

    const calculateWidth = (quantity) => {
        const maxQuantity = Math.max(...bid.map(b => b.quantity), ...ask.map(a => a.quantity));
        return (quantity / maxQuantity) * 70; // Reduce the width to 70% of the calculated value
    }

    return (
        <>
        
        <div className='border-2 border-gray-700 rounded-xl p-4 text-white w-96 bg-black/125 '>
            
            <div className='mb-4'>
                <h1 className='text-2xl font-mono border-b border-gray-700 pb-2'>Bids</h1>
                <div className='flex justify-between gap-10 mt-4'>
                    <h1 className='font-mono text-xl'>Quantity</h1>
                    <h1 className='font-mono text-xl'>Price</h1>
                </div>
                <div className='mt-2'>
                    {animateBids.map((bids, index) => (
                        <div key={index} className={`flex justify-between py-1 animate-flip`}>
                            <div className='bg-red-400/50' style={{ width: `${calculateWidth(bids.quantity)}%` }}>
                                <h1>{bids.quantity}</h1>
                            </div>
                            <h1>{bids.price}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className='text-2xl font-mono border-b border-gray-700 pb-2'>Asks</h1>
                <div className='flex justify-between gap-10 mt-4'>
                    <h1 className='font-mono text-xl'>Quantity</h1>
                    <h1 className='font-mono text-xl'>Price</h1>
                </div>
                <div className='mt-2'>
                    {animateAsks.map((asks, index) => (
                        <div key={index} className={`flex justify-between py-1 animate-flip`}>
                            <div className='bg-green-400/50' style={{ width: `${calculateWidth(asks.quantity)}%` }}>
                                <h1>{asks.quantity}</h1>
                            </div>
                            <h1>{asks.price}</h1>
                        </div>
                    ))}
                </div>

                
            </div>
            <div className='flex justify-center w-full py-5 '>
                    <Link to="/create">
                     <button className='border-2 border-gray-600 py-2 px-5 rounded-xl font-mono hover:border-b transition duration-200'>Create Bids/Asks</button>
                    </Link>
                
                </div>
        </div>
       
                    </>
    );
}

export default OrderBookN;

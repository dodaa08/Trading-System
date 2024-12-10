import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Quote() {
    const [quote, setQuote] = useState({});  // Initialize as an empty object
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const res = await axios.post("http://10.12.80.135:3000/quote", {
                    userId: 1,         // Add userId
                    side: 'ask',       // Side as 'ask'
                    price: 200000,     // Price
                    quantity: 10       // Quantity
                });
                console.log(res.data);
                setQuote(res.data);  // Save the whole response object
            } catch (error) {
                console.error(error);
                setError("Failed to fetch quote");
            }
        };

        fetchQuote();  // Call the function inside useEffect
    }, []);  // Empty dependency array means it runs once after component mounts

    return (
        <div className='flex justify-center gap-10'>

<div className='bg-black h-full border-2   w-max py-2 px-10 rounded-xl  border-gray-800  align-center items-center '>
        
        <div className='flex justify-center'>
            <h1 className='text-2xl font-mono text-white border-b  border-gray-500'>Latest Quote</h1>
        </div>
        <div className='flex justify-center py-10  gap-10'>
            <div className='flex flex-col gap-2'>

            <h1 className='text-xl font-mono text-white'>Price</h1>
            <div className='flex gap-10'>
            <h1 className='text-2xl font-mono '>{quote.price}</h1> 
            </div>
            
            </div>
: 
            <div className='flex flex-col gap-2'>

            <h1 className='text-xl font-mono text-white'>Quantity</h1>
            <div className='flex gap-10'>
            <h1 className='text-2xl font-mono '>{quote.quantity}</h1> 
            </div>
            
            </div>
        </div>
       </div>
       <div className='bg-black h-full border-2   w-max py-2 px-10 rounded-xl border-gray-800 align-center items-center '>
        
        <div className='flex justify-center'>
            <h1 className='text-2xl font-mono text-white border-b  border-gray-500'>BTC Price/ Last traded at </h1>
        </div>
        <div className='flex justify-center py-10  gap-10'>
            <div className='flex flex-col gap-2'>

            <h1 className='text-xl font-mono text-white'>Price</h1>
            <div className='flex gap-10'>
            <h1 className='text-2xl font-mono '>{quote.price}</h1> 
            </div>
            
            </div>
: 
            <div className='flex flex-col gap-2'>

            <h1 className='text-xl font-mono text-white'>Quantity</h1>
            <div className='flex gap-10'>
            <h1 className='text-2xl font-mono '>{quote.quantity}</h1> 
            </div>
            
            </div>
        </div>
       </div>
        </div>
    );
}

export default Quote;

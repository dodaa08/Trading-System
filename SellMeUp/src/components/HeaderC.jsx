import React from 'react'
import { Luggage } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';


function HeaderC() {
    const [quote, setQuote] = useState("");  // Initialize as an empty object
    const [Volume, setVolume] = useState("");

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


        const fetchVolume = async () => {
            try {
                const res = await axios.get("http://10.12.80.135:3000/volume");
                console.log(res.data);
                setVolume(res.data.totalVolume); // Save the whole response object
            }
            catch (error) {
                console.error(error);
                setError("Failed to fetch volume");
            }
        }
        
        fetchVolume();
        fetchQuote();  // Call the function inside useEffect
    }, []);  // Empty dependency array means it runs once after component mounts
    return (
        <>
        
            <div className='bg-black flex  border-b  border-gray-800'>
                
                <div className='ml-10 w-full py-5 flex gap-5'>
                <a href="/" className=''>
                     <Luggage className='rounded-l h-8 w-10' />
                </a>
                    <div className='text-white text-xl font-mono py-1'>SellMeUp</div>
                </div>

                
                <div className='flex justify-center w-full py-5 gap-10 mr-40  '>
                    
                     <h1 className='text-xl font-mono text-blue-500'>24h Volume  ${Volume}</h1>
                     <h1 className='text-xl font-mono text-green-500'>Quote  {quote.quantity}BTC - ${quote.price} </h1>
                     <h1 className='text-xl font-mono '>Last Traded $ </h1>
                    
                </div>
                
              
         
            
        </div>
        </>
    )
}

export default HeaderC

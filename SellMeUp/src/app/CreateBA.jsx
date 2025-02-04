import React, { useState } from 'react';
import HeadersC from '../components/HeaderC';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function CreateBA() {

    // 🟢 State Variables
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    
    const [side, setSide] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    // 🟢 Create Order (Fixed)
    const createRecords = async () => {
        // 1️⃣ Form Validation 
        if ( !price || !quantity || !side) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true); // Start loading
            setError(null); // Clear previous errors

            const response = await axios.post("https://trading-system-5.onrender.com/order", {
                userId: localStorage.getItem('userId'),
                side: side,
                price: Number(price),
                quantity: Number(quantity)
            });

            console.log(response.data);
            alert(response.data.message);
            navigate('/'); // Redirect to orderbook after successful creation
            // 🟢 Reset the form after success
            setPrice('');
            setQuantity('');
            setSide('');
        } catch (error) {
            console.error("Error creating record:", error);
            setError(error.response ? error.response.data.message : 'An unexpected error occurred');
        } finally {
            setLoading(false); // End loading
        }
    }

    return (
        <>
        <div className='bg-black text-white h-screen'>
            <HeadersC />

            <div className='flex flex-col justify-center'>
                <div className='flex justify-center py-10 text-xl font-mono '>
                    <select 
                        className='text-white bg-black border-b rounded-l py-1 px-5'
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                    >
                        <option value="" disabled hidden>Buy/Sell</option> 
                        <option value="bid">Buy</option> 
                        <option value="ask">Sell</option>
                    </select>
                </div>

                <div className='flex justify-center'>
                    <div className='flex flex-col gap-5 w-max'>
                       

                        <input 
                            type="text" 
                            placeholder='Enter Price' 
                            className='py-3 px-5 rounded-xl bg-black border-2' 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} 
                        />

                        <input 
                            type="text" 
                            placeholder='Enter Quantity' 
                            className='py-3 px-5 rounded-xl bg-black border-2' 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value.replace(/[^0-9.]/g, ''))} 
                        />

                        <div className='flex justify-center py-8'>
                            <button 
                                className='bg-blue-500 rounded-xl hover:bg-blue-400 transition duration-200 py-2 px-8 font-mono text-xl' 
                                onClick={createRecords}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : (side ? side : 'Select Bid or Ask')}
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default CreateBA;

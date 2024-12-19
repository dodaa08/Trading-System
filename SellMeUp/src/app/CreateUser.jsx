import React, { useState } from 'react'
import HeaderC from '../components/HeaderC'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false); // Loading state to disable button
    const [error, setError] = useState(''); // Error message for the user
    const navigate = useNavigate();
    // 📘 Reusable Input Component
   

    // 📘 Function to create user in the database
    const createRecords = async () => {
        // Clear previous error
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.post("https://trading-system-5.onrender.com/createUser", {
                name: name,
                userId: userId
            });

            console.log('Response:', response.data);
            localStorage.setItem('userId', userId);
            alert("User created successfully!");  
            navigate('/'); // Redirect to orderbook after successful creation          
            // Reset form after successful creation
            setName('');
            setUserId('');
        } catch (error) {
            console.error("Error creating record:", error);
            const message = error?.response?.data?.message || 'An error occurred while creating the user.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-black h-screen text-white transition duration-200'>
            <HeaderC />
            <div className='flex justify-center py-40'>
                <div className='flex flex-col justify-center gap-5'>
                    <h2 className="text-center text-2xl font-bold">Create New User</h2>

                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className='py-3 px-5 rounded-xl bg-black border-2'
                    />

                    <input 
                        type="text" 
                        placeholder="Enter User ID" 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        className='py-3 px-5 rounded-xl bg-black border-2'
                    />

                    <div className='flex justify-center'>
                        <button 
                            onClick={createRecords} 
                            className={`py-2 px-8 rounded-xl border-2 border-gray-800 
                                ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUser;

import React from 'react'
import { Luggage } from 'lucide-react';
import { Link } from 'lucide-react';

function HeaderC() {
    return (
        <>
        <div className=''>
            <div className='bg-black flex justify-between border-b  border-gray-800'>
                <div className='flex gap-5 ml-10 w-full py-5'>
                <a href="/" className='flex gap-5'>
                     <Luggage className='rounded-l h-8 w-10' />
                    <div className='text-white text-xl font-mono py-1'>SellMeUp</div>
                </a>
                </div>
                
                <div className='flex gap-10 ml-10 w-full py-5 '>
                     <button className=' hover:bg-blue-400  hover:text-black text-white transition duration-200 text-l rounded-xl font-mono py-2 px-5'>Create Bids/Asks</button>
                    
                </div>
                <div className='flex gap-10 ml-10 w-full py-5 '>
                     <button className=' hover:bg-blue-400  hover:text-black text-white transition duration-200 text-l rounded-xl font-mono py-2 px-5'>Get Quote</button>
                     <button className=' hover:bg-green-400  hover:text-black text-white transition duration-200 text-l rounded-xl font-mono py-2 px-5'>Get Depth</button>
                </div>
                

            </div>
        </div>
        </>
    )
}

export default HeaderC

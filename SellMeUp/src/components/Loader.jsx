import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';


function LoaderC(){
    const [change, setchange] = useState("Loading...");
    const ChangeValue = ()=>{
        setchange("Fetching the Current Trades....");
    }
    useEffect(()=>{
        setInterval(ChangeValue, 10000);
    },[change])
    
    return(
        <>
        <div className='bg-black h-full'>
            <div className='h-screen'>

                    <div className='flex justify-center'>
                        <div className='flex flex-col py-40 gap-10'>

                        <div className='flex justify-center'>
                    <Loader  className='bg-white h-20 w-auto'/>
                        </div>
                    <h1 className='text-white'>{
                        change
                    }</h1>
                    </div>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default LoaderC
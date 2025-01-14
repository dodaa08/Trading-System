import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderC from '../components/HeaderC';
import OrderBookN from '../components/OrderBookN';
import OrderDepth from '../components/OrderDepth';
import Loader from '../components/Loader';

function Landing() {
    const [Bids, setBids] = useState([]);
    const [Asks, setAsks] = useState([]);
    const [error, setError] = useState(null);
    const [isloading, setisloading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setisloading(true)
                const bidsResponse = await axios.get("https://trading-system-5.onrender.com/bids");
                setBids(bidsResponse.data.bids);
                const asksResponse = await axios.get("https://trading-system-5.onrender.com/asks");
                setAsks(asksResponse.data.asks);
                setisloading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch order book data.");
            }
        };

        fetchData();
    }, []);

    const data = { bids: Bids, asks: Asks };

    return (
        <>
        {
            !isloading && 
            <div className="text-white min-h-screen flex flex-col overflow-hidden">
            <HeaderC />
            <div className="bg-black flex-grow flex flex-col sm:flex-row justify-evenly py-5 overflow-hidden">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                    <div className="flex-grow sm:flex-grow-0 py-10">
                    <OrderBookN />
                    </div>
                    <div className="py-20 flex-grow sm:flex-grow-0">
                    <OrderDepth data={data} />
                    </div>
                    </>
                )}
                </div>
                </div>
            }
            {
                isloading && 
                <Loader />
            }
            </>
    );
}

export default Landing;









// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import HeaderC from '../components/HeaderC';
// import OrderBookN from '../components/OrderBookN';
// import OrderDepth from '../components/OrderDepth';

// // function Landing() {
//     const [Bids, setBids] = useState([]);
//     const [Asks, setAsks] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const bidsResponse = await axios.get("https://trading-system-5.onrender.com/bids");
//                 setBids(bidsResponse.data.bids);
//                 const asksResponse = await axios.get("https://trading-system-5.onrender.com/asks");
//                 setAsks(asksResponse.data.asks);
//             } catch (err) {
//                 console.error(err);
//                 setError("Failed to fetch order book data.");
//             }
//         };

//         fetchData();
//     }, []);

//     const data = { bids: Bids, asks: Asks };

//     return (
//         <div className="text-white h-full sm:h-full">
//             <div className=''>
//             <HeaderC />
//             </div>
//             <div className="bg-black h-screen sm:h-screen flex justify-evenly py-10">
//                 {error ? (
//                     <div className="text-red-500">{error}</div>
//                 ) : (
//                     <>
//                         <div className="">
//                             <OrderBookN />
//                         </div>
//                         <div className="py-10">
//                             <OrderDepth data={data} />
//                         </div>
                       
                        
//                     </>
//                 )}
                
//             </div>
//         </div>
//     );
// }

// export default Landing;
// import React, { useContext, useEffect } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { useSearchParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import './Verify.css';

// const Verify = () => {
//     const { navigate, token, setCartItems } = useContext(ShopContext);
//     const [searchParams] = useSearchParams();
//     const success = searchParams.get('success');
//     const orderId = searchParams.get('orderId');
//     const reference = searchParams.get("reference");

//     const verifyPayment = async () => {
//         if (!token) return; // Exit if no token

//         try {
//             const response = await axios.get(`http://localhost:4000/api/order/verifyPaystack?reference=${orderId, reference}`);

//             if (response.data.success) {
//                 setCartItems({});
//                 navigate('/orders');
//             } else {
//                 toast.error("Payment verification failed. Please try again.");
//                 navigate('/cart');
//             }
//         } catch (error) {
//             console.error("Verification error:", error);
//             toast.error("An error occurred during verification. Please try again.");
//             navigate('/cart');
//         }
//     };

//     useEffect(() => {
//         if (success & orderId && reference) {
//             verifyPayment();
//         } else {
//             navigate('/cart'); // Redirect if not successful
//         }
//     }, [success, orderId, reference]);

//     return (
//         <div className='loader'>
//             {/* You can add a loading spinner or message here if needed */}
//             <p>Verifying payment...</p>
//         </div>
//     );
// };

// export default Verify;


import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Verify.css';

const Verify = () => {
    const { navigate, token, setCartItems } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    const reference = searchParams.get("reference");

    const verifyPayment = async () => {
        if (!token) return; // Exit if no token

        try {
            const response = await axios.get(`http://localhost:4000/api/order/verifyPaystack?orderId=${orderId}&reference=${reference}`);

            if (response.data.success) {
                setCartItems({});
                navigate('/orders');
            } else {
                toast.error("Payment verification failed. Please try again.");
                navigate('/cart');
            }
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("An error occurred during verification. Please try again.");
            navigate('/cart');
        }
    };

    useEffect(() => {
        if (success && orderId && reference) {
            verifyPayment();
        } else {
            navigate('/cart'); // Redirect if not successful
        }
    }, [success, orderId, reference]);

    return (
        <div className='loader'>
            {/* You can add a loading spinner or message here if needed */}
            <p>Verifying payment...</p>
        </div>
    );
};

export default Verify;

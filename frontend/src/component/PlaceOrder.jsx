import React, { useState } from 'react';
import img from '../admin/images/qrcode.png';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function PlaceOrder() {
    const location = useLocation();
    const [number, setNumber] = useState(0);
    const navigate = useNavigate()

    const { totalAmount } = location.state;
    const userId = localStorage.getItem("userid");
    
    const handlePlaceOrder = async () => {
        // Convert the number input to a number type for comparison
        const inputAmount = Number(number);
        
        if (inputAmount === totalAmount) {
            try {
                // Make the axios call
                const res = await axios.post('http://localhost:8004/orderpage', { userId ,totalAmount});
                toast.success("Order placed successfully!");
                console.log(res);
               
               setTimeout(()=>{
                navigate('/user/ordercard' ,{
                    state: { totalAmount  }
                  })
               },2000)
            } catch (error) {
                console.error(error);
                // alert("Error placing the order.");
            }
        } else {
            toast.error("The entered amount does not match the total amount.");
        }
    };

    return (

            <div className='flex max-w-screen max-h-screen justify-center items-center bg-gray-100'>
            <div className='bg-white shadow-md rounded-lg p-8 mt-4'>
                <h1 className='text-3xl font-bold mb-2'>Confirm Your Order</h1>

                <div className='mb-2'>
                    <p className='text-lg mb-2'>Scan QR Code to Pay:</p>
                    <img src={img} alt="QR Code" className='mx-auto w-48 h-48' />
                </div>

                <div className='mb-2'>
                    <p className='text-xl'>Total Payable Amount: <span className='font-bold'> &#8377;{(totalAmount).toFixed(2)}</span></p>
                </div>

                <div className='mb-2'>
                    <label className='block text-lg mb-2' htmlFor="totalAmount">Enter Total Amount:</label>
                    <input 
                        type='number' 
                        id="totalAmount" 
                        className='border rounded-md w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                        placeholder="Enter amount"
                        onChange={(e) => setNumber(e.target.value)}
                    />
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    className='bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-600 transition duration-200'>
                    Confirm Order
                </button>
            </div>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default PlaceOrder;

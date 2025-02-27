import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function OrderRequest() {
    const [orders, setOrders] = useState([]);

    const fetchData = async () => {
        try {
            const res = await axios.post('http://localhost:8004/orderreq');
            setOrders(res.data); // Correctly use res.data
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching data:", error); // Log the error for debugging
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to group orders by order_id
    const groupOrdersById = (orders) => {
        return orders.reduce((acc, order) => {
            (acc[order.order_id] = acc[order.order_id] || []).push(order);
            return acc;
        }, {});
    };

    const acept = async(orderId) =>{ 
        try {
            const res = await axios.post('http://localhost:8004/accept', { orderId });
            console.log(res);
            toast.success(`${orderId} is accepted`);
    
            // Update the orders state directly if needed
            setOrders((prevOrders) => prevOrders.filter(order => order.order_id !== orderId));
    
            // Or refetch data
            fetchData(); // This should still work if your backend is set up correctly
        } catch (error) {
            console.error(error);
        }
    };
    const cancel = async (orderId) => {
        try {
            const res = await axios.post('http://localhost:8004/cancel', { orderId });
            console.log(res);
            toast.success(`Order ID ${orderId} has been canceled`);
    
            // Update the orders state directly
            setOrders((prevOrders) => 
                prevOrders.filter(order => order.order_id !== orderId)
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel the order.");
        }
    };
    

    const groupedOrders = groupOrdersById(orders);

    return (
        <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-6">
              <ToastContainer position='top-right' autoClose={1000} closeOnClick />
            {Object.keys(groupedOrders).length > 0 ? (
                Object.keys(groupedOrders).map((orderId) => (
                    <div key={orderId} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Order ID: {orderId}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {groupedOrders[orderId].map((item) => (
                                        <tr key={item.product_id} className="hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img
                                                    src={`http://localhost:8004/${item.photo}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-semibold">{item.name}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-gray-500">₹{parseFloat(item.price).toFixed(2)}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <p className="font-semibold">{item.quantity}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Buttons for the order */}
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={()=>acept(orderId)} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                                Accept this Order
                            </button>
                            <button onClick={()=>cancel(orderId)} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                                Cancel this Order
                            </button>
                        </div>
                    </div>
                  
                ))
            ) : (
                <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-6">
                    No orders found
                </div>
            )}
        </div>
    );
}

export default OrderRequest;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating'; 
import { toast, ToastContainer } from 'react-toastify';

function PurchaseHistory() {
    const [orders, setOrders] = useState([]);
    const [ratings, setRatings] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; 
    const userId = localStorage.getItem('userid');

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const res = await axios.post('http://localhost:8004/purchasehistory', { userId });
            setOrders(res.data);
        } catch (err) {
            console.error('Failed to fetch purchase history', err);
        }
    };

    // Handle rating change
    const handleRatingChange = (orderId, value) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [orderId]: value,
        }));
    };

    const handleRatingSubmit = async (orderId) => {
        try {
            await axios.post(`http://localhost:8004/submit-rating`, {
                userId,
                orderId,
                rating: ratings[orderId],
            });
            toast.success(`Rating submitted successfully for order ID: ${orderId}`);
            fetchData();
        } catch (error) {
            console.error('Error submitting rating:', error);
            toast.error('Failed to submit rating. Please try again.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const groupOrdersById = (orders) => {
        return orders.reduce((acc, order) => {
            if (!acc[order.order_id]) {
                acc[order.order_id] = [];
            }
            acc[order.order_id].push(order);
            return acc;
        }, {});
    };

    const groupedOrders = groupOrdersById(orders);
    const totalPages = Math.ceil(Object.keys(groupedOrders).length / ordersPerPage);
    const currentOrdersKeys = Object.keys(groupedOrders).slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
            {orders.length > 0 ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
                    <div className="space-y-4">
                        {currentOrdersKeys.map(orderId => (
                            <div key={orderId} className="border rounded p-4 bg-gray-50">
                                <h3 className="font-bold text-xl text-center mb-2">Order ID: {orderId}</h3>
                                {groupedOrders[orderId].map(order => (
                                    <div key={order.id} className="border-b last:border-b-0 pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <img
                                                    src={`http://localhost:8004/${order.photo}`}
                                                    alt="Product"
                                                    className="w-24 h-24 object-cover rounded-md mr-4" // Increased size
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{order.product_id}</p>
                                                    <p className="text-sm">Quantity: {order.quantity}</p>
                                                    <p className="text-sm">Status: {order.status}</p>
                                                    <p className="text-sm">Date: {order.date}</p>
                                                </div>
                                            </div>
                                            <div className="py-2">
                                                {order.status === 'approved' ? (
                                                    <>
                                                        {order.rating ? (
                                                            <StarRating rating={order.rating} onRatingChange={() => {}} />
                                                        ) : (
                                                            <>
                                                                <StarRating
                                                                    rating={ratings[order.id] || 0}
                                                                    onRatingChange={(value) => handleRatingChange(order.id, value)}
                                                                />
                                                                <button
                                                                    onClick={() => handleRatingSubmit(order.id)}
                                                                    className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                                                                >
                                                                    Submit
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p>N/A</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
                            disabled={currentPage === 1}
                        >
                            &lt; Previous
                        </button>
                        <div className="mx-4">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleNextPage}
                            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                    <div className="mt-2 text-center">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                </>
            ) : (
                <div>No records found</div>
            )}
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default PurchaseHistory;

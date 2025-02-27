import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import 'tailwindcss/tailwind.css';

const Download = () => {
    const [orders, setOrders] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUsername, setSelectedUsername] = useState('');
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [showUserSearch, setShowUserSearch] = useState(false);
    const ordersPerPage = 10;

    useEffect(() => {
        fetchOrders();
        fetchUserIds();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [selectedUserId, date, currentPage]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8004/api/orders', {
                params: {
                    userId: selectedUserId || null,
                    date: date || null,
                    page: currentPage,
                    limit: ordersPerPage,
                },
            });

            setOrders(response.data.orders);
            setTotalOrders(response.data.totalOrders);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    const fetchUserIds = async () => {
        try {
            const response = await axios.get('http://localhost:8004/api/users');
            setUserIds(response.data);
        } catch (error) {
            console.error('Error fetching user IDs:', error);
        }
    };

    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    const handlePageClick = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const downloadPDF = async () => {
        // PDF generation logic...
    };

    // Determine which pages to show
    const getPaginationButtons = () => {
        const buttons = [];
        if (totalPages <= 2) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            if (currentPage === 1) {
                buttons.push(1, 2);
            } else if (currentPage === totalPages) {
                buttons.push(totalPages - 1, totalPages);
            } else {
                buttons.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return buttons.filter(page => page > 0 && page <= totalPages);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4">
                {/* User Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Username"
                        value={selectedUsername}
                        onClick={() => setShowUserSearch(true)}
                        onChange={(e) => setSelectedUsername(e.target.value)}
                        className="p-2 border rounded w-48"
                    />
                    {showUserSearch && userIds.length > 0 && (
                        <ul className="absolute bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto">
                            {userIds
                                .filter((user) => user.username.toLowerCase().includes(selectedUsername.toLowerCase()))
                                .map((user) => (
                                    <li
                                        key={user.id}
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            setSelectedUserId(user.id?.toString() || '');
                                            setSelectedUsername(user.username || '');
                                            setShowUserSearch(false);
                                        }}
                                    >
                                        {user.username}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded"
                />
                <button onClick={downloadPDF} className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600 focus:outline-none">
                    Download PDF
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Order ID</th>
                            <th className="py-2 px-4 border">User ID</th>
                            <th className="py-2 px-4 border">Username</th>
                            <th className="py-2 px-4 border">Product ID</th>
                            <th className="py-2 px-4 border">Quantity</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Created At</th>
                            <th className="py-2 px-4 border">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="py-2 px-4 border">{order.order_id}</td>
                                    <td className="py-2 px-4 border">{order.user_id}</td>
                                    <td className="py-2 px-4 border">{order.username}</td>
                                    <td className="py-2 px-4 border">{order.product_id}</td>
                                    <td className="py-2 px-4 border">{order.quantity}</td>
                                    <td className="py-2 px-4 border">{order.status}</td>
                                    <td className="py-2 px-4 border">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border">{order.rating}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-2 px-4 border text-center">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                    &lt; Previous
                </button>
                {getPaginationButtons().map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                    Next &gt;
                </button>
            </div>
            <div className="mt-4 text-center">
                <span>
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    );
};

export default Download;

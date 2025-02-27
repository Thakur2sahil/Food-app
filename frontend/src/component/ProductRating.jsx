import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ProductRating() {
    const location = useLocation();
    const { pid } = location.state;
    const [data, setData] = useState([]);

    const fetchRating = async () => {
        try {
            const res = await axios.get('http://localhost:8004/rate', {
                params: { pid } // Pass pid as a query parameter
            });
            setData(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching rating:', error);
            // alert('Failed to fetch rating. Please try again.');
        }
    };

    useEffect(() => {
        fetchRating();
    }, []);

    // Calculate average rating
    const calculateAverageRating = () => {
        if (data.length === 0) return 0;
        const totalRating = data.reduce((acc, item) => acc + item.rating, 0);
        return (totalRating / data.length).toFixed(2); // Return average with 2 decimal points
    };

    const averageRating = calculateAverageRating();

    return (
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Product Ratings</h2>
            {data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border">Username</th>
                                <th className="py-2 px-4 border">Product ID</th>
                                <th className="py-2 px-4 border">User ID</th>
                                <th className="py-2 px-4 border">Rating</th>
                                <th className="py-2 px-4 border">Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.order_id}>
                                    <td className="py-2 px-4 border">{item.username}</td>
                                    <td className="py-2 px-4 border">{item.product_id}</td>
                                    <td className="py-2 px-4 border">{item.user_id}</td>
                                    <td className="py-2 px-4 border">{item.rating}</td>
                                    <td className="py-2 px-4 border">{item.order_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        <strong>Average Rating: </strong>
                        {averageRating}
                    </div>
                </div>
            ) : (
                <div>No ratings found for this product.</div>
            )}
        </div>
    );
}

export default ProductRating;

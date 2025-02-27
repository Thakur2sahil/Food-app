import React, { useEffect, useState } from 'react';
import Usernav from './Usernav';
import Card from './Card';
import axios from 'axios';

function UserDashboard() {
    const [cartCount, setCartCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const userId = localStorage.getItem('userid')
    const fetchData = async () => {
        try {
            const res = await axios.post('http://localhost:8004/cartCount', { userId });
            setCartCount(res.data.count); // Use res.data.count to get the count
        } catch (error) {
            console.error("Error fetching cart count:", error); // Log any error
        }
    };

    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]); // Add userId as a dependency


    return (
        <div>
            <Usernav setSearchTerm={setSearchTerm} cartCount={cartCount} />
            <Card setCartCount={setCartCount} searchTerm={searchTerm} />
        </div>
    );
}

export default UserDashboard;
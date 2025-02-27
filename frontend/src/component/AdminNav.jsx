import React, { useEffect, useState } from 'react';
import img1 from '../admin/images/ubereats.png'; // Logo or admin image
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminNav() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchprofile = async () => {
            const userId = localStorage.getItem('userid');
            if (!userId) return; // Early return if userId is not available

            try {
                const res = await axios.get(`http://localhost:8004/profiledata?userId=${userId}`); // Correct URL
                if (res.data) {
                    setImage(res.data.image);
                    setUsername(res.data.username);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error); // Improved error message
            }
        };
        fetchprofile();
    }, []);

    const handleClick = () => {
        navigate('/admin/updateprofile');
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/'; // Redirect to home page
    };

    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-gray-800 p-2 rounded-full">
                    <img src={img1} alt="Admin Logo" className="h-10 w-auto" />
                </div>
            </div>
            <div className="flex items-center mr-5">
                <span
                    onClick={handleClick}
                    className='hover:underline cursor-pointer text-lg mx-3 text-white font-semibold'
                >
                    User Profile
                </span>
                <div className="flex items-center text-white">
                    {image && <img src={`http://localhost:8004/${image}`} alt="User Profile" className="h-8 w-8 rounded-full mx-3" />}
                    <h2 className="text-lg mx-3">{username}</h2>
                </div>
                <button
                    className="bg-red-500 hover:bg-red-600 ml-3 text-white font-semibold py-2 px-4 rounded-md"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default AdminNav;
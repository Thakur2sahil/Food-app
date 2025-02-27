import React, { useEffect, useState } from 'react';
import img from '../admin/images/ubereats.png';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import axios from 'axios';

function Usernav({ setSearchTerm, cartCount }) {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for toggling the menu
    const userId = localStorage.getItem('userid');

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const response = await axios.get(`http://localhost:8004/cart/${userId}`);
                setCartCount(response.data.length);
            } catch (error) {
                console.error('Error fetching cart count:', error);
            }
        };

        if (userId) {
            fetchCartCount();
        }
    }, [userId]);

    useEffect(() => {
        setImage(localStorage.getItem('photo'));
        setName(localStorage.getItem('name'));
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className='max-w-full mx-auto flex items-center justify-between w-screen'>
            <div className='w-full bg-black'>
                <nav className='px-2 py-2 text-white flex items-center justify-between'>
                    <div className='flex items-center'>
                        <img src={img} alt='#' className='bg-black w-20 h-20' />
                        <button className='md:hidden ml-4' onClick={toggleMenu}>
                            {isMenuOpen ? <FaTimes className="text-white" /> : <FaBars className="text-white" />}
                        </button>
                        <div className={`hidden md:flex ml-14 w-8/12`}>
                            <ul className='flex items-center justify-evenly space-x-6'>
                                <li className='hover:underline cursor-pointer'>
                                    <Link to={'/user/userhome'}>Home</Link>
                                </li>
                                <li className='hover:underline cursor-pointer'>
                                    <Link to={'/user/about'}>About</Link>
                                </li>
                                <li className='hover:underline cursor-pointer'>
                                    <Link to={'/user/contact'}>Contact</Link>
                                </li>
                                <li>
                                    <input
                                        type='search'
                                        className='outline-none text-black px-2 py-1 rounded'
                                        placeholder='Search dishes...'
                                        onChange={handleSearchChange}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <span className='hover:underline cursor-pointer'>
                            <Link to={'/user/userupdateprofile'}>User Profile</Link>
                        </span>
                        <img src={`http://localhost:8004/${image}`} alt={name} className='w-12 h-12 rounded-full' />
                        <span>{name}</span>
                        <Link to="/user/cart" className="relative">
                            <FaShoppingCart className="text-white text-2xl" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>
                        <button className='px-4 py-2 bg-red-500 rounded hover:bg-red-600' onClick={() => {
                            localStorage.clear();
                            navigate('/');
                        }}>
                            Logout
                        </button>
                    </div>
                </nav>
                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className={`md:hidden bg-black`}>
                        <ul className='flex flex-col items-center space-y-4 py-4'>
                            <li className='hover:underline cursor-pointer'>
                                <Link to={'/user/userhome'}>Home</Link>
                            </li>
                            <li className='hover:underline cursor-pointer'>
                                <Link to={'/user/about'}>About</Link>
                            </li>
                            <li className='hover:underline cursor-pointer'>
                                <Link to={'/user/contact'}>Contact</Link>
                            </li>
                            <li>
                                <input
                                    type='search'
                                    className='outline-none text-black px-2 py-1 rounded'
                                    placeholder='Search dishes...'
                                    onChange={handleSearchChange}
                                />
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Usernav;

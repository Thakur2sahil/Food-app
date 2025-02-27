import React from 'react';
import img from '../admin/images/ubereats.png'
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer  className="bg-gray-900 text-gray-300 py-4 ">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                
                {/* Left Section: Logo and Copyright */}
                <div className="flex items-center space-x-2">
                    {/* UberEats Logo */}
                    <img 
                        src={img}
                        alt="UberEats Logo" 
                        className="w-16 h-10" 
                    />
                    <p>© 2024 UberEats. All rights reserved.</p>
                </div>
                
                {/* Right Section: Links */}
                <ul className="flex space-x-4 mt-4 md:mt-0">
                    <li className="hover:underline cursor-pointer"><Link to={'/user/about'}>About</Link></li>
                    <li className="hover:underline cursor-pointer"><Link to={'/user/contact'}>Contact</Link></li>
                    <li className="hover:underline cursor-pointer">Privacy Policy</li>
                    <li className="hover:underline cursor-pointer">Terms of Service</li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;

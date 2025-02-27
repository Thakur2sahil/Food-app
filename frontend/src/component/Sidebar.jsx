import React from 'react'
import img1 from '../admin/images/ubereats.png'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <div className="h-screen flex">
            {/* Sidebar container */}
            <div className=" bg-gray-800 text-white flex flex-col items-center py-6">
                {/* Logo or Image */}
                <div className="mb-10">
                    <img src={img1} alt="Logo" className="h-16 w-16 object-contain rounded-full" />
                </div>

                {/* Sidebar Navigation Links */}
                <nav className="space-y-6 w-full">
                    {/* <Link to="/admin/adminhome" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Home</h2>
                    </Link> */}

                    <Link to="/admin/newproduct" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Create New Product</h2>
                    </Link>

                    <Link to="/admin/ourproduct" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Our Products</h2>
                    </Link>

                    <Link to="/admin/updateproduct" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Update Product</h2>
                    </Link>

                    <Link to="/admin/orderrequest" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Order Request</h2>
                    </Link>
                    <Link to="/admin/userrequest" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>User Request</h2>
                    </Link>
                    <Link to="/admin/downloadpdf" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Download Pdf</h2>
                    </Link>

                    <Link to="/" className="block text-lg hover:bg-gray-700 px-4 py-2 transition duration-200">
                        <h2>Logout</h2>
                    </Link>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar

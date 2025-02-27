import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function DeleteProduct() {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(null);
    const [image, setImage] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const { productid } = location.state;

    const fetchProduct = async () => {
        try {
            const res = await axios.post('http://localhost:8004/selectproduct', { productid });
            if (res.data) {
                const product = res.data[0];
                setId(product.id);
                setName(product.name);
                setPrice(product.price);
                setDescription(product.description);
                setImage(product.photo);
                setCategory(product.category);
            } else {
                toast.error("No product found"); // Show error if no product is found
            }
        } catch (error) {
            console.error(error);
           
        }
    };

    const handleDelete = async () => {
        try {
            const res = await axios.post('http://localhost:8004/deleteproduct', { productid });
            if (res.data && res.data.success) { // Check for the new success property
                toast.success(`${name} has been removed`);
                setTimeout(() => {
                    navigate('/admin/updateproduct');
                  }, 2000);
            } else {
                toast.error("Unable to delete the product");
            }
        } catch (error) {
            console.error("Unable to connect:", error);
            toast.error("An error occurred while trying to delete the product");
        }
    };
    

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <div className='flex items-center justify-center p-5 m-5'>
            <div className='w-full max-w-6xl'>
                <h1 className='m-3 text-3xl font-bold text-center'>Product List</h1>
                <table className='min-w-full border border-gray-300 bg-gray-200'>
                    <thead className='bg-gray-800 text-white'>
                        <tr>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Id</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Name</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Price</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Description</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Category</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Photo</th>
                            <th className='px-4 py-2 border-b border-gray-300 text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>{id}</td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>{name}</td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>{price}</td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>{description}</td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>{category}</td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center center'><img className='w-24 h-24 object-cover mx-auto' src={`http://localhost:8004/${image}` } alt='none' /></td>
                            <td className='px-4 py-2 border-b border-gray-300 text-center'>
                                <button onClick={handleDelete} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default DeleteProduct;

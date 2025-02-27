import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function ProductUpdate() {
    const location = useLocation();
    const { productid } = location.state;
    const navigate = useNavigate()

    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [productId,setProductId]= useState(0);

    const fetchData = async () => {
        try {
            const res = await axios.post('http://localhost:8004/productupdate', { productid });
            if (res.data) {
                const product = res.data[0];
                setCategory(product.category);
                setImage(product.photo);
                setName(product.name);
                setPrice(product.price);
                setDiscount(product.discount);
                setDescription(product.description);
                setProductId(product.id)
            }
        } catch (error) {
            console.error(error);
            alert("Not able to connect");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    if (name) formData.append('name', name);
    if (price) formData.append('price', price);
    if (description) formData.append('description', description);
    if (discount) formData.append('discount', discount);
    if (category) formData.append('category', category);
    if (image) formData.append('image', image);
    
    formData.append('productid', productid);

    try {
        const res = await axios.post('http://localhost:8004/upproduct', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log(res.data);

        if (res.data && res.data.success) {
            toast.success(`Product ${name} is updated successfully!`);
            fetchData(); // Refresh product data after update

            // Delay navigation to allow the toast to be displayed
            setTimeout(() => {
                navigate('/admin/updateproduct');
            }, 2000); // Adjust delay as needed (2000 ms = 2 seconds)
        } else {
            toast.error('No data found or update failed');
        }
    } catch (error) {
        console.error("Not able to connect with the database", error);
        toast.error('An error occurred while updating the product.');
    }
};

    

    return (
        <div className="flex items-center justify-center mx-6 px-4 py-0">
            <div className="bg-white p-10 shadow-xl rounded-lg w-full max-w-md mt-0">
                <h1 className="text-3xl font-semibold text-center mb-4 text-gray-800">Update Product</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Product Name</label>
                        <input
                            type='text'
                            value={name}
                            placeholder='Enter your Product name'
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                        <input
                            type='number'
                            value={price}
                            placeholder='Enter your product price'
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Upload Product Image</label>
                        <input
                            type='file'
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                        <select
                            value={category}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value=''>Select a category</option>
                            <option value='appetizers'>Appetizers</option>
                            <option value='main course'>Main Course</option>
                            <option value='entress'>Entress</option>
                            <option value='desert'>Desert</option>
                            <option value='beverages'>Beverages</option>
                            <option value='kids'>Kid's menu</option>
                            <option value='healthy'>Healthy Option</option>
                            <option value='seasonal'>Seasonal Special</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1 text-gray-700">Discount</label>
                        <input
                            type='number'
                            value={discount}
                            placeholder='Enter the discount percentage'
                            onChange={(e) => setDiscount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <button
                            type='submit'
                            className="w-full bg-green-500 font-semibold py-3 rounded-md hover:opacity-90 transition duration-200"
                        >
                            Update the Product
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default ProductUpdate;

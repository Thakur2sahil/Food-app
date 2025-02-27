import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';


function StarRating({ rating }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(
                <span key={i} className='text-yellow-500'>
                  
                    <i className="fa fa-star"></i>
                </span>
            );
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            stars.push(
                <span key={i} className='text-yellow-500'>
                   <i className="fa fa-star-half-alt"></i>
                </span>
            );
        } else {
            stars.push(
                <span key={i} className='text-gray-300'>
                  <i className="far fa-star"></i>   
                </span>
            );
        }
    }
    return <div>{stars}</div>;
}


function Card({ setCartCount, searchTerm }) {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8004/card');
            if (res.data && res.data.length > 0) {
                setProducts(res.data);
            } else {
                alert('No data available');
            }
        } catch (error) {
            console.error({ error: 'Database error' });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = async (pid, name) => {
        try {
            const userId = localStorage.getItem('userid');
            if (!userId) {
                toast.error('User is not logged in');
                return;
            }

            await axios.post('http://localhost:8004/card1', {
                pid,
                quantity: 1,
                userId,
            });

            toast.success(`${name} added to the cart`);
            setCartCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <div className='min-w-full flex flex-wrap justify-between border px-2 py-4'>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div key={product.id} className='border px-2 py-4 mx-2 my-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 shadow-2xl'>
                        <div className='flex flex-col items-center h-full justify-between'>
                            <img
                                src={`http://localhost:8004/${product.photo}`}
                                alt={product.name}
                                className='w-full h-40 object-cover'
                            />
                            <h1 className='mt-2 text-lg font-semibold'>{product.name}</h1>
                            <p className='mt-1 text-gray-600 text-center'>{product.description}</p>
                            <StarRating rating={product.rating} />
                            <div className='flex w-full justify-between mt-4 mb-3 mx-2'>
                                <p className='mx-2'>₹{product.price}</p>
                                <p className='mx-2'>{product.category}</p>
                            </div>
                            <button
                                className='mt-auto bg-blue-500 text-white py-1 px-4 rounded'
                                onClick={() => handleAdd(product.id, product.name)}
                            >
                                Add to Cart 
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className='w-full text-center'>
                    <h1>No products found</h1>
                </div>
            )}
            <ToastContainer position='bottom-right' autoClose={1000} hideProgressBar={false} />
        </div>
    );
}

export default Card;

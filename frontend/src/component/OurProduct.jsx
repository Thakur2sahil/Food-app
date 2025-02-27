import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function OurProduct() {

    const [products , setProduct] = useState([])
    const navigate = useNavigate()
            
    const handleget = async () => {
        try {
            const res = await axios.get('http://localhost:8004/ourproduct');
            if (res.data && res.data.length > 0) {
                setProduct(res.data);
                console.log(res.data);
            } else {
                alert("No Data Found");
            }
        } catch (error) {
            console.error(error);
            alert("Can't connect to server");
        }
    };
    
    useEffect(() => {
        handleget();
    }, []);
    
    const handlerating = (pid) =>{

        navigate('/admin/productrating', {
            state: { pid  }
          });
    }
   
    return (
     <>

     <div className='flex items-center justify-center p-5 m-5'>
        <div className='w-full max-w-6xl'>
            <h1 className='m-3 text-3xl font-bold text-center'>Product List</h1>
            <table className='min-w-full border border-gray-300 bg-gray-200'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>Id</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Name</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Price</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-3/12'>Description</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Category</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Photo</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Rating</th>
                    </tr>
                </thead>
    
                <tbody className='bg-gray-100'>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.id}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.name}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>&#8377;{product.price}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center' >{product.description}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.category}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>
                                    <img src={`http://localhost:8004/${product.photo}`} alt={product.name} className='w-24 h-24 object-cover mx-auto' />
                                </td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>
                                    <button onClick={()=>handlerating(product.id)}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                         Rating
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className='text-center py-4'>No products available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
     </>
    
    )
}

export default OurProduct

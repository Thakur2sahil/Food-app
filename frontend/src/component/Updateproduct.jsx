import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



function Updateproduct() {
    const [products , setProduct] = useState([])
    const [productid,setProductId] = useState(0)
    const navigate = useNavigate()
            
    const handleget = async () => {
        try {
            const res = await axios.get('http://localhost:8004/updateproduct');
            if (res.data && res.data.length > 0) {
                setProduct(res.data);
                console.log(res.data);
            } else {
                alert("No Data Found");
            }
        } catch (error) {
            console.error(error);
           
        }
    };
      

    const handleupdate = (productid) =>{
        navigate('/admin/productupdate', {
            state: { productid }
        });
    }

    const handledelete = (productid) => {
        navigate('/admin/deleteproduct', {
            state: { productid }
        });
    };
    
    useEffect(() => {
        handleget();
    }, []);
    return (
        <div className=' flex items-center justify-center p-5 m-5'>
        <div className='w-full max-w-6xl'>
            <h1 className=' text-3xl font-bold text-center'>Product List</h1>
            <table className='min-w-full border border-gray-300 bg-gray-200'>
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-1/12'>Id</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Name</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Price</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-3/12'>Description</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Category</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Photo</th>
                        <th className='px-4 py-2 border-b border-gray-300 text-center w-2/12'>Action</th>
                    </tr>
                </thead>
    
                <tbody className='bg-gray-100'>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <tr key={product.id}  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.id}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.name}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>&#8377;{product.price}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center' >{product.description}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>{product.category}</td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center'>
                                    <img src={`http://localhost:8004/${product.photo}`} alt={product.name} className='w-24 h-24 object-cover mx-auto' />
                                </td>
                                <td className='px-4 py-2 border-b border-gray-300 text-center space-x-2 '>
                                    <div className='flex '>
                                       <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex-1 mx-2'
                                       onClick={()=>handleupdate(product.id)} >Update</button>
                                       <button 
                                         onClick={() => handledelete(product.id)}  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 mx-2'>Delete</button>
                                    </div>
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
    )
}

export default Updateproduct



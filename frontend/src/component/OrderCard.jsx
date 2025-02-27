import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const OrderCard = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const userId = localStorage.getItem('userid');
   const { totalAmount } = location.state; // Default to 0 if not provided

  const fetchdata = async () => {
    try {
      const res = await axios.post('http://localhost:8004/ordercard', { userId });

      if (res.data && res.data.length > 0) {
        console.log(res.data);
        groupOrdersByOrderId(res.data); // Group products by order_id
      } else {
        console.log("No data found");
      }
    } catch (error) {
      console.error("Not able to connect with Database");
    }
  };

  const groupOrdersByOrderId = (data) => {
    const groupedOrders = data.reduce((acc, product) => {
      if (!acc[product.order_id]) {
        acc[product.order_id] = { order_id: product.order_id, products: [] };
      }
      acc[product.order_id].products.push(product);
      return acc;
    }, {});

    setOrders(Object.values(groupedOrders));
  };

  const del = async (orderId) => {
    try {
      const res = await axios.post('http://localhost:8004/orderdel', { orderId, userId });
      console.log(res.data);
      // Optimistically remove the order from the state
      setOrders(orders.filter(order => order.order_id !== orderId));
      toast.success(`Order ID ${orderId} deleted successfully.`);
    } catch (error) {
      toast.error("Failed to delete order.");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="max-w-full mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={1000} closeOnClick />
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.order_id} className="mb-6 p-4 border border-gray-300 rounded-lg">
            <h2 className="text-center mb-4 font-bold text-2xl ">Order ID: {order.order_id}</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-4">Product</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Price</th>
                  <th className="py-2 px-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product) => (
                  <tr key={product.product_id} className="border-b">
                    <td className="py-2 px-4">
                      <img
                        src={`http://localhost:8004/${product.photo}`}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">₹{product.price}</td>
                    <td className="py-2 px-4">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-6">
              <span className="font-bold text-lg">Total Amount: ₹{totalAmount}</span>
              <button onClick={() => del(order.order_id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                Delete Order
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className='w-full text-center h-full'>
          <h1>No orders found</h1>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

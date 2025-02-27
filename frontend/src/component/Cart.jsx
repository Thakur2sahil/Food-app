import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS file for styling

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [selectedState, setSelectedState] = useState('Uttar Pradesh');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
        const res = await axios.get('http://localhost:8004/cart');
        if (res.data && res.data.length > 0) {
            // Filter out products with zero quantity
            const nonZeroQuantityItems = res.data.filter(item => item.quantity > 0);
            
            setCartItems(nonZeroQuantityItems);
            calculateTotals(nonZeroQuantityItems);
        } else {
            // If no data, set cartItems to an empty array
            setCartItems([]);
            setTotalBeforeDiscount(0);
            setTotalAfterDiscount(0);
            // toast.warning("No Data Found");
        }
    } catch (error) {
        console.error({ error: "Not connected to database" });
        // toast.error("Failed to fetch cart data!");
    }
};

  const add = async (productId) => {
    console.log(productId);
    try {
      const userId = localStorage.getItem('userid');
      await axios.post('http://localhost:8004/cart/increment', { userId, productId });
      // toast.success("Item quantity increased");
      fetchCart();
    } catch (error) {
      console.error(error);
      // toast.error("Failed to increase quantity");
    }
  };

  const sub = async (productId, quant, productName) => {
    const userId = localStorage.getItem('userid');
   
      try {
       
        await axios.post('http://localhost:8004/cart/decrement', { userId, productId });
        // toast.success("Item quantity decreased");
        fetchCart();
      } catch (error) {
        console.error(error);
        // toast.error("Failed to decrease quantity");
      }
    
  };

  const calculateGST = () => {
    if (selectedState === 'Uttar Pradesh') {
      return (totalAfterDiscount * 0.12); // 12% SGST
    } else {
      return (totalAfterDiscount * 0.18); // 18% CGST
    }
  };


  const totalAmount = parseFloat((Number(totalAfterDiscount) + Number(calculateGST())).toFixed(2));


  

  const calculateTotals = (items) => {
    let totalBefore = 0;
    let totalAfter = 0;

    items.forEach(product => {
      const price = product.price;
      const discount = parseInt(product.discount);
      const discountedPrice = price - (price * discount / 100);

      totalBefore += product.quantity * price;
      totalAfter += product.quantity * discountedPrice;
    });

    setTotalBeforeDiscount(totalBefore);
    setTotalAfterDiscount(totalAfter);
  };


  

  const placeOrder = () => {
    navigate('/user/placeorder', {
      state: { totalAmount  }
    });
  };
  const redirecttotreackorder =() =>{
    navigate('/user/ordercard' ,{
      state: { totalAmount  }
    })
  }


  const redirecttopurchasehistory =() =>{
    navigate('/user/purchasehistory')
  }


  return (
    <>
    <ToastContainer />
    <div className="container mx-auto p-6">
      
      {cartItems.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <div>
              <button onClick={redirecttotreackorder} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
                Track Product
              </button>
              <button onClick={redirecttopurchasehistory} className="bg-green-500 text-white px-4 py-2 rounded">
                Purchase History
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="px-4 py-2 text-md font-medium text-gray-700 border">Product</th>
                  <th className="px-4 py-2 text-md font-medium text-gray-700 border">Price</th>
                  <th className="px-4 py-2 text-md font-medium text-gray-700 border">Discount</th>
                  <th className="px-4 py-2 text-md font-medium text-gray-700 border">Quantity</th>
                  <th className="px-4 py-2 text-md font-medium text-gray-700 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems
                  .sort((a, b) => a.id - b.id) // Sort by product id in ascending order
                  .map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 border">
                        <img src={`http://localhost:8004/${product.photo}`} alt={product.name} className="w-20 h-20 object-cover rounded-lg mx-auto" />
                      </td>
                      <td className="px-4 py-2 border text-center">&#8377;{parseFloat(product.price).toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-2 border text-center">{parseFloat(product.discount)}%</td>
                      <td className="px-4 py-2 border text-center">
                        <button onClick={() => sub(product.id, product.quantity, product.name)} className="w-4 mx-3 px-2 items-center">-</button>
                        {product.quantity}
                        <button onClick={() => add(product.id)} className="w-4 mx-3 px-2 items-center">+</button>
                      </td>
                      <td className="px-4 py-2 border text-center">
                        &#8377;{(product.quantity * (product.price - (product.price * product.discount / 100))).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-6 p-4 border-t">
            <div className="w-1/3">
              <label htmlFor="state" className="block font-medium mb-2">Select State:</label>
              <select
                id="state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value='Uttar Pradesh'>Uttar Pradesh</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-2">Total Before Discount: &#8377;{totalBeforeDiscount.toFixed(2)}</h2>
              <h2 className="text-xl font-bold mb-2">Food Cost After Discount: &#8377;{totalAfterDiscount.toFixed(2)}</h2>
              <h2 className="text-xl font-bold mb-4">GST: &#8377;{calculateGST().toFixed(2)}</h2>
              <h2 className="text-2xl font-bold text-red-600">Total Payable Amount: &#8377;{totalAmount.toFixed(2)}</h2>
            </div>
          </div>
          <div className="text-right mt-4">
            <button onClick={placeOrder} className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition">
              Place Order
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-xl font-medium">
          
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <div>
              <button onClick={redirecttotreackorder} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
                Track Product
              </button>
              <button onClick={redirecttopurchasehistory} className="bg-green-500 text-white px-4 py-2 rounded">
                Purchase History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  
  );
}

export default Cart;

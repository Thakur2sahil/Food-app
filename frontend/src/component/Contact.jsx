import React, { useState } from 'react';
import img from '../admin/images/ub.jfif';
import img1 from '../admin/images/ubereats.png';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [favoriteFood, setFavoriteFood] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post('http://localhost:8004/customer_contacts', {
                name,
                email,
                favorite_food: favoriteFood,
                message,
            });

            if (response.status === 200) {
                toast.success('Your message has been sent successfully!');
                // Clear the form fields after submission
                setName('');
                setEmail('');
                setFavoriteFood('');
                setMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('There was an error sending your message. Please try again later.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-full bg-gray-100 px-4 my-2">
            <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg max-w-4xl w-11/12">
                <div className="p-6 flex-[0.6]">
                    <div className="flex items-center mb-4">
                        <img src={img1} alt="ubereats logo" className="w-10 h-10 mr-2" />
                        <h1 className="font-bold text-lg">UberEats</h1>
                    </div>
                    <h2 className="text-xl font-semibold">Restaurant Partner App</h2>
                    <p className="text-gray-600 mt-2">
                        We are a one-stop solution for managing orders, menus, trading business growth, and creating promos and discounts for restaurants.
                    </p>
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold mb-4">Welcome to Our Restaurant</h3>
                        <p className="text-gray-600">
                            We are committed to providing you with the best dining experience. Whether you're here for a quick bite or a full meal, we have something for everyone. Enjoy our delicious food and excellent service.
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <img
                        src={img}
                        alt="Restaurant Food"
                        className="rounded-tr-lg rounded-br-lg w-full h-auto object-cover mt-4"
                    />
                </div>
            </div>

            <div className="ml-0 md:ml-8 mt-10 md:mt-0 bg-white p-6 shadow-md rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Favorite Food</label>
                        <input
                            type="text"
                            value={favoriteFood}
                            onChange={(e) => setFavoriteFood(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                            rows="3"
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Submit
                    </button>
                </form>
            </div>
            <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default Contact;

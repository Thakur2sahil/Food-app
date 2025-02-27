import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function UserRequest() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8004/users/not-approved');
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        useEffect(() => {
        fetchUsers();
    }, []);

    const handleAccept = async (userId) => {
        try {
            const res = await axios.post('http://localhost:8004/acceptuser', { userId });
            console.log(res);
            toast.success("User approved successfully");
            fetchUsers(); // Refresh the list of users
        } catch (error) {
            console.error("Error during approval:", error);
            toast.error("Failed to approve user");
        }
    };

    const handleCancel = async (userId) => {
        try {
            const res = await axios.post('http://localhost:8004/canceluser', { userId }); // Fixed endpoint
            console.log(res);
            toast.success("User canceled successfully");
            fetchUsers(); // Refresh the list of users
        } catch (error) {
            console.error("Error during cancellation:", error.response ? error.response.data : error.message);
            toast.error("Failed to cancel user");
        }
    };

 

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="max-w-full mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Users Not Approved</h1>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Username</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td className="py-2 px-4 border-b text-center">{user.username}</td>
                                <td className="py-2 px-4 border-b text-center">{user.email}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="flex space-x-4 justify-center "> {/* Use flexbox for alignment */}
                                        <button 
                                            onClick={() => handleAccept(user.id)}
                                            className="bg-green-500 text-white py-1 px-3 rounded"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleCancel(user.id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-2 px-4 text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default UserRequest;

import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


function UpdateUserProfile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate()

    const userId = localStorage.getItem('userid');

    // Fetch profile data from the server
    const fetchData = async () => {
        const userId = localStorage.getItem('userid');
        try {
            const res = await axios.post('http://localhost:8004/profile', { userId });
            if (res.data && res.data.length > 0) {
                const profile = res.data[0];
                setUsername(profile.username);
                setEmail(profile.email);
                
            } else {
                console.log("No data available");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(`Error: ${error.response?.data?.message || "Unable to connect to the database"}`);
        }
    };

    const resetForm = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the file input
        }
    };

    // Handle form submission for updating profile
    const handleSubmit = async (e) => {
        e.preventDefault();

   
        if (!userId) {
            return toast.error('User ID is missing');
        }

        const formData = new FormData();
        formData.append('userid', userId);
        if (username) formData.append('username', username);
        if (email) formData.append('email', email);
        if (file) formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:8004/updateprofile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 200) {
               
                resetForm();
                const { username, image } = res.data.user;
                localStorage.setItem('name', username);
                localStorage.setItem('photo', image);
                fetchData(); // Refresh data after update
                toast.success(`${username} your profile is update succesfully`)
                // navigate('/user/userhome')
                setTimeout(()=>{
                    navigate('/user/userhome' )},2000)
            } else {
                toast.error("Unexpected response status!");
            }
        } catch (error) {
            console.error("Error during profile update:", error);
            toast.error(error.response?.data?.error || "Unable to update profile");
        }
    };

    // Handle password reset
    const handleResetPassword = async () => {
        navigate('/user/reset',{
            state: userId
        })
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-10">
            <h1 className="text-3xl font-bold text-center mb-6">Update Profile</h1>
            <form className="bg-white p-6 rounded-lg shadow-lg space-y-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        ref={fileInputRef}
                        className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="text-center space-x-8">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Update
                    </button>
                    <button
                    onClick={handleResetPassword}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Reset Password
                </button>
                </div>
               
            </form>
            <div className="text-center mt-4">
               
            </div>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default UpdateUserProfile;

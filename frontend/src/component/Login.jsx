import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

export default function Login() {
  const navigate = useNavigate();

  localStorage.clear();

  const [value, setValue] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!/\S+@\S+\.\S+/.test(value.email)) {
      formErrors.email = "Please enter a valid email address";
    }
    if (value.password.length < 3) {
      formErrors.password = "Password must be at least 6 characters long";
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:8004/api/auth/login', value);
      if (res.data && res.data.message === 'Successful Login') {
        const { role, username: name, image: photo, id, token } = res.data.user;
        console.log(res.data);
        
        localStorage.setItem('role', role);
        localStorage.setItem('name', name);
        localStorage.setItem('photo', photo);
        localStorage.setItem('userid', id);
        localStorage.setItem('token', token); // Store JWT token
    
        toast.success("Login successful!", { autoClose: 2000 });
    
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin/newproduct' : '/user/userhome');
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error); // Display the error message
    } else {
        toast.error('An error occurred. Please try again.');
    }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-80 text-center">
        <h1 className="text-3xl mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            onChange={handleChange}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <button
            type='submit'
            className="w-full p-2 mb-4 bg-gradient-to-r from-blue-600 to-pink-600 text-white text-lg rounded-md cursor-pointer"
          >
            Submit
          </button>
        </form>
        <div>
          <p>Don't have an account? <Link to={'/signup'} className="text-blue-600">Sign up</Link></p>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}


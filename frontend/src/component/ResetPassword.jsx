import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP has been sent
  const navigate = useNavigate();

  const userId = localStorage.getItem('userid')

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newPassword || !confirmPassword || !otp) {
      toast.error('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      await toast.promise(
        axios.post('http://localhost:8004/reset-password', { otp, newPassword }),
        {
          pending: 'Processing...',
          success: {
            render() {
              setTimeout(() => navigate('/'), 2000);
              return 'Password reset successfully!';
            },
          },
          error: 'Failed to reset password. Please try again.',
        }
      );
    } catch (error) {
      console.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:8004/otp', { userId });
      toast.success(res.data.message);
      setOtpSent(true); // Mark OTP as sent
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white mt-8 p-8 rounded shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
          {!otpSent ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-2 w-full border rounded"
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors mb-4"
              >
                Send OTP
              </button>
            </>
          ) : (
            <form onSubmit={handleResetPasswordSubmit}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4 p-2 w-full border rounded"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 p-2 w-full border rounded"
                required
              />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4 p-2 w-full border rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ResetPassword;

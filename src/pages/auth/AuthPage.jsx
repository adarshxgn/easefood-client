import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInApi, signUpApi, verifyOtpApi, sendOtpApi } from "../../services/allApi";

function AuthPage({ register }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [sellerCategory, setSellerCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // OTP verification states
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpExpiry, setOtpExpiry] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loginData, setLoginData] = useState(null);

    useEffect(() => {
        return () => {
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setUsername("");
            setSellerCategory("");
            setShowOtpVerification(false);
            setOtp("");
        };
    }, [register]);

    // Timer for OTP expiration
    useEffect(() => {
        let interval;
        if (otpExpiry) {
            interval = setInterval(() => {
                const now = new Date().getTime();
                const distance = otpExpiry - now;
                
                if (distance <= 0) {
                    clearInterval(interval);
                    setTimeRemaining(0);
                    toast.error("OTP has expired. Please request a new one.");
                } else {
                    setTimeRemaining(Math.floor(distance / 1000));
                }
            }, 1000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [otpExpiry]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (register) {
            // Registration process without OTP
            if (!username || !email || !password || !confirmPassword || !sellerCategory) {
                toast.error("All fields are required.");
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Passwords do not match.");
                setLoading(false);
                return;
            }
            
            const registrationPayload = { 
                username, 
                email, 
                password1: password, 
                password2: confirmPassword, 
                seller_category: sellerCategory 
            };
            
            try {
                const response = await signUpApi(registrationPayload);
                
                if (response.status === 200 || response.status === 201) {
                    toast.success("Signup successful! Please login.");
                    navigate("/"); // Redirect to login after signup
                    
                    // Clear form fields
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setUsername("");
                    setSellerCategory("");
                } else {
                    toast.error(response.data?.message || "Registration failed. Please try again.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Network error: Please try again.");
            } finally {
                setLoading(false);
            }
            
        } else {
            // Login now requires OTP verification
            if (!email || !password) {
                toast.error("Email and password are required.");
                setLoading(false);
                return;
            }

            // Store login data for later use
            const loginPayload = { username: email, password };
            setLoginData(loginPayload);
            
            try {
                // Request OTP before completing login
                const sendOtpPayload = { email };
                const reqHeader = { "Content-Type": "application/json" };
                
                const response = await sendOtpApi(sendOtpPayload, reqHeader);
                
                if (response.status === 200 || response.status === 201) {
                    setShowOtpVerification(true);
                    
                    // Set OTP expiry (5 minutes from now)
                    const expiryTime = new Date();
                    expiryTime.setMinutes(expiryTime.getMinutes() + 5);
                    setOtpExpiry(expiryTime.getTime());
                    setTimeRemaining(300); // 5 minutes in seconds
                    
                    toast.success("OTP sent to your email address.");
                } else {
                    toast.error(response.data?.message || "Failed to send OTP.");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Network error: Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!otp) {
            toast.error("Please enter the OTP sent to your email.");
            setLoading(false);
            return;
        }
        
        try {
            const reqHeader = { "Content-Type": "application/json" };
            
            // First verify the OTP
            const verifyOtpPayload = { 
                email: loginData.username,
                otp 
            };
            
            const verifyResponse = await verifyOtpApi(verifyOtpPayload, reqHeader);
            
            if (verifyResponse.status === 200 || verifyResponse.status === 201) {
                // OTP verified, now complete the login
                const loginResponse = await signInApi(loginData);
                
                if (loginResponse.status === 200) {
                    const { access_token, refresh_token, user, owner, pin, seller_category } = loginResponse.data;

                    // Store tokens and user info in localStorage
                    localStorage.setItem("accessToken", access_token);
                    localStorage.setItem("refreshToken", refresh_token);
                    localStorage.setItem("user", JSON.stringify(user));
                    localStorage.setItem("owner", owner);
                    localStorage.setItem("pin",pin)
                    localStorage.setItem("seller_category",seller_category)
                    
                    console.log(loginResponse.data);
                    

                    toast.success("Login successful!");
                    navigate("/dashboard"); // Redirect to dashboard after login
                    
                    // Clear form fields
                    setEmail("");
                    setPassword("");
                    setOtp("");
                    setShowOtpVerification(false);
                } else {
                    toast.error(loginResponse.data?.message || "Login failed. Please try again.");
                }
            } else {
                toast.error(verifyResponse.data?.message || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Network error: Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleResendOtp = async () => {
        setLoading(true);
        
        try {
            const sendOtpPayload = { email: loginData.username };
            const reqHeader = { "Content-Type": "application/json" };
            
            const response = await sendOtpApi(sendOtpPayload, reqHeader);
            
            if (response.status === 200 || response.status === 201) {
                // Reset OTP expiry (5 minutes from now)
                const expiryTime = new Date();
                expiryTime.setMinutes(expiryTime.getMinutes() + 5);
                setOtpExpiry(expiryTime.getTime());
                setTimeRemaining(300); // 5 minutes in seconds
                
                toast.success("New OTP sent to your email address.");
            } else {
                toast.error(response.data?.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Network error: Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Format remaining time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex min-h-screen w-full">
            <div
                className="hidden lg:flex items-center justify-center w-1/2 px-12 relative"
                style={{
                    backgroundImage: `url('https://images.pexels.com/photos/2403391/pexels-photo-2403391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>

                <div className="relative max-w-md space-y-6 text-center text-white z-10">
                    <h1 
                        className="text-4xl font-extrabold tracking-tight" 
                        style={{ textShadow: '2px 2px 4px black' }}
                    >
                        Welcome to <span className="text-orange-600">FoodEase</span>
                    </h1>
                    <p className="text-xl">
                        Join FoodEase to seamlessly manage your menu, orders, and categories all in one place.
                    </p>
                </div>
            </div>

            <div className="flex flex-1 items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-md space-y-2 md:space-y-6">
                    <div className="text-center">
                        <h1 className="text-xl md:text-4xl font-bold tracking-tight text-black">
                            {register ? "Create a New Account" : 
                             (showOtpVerification ? "Verify Your Email" : "Login to Your Account")}
                        </h1>
                    </div>

                    {/* Show OTP verification form for login */}
                    {!register && showOtpVerification ? (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-black">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="block w-full mt-1 rounded-md border px-3 py-2"
                                    placeholder="Enter the 6-digit OTP sent to your email"
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <div className="text-sm text-center">
                                <p>OTP expires in: <span className="font-medium">{formatTime(timeRemaining)}</span></p>
                            </div>
                            <button
                                type="submit"
                                className={`w-full rounded-md py-2 h-12 text-sm font-medium ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-blue-600"} text-white`}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className={`text-blue-500 text-sm ${timeRemaining > 0 && timeRemaining < 240 ? "" : "opacity-50 cursor-not-allowed"}`}
                                    disabled={timeRemaining > 240 || loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowOtpVerification(false);
                                        setOtp("");
                                    }}
                                    className="text-gray-500 text-sm"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Regular login/signup form
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {register && (
                                <>
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-black">
                                            Restaurant Name
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full mt-1 rounded-md border px-3 py-2"
                                            placeholder="Enter your restaurant name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-black">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            value={sellerCategory}
                                            onChange={(e) => setSellerCategory(e.target.value)}
                                            className="block w-full mt-1 rounded-md border px-3 py-2"
                                            required
                                        >
                                            <option value="" disabled>Select a category</option>
                                            <option value="Hotel">Hotel</option>
                                            <option value="Hospital Canteen">Hospital Canteen</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-black">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full mt-1 rounded-md border px-3 py-2"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-black">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full mt-1 rounded-md border px-3 py-2"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            {register && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full mt-1 rounded-md border px-3 py-2"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            )}
                            <button
                                type="submit"
                                className={`w-full rounded-md py-2 h-12 text-sm font-medium ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-blue-600"} text-white`}
                                disabled={loading}
                            >
                                {loading ? "Please wait..." : register ? "Sign Up" : "Continue"}
                            </button>
                        </form>
                    )}

                    {/* Only show the login/signup switch link when not in OTP verification mode */}
                    {!showOtpVerification && (
                        <p className="mt-2 text-gray-600">
                            {register ? (
                                <>
                                    Already have an account? <Link to="/" className="text-blue-500">Login</Link>
                                </>
                            ) : (
                                <>
                                    Don't have an account? <Link to="/register" className="text-blue-500">Sign Up</Link>
                                </>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOTP, resendOTP } from "../slices/authSlice";
import PasskeyAuth from "./PasskeyAuth";
import { useNavigate, Link } from "react-router-dom";
import ModernLogoIcon from "../components/ModernLogoIcon";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  
  const [step, setStep] = useState("register"); // register, otp, passkey
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    phoneNumber: ""
  });
  const [otp, setOtp] = useState("");
  const [registeredUsername, setRegisteredUsername] = useState("");
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    if (form.password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      setRegisteredUsername(form.username);
      setStep("otp");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOTP({ username: registeredUsername, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      setStep("passkey");
      setShowPasskeyModal(true);
    }
  };

  const handleResendOTP = async () => {
    await dispatch(resendOTP({ username: registeredUsername }));
  };

  const handlePasskeySuccess = () => {
    setShowPasskeyModal(false);
    navigate("/login");
  };

  const handleSkipPasskey = () => {
    setShowPasskeyModal(false);
    navigate("/login");
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <ModernLogoIcon className="w-16 h-16 mb-3 drop-shadow-lg" color="#2563eb" />
            <h2 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-tight">Verify Your Email</h2>
            <p className="text-blue-600 text-base text-center">We've sent a verification code to your email address</p>
          </div>
          <form className="space-y-6" onSubmit={handleOTPSubmit} autoComplete="off">
            <div>
              <label className="block text-blue-800 font-semibold mb-1">Verification Code</label>
              <input
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-center text-2xl tracking-widest bg-blue-50"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
              />
            </div>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg text-lg disabled:opacity-50"
              type="submit"
              disabled={status === "loading" || otp.length !== 6}
            >
              {status === "loading" ? "Verifying..." : "Verify Email"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={handleResendOTP}
              className="text-blue-700 hover:underline text-base font-medium transition"
              disabled={status === "loading"}
            >
              Didn't receive the code? Resend
            </button>
          </div>
          {error && (
            <div className="text-center text-red-600 font-semibold mt-6 animate-fade-in">{error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <ModernLogoIcon className="w-16 h-16 mb-3 drop-shadow-lg" color="#2563eb" />
          <h2 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-tight">Create Account</h2>
          <p className="text-blue-600 text-base">Sign up to get started scheduling your posts</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label className="block text-blue-800 font-semibold mb-1">Username</label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-blue-800 font-semibold mb-1">Email</label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-blue-800 font-semibold mb-1">Phone Number</label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
              type="tel"
              name="phoneNumber"
              placeholder="+91 Enter your phone number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </div>
          <div>
            <label className="block text-blue-800 font-semibold mb-1">Password</label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
              type="password"
              name="password"
              placeholder="Enter your password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-blue-800 font-semibold mb-1">Confirm Password</label>
            <input
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg text-lg disabled:opacity-50"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        {error && (
          <div className="text-center text-red-600 font-semibold mt-6 animate-fade-in">{error}</div>
        )}
        <div className="mt-10 flex flex-col items-center space-y-2 w-full">
          <Link to="/login" className="text-blue-700 hover:underline text-base font-medium transition">Already have an account? Login</Link>
        </div>
      </div>
      {showPasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
              onClick={handleSkipPasskey}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Register a Passkey</h3>
            <p className="text-base text-blue-700 mb-4">Use your device's PIN, biometrics, or a security key for secure, passwordless login.</p>
            <PasskeyAuth
              username={registeredUsername}
              mode="register"
              onSuccess={handlePasskeySuccess}
              onBack={handleSkipPasskey}
            />
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
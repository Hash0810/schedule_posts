import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP } from "../slices/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import PasskeyAuth from "./PasskeyAuth";
import LogoIcon from "../components/LogoIcon";

export default function OTPVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { status, error } = useSelector((state) => state.auth);
  
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Get username from URL params or localStorage
    const urlUsername = searchParams.get("username");
    const storedUsername = localStorage.getItem("pendingVerificationUsername");
    
    if (urlUsername) {
      setUsername(urlUsername);
      localStorage.setItem("pendingVerificationUsername", urlUsername);
    } else if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // No username found, redirect to register
      navigate("/register");
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    // Resend countdown timer
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(verifyOTP({ username, otp }));
    if (verifyOTP.fulfilled.match(result)) {
      setShowPasskeyModal(true);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setResendCountdown(60); // 60 seconds cooldown
    
    await dispatch(resendOTP({ username }));
  };

  const handlePasskeySuccess = () => {
    setShowPasskeyModal(false);
    localStorage.removeItem("pendingVerificationUsername");
    navigate("/login");
  };

  const handleSkipPasskey = () => {
    setShowPasskeyModal(false);
    localStorage.removeItem("pendingVerificationUsername");
    navigate("/login");
  };

  const handleBackToRegister = () => {
    localStorage.removeItem("pendingVerificationUsername");
    navigate("/register");
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <LogoIcon className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-800 mb-1">
            Verify Your Email
          </h2>
          <p className="text-blue-500 text-sm text-center">
            We've sent a verification code to your email address
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Username: <span className="font-semibold">{username}</span>
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleOTPSubmit}>
          <div>
            <label className="block text-blue-700 font-semibold mb-2">
              Verification Code
            </label>
            <input
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-center text-2xl tracking-widest font-mono"
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 shadow-md"
            type="submit"
            disabled={status === "loading" || otp.length !== 6}
          >
            {status === "loading" ? "Verifying..." : "Verify Email"}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-4">
          <button
            onClick={handleResendOTP}
            className="text-blue-600 hover:underline text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={resendDisabled || status === "loading"}
          >
            {resendDisabled 
              ? `Resend in ${resendCountdown}s` 
              : "Didn't receive the code? Resend"
            }
          </button>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleBackToRegister}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              ← Back to Registration
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}
      </div>
      
      {showPasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-xl"
              onClick={handleSkipPasskey}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              Register a Passkey
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Use your device's PIN, biometrics, or a security key for secure, passwordless login.
            </p>
            <PasskeyAuth
              username={username}
              mode="register"
              onSuccess={handlePasskeySuccess}
              onBack={handleSkipPasskey}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
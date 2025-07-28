import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, passkeyLogin } from "../slices/authSlice";
import PasskeyAuth from "./PasskeyAuth";
import { useNavigate, Link } from "react-router-dom";
import ModernLogoIcon from "../components/ModernLogoIcon";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [loginMode, setLoginMode] = useState("password"); // "password" or "passkey"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      setSuccess(true);
      navigate("/dashboard");
    }
  };

  const handlePasskeyLogin = async () => {
    if (!form.username) {
      alert("Please enter your username first");
      return;
    }
    
    const result = await dispatch(passkeyLogin({ username: form.username }));
    if (passkeyLogin.fulfilled.match(result)) {
      setShowPasskeyModal(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <ModernLogoIcon className="w-16 h-16 mb-3 drop-shadow-lg" color="#2563eb" />
          <h2 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-tight">Welcome Back</h2>
          <p className="text-blue-600 text-base">Sign in to your account to continue</p>
        </div>

        {/* Login Mode Toggle */}
        <div className="flex mb-8 bg-blue-50 rounded-xl p-1 shadow-inner">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              loginMode === "password"
                ? "bg-white text-blue-700 shadow"
                : "text-blue-500 hover:text-blue-700"
            }`}
            onClick={() => setLoginMode("password")}
            type="button"
            aria-selected={loginMode === "password"}
          >
            Password
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              loginMode === "passkey"
                ? "bg-white text-blue-700 shadow"
                : "text-blue-500 hover:text-blue-700"
            }`}
            onClick={() => setLoginMode("passkey")}
            type="button"
            aria-selected={loginMode === "passkey"}
          >
            Passkey
          </button>
        </div>

        {loginMode === "password" ? (
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
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
              <label className="block text-blue-800 font-semibold mb-1">Password</label>
              <input
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-base"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg text-lg disabled:opacity-50"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging in..." : "Login with Password"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
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
            <button
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2.5 rounded-xl font-bold hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg text-lg disabled:opacity-50"
              onClick={handlePasskeyLogin}
              disabled={status === "loading" || !form.username}
            >
              {status === "loading" ? "Checking..." : "Login with Passkey"}
            </button>
            <p className="text-xs text-blue-500 text-center mt-2">
              Use your device's PIN, biometrics, or security key for secure, passwordless login
            </p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold mt-6 animate-fade-in">{error}</div>
        )}

        <div className="mt-10 flex flex-col items-center space-y-2 w-full">
          <Link to="/register" className="text-blue-700 hover:underline text-base font-medium transition">Don't have an account? Register</Link>
          <Link to="/forgot-password" className="text-blue-400 hover:underline text-xs">Forgot password?</Link>
        </div>

        {showPasskeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-2xl"
                onClick={() => setShowPasskeyModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Login with Passkey</h3>
              <p className="text-base text-blue-700 mb-4">Use your device's PIN, biometrics, or a security key for secure, passwordless login.</p>
              <PasskeyAuth
                username={form.username}
                mode="login"
                onSuccess={() => navigate("/dashboard")}
                onBack={() => setShowPasskeyModal(false)}
              />
            </div>
          </div>
        )}
        <style>{`
          .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        `}</style>
      </div>
    </div>
  );
}

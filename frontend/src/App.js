import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./slices/authSlice";
import './App.css';
import LogoIcon from "./components/LogoIcon";
import LogoTest from "./components/LogoTest";
import Register from "./features/Register";
import Login from "./features/Login";
import OTPVerification from "./features/OTPVerification";
import Dashboard from "./features/Dashboard";
import PostScheduler from "./features/PostScheduler";
import NotificationPreferences from "./features/social/NotificationPreferences";
import AnalyticsDashboard from "./features/AnalyticsDashboard";
import TwitterAutoPost from "./features/social/TwitterAutoPost";
import FacebookAutoPost from "./features/social/FacebookAutoPost";
import LinkedInAutoPost from "./features/social/LinkedInAutoPost";
import ApiKeyManager from "./features/apikey/ApiKeyManager";
import InstagramAutoPost from "./features/social/InstagramAutoPost";
import YouTubeAutoPost from "./features/social/YouTubeAutoPost";
import PinterestAutoPost from "./features/social/PinterestAutoPost";
import TumblrAutoPost from "./features/social/TumblrAutoPost";
import RedditAutoPost from "./features/social/RedditAutoPost";
import TikTokAutoPost from "./features/social/TikTokAutoPost";
import AppCredentialManager from "./features/apikey/AppCredentialManager";
import Home from "./features/Home";

function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const topNavLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/schedule", label: "Schedule Post" },
    { to: "/apikeys", label: "API Keys" },
    { to: "/manage-app-credentials", label: "App Credentials" },
    { to: "/notifications", label: "Notifications" },
    { to: "/analytics", label: "Analytics" },
  ];
  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur shadow flex flex-col md:flex-row md:items-center md:justify-between px-6 py-3 border-b border-blue-100">
      <div className="flex items-center space-x-2 mb-2 md:mb-0">
        <LogoIcon key="navbar-logo" className="h-8 w-8" />
        <Link to="/" className="font-bold text-xl text-blue-800 tracking-tight">Post Scheduler</Link>
      </div>
      <div className="w-full overflow-x-auto md:w-auto flex flex-wrap gap-1 md:gap-2 justify-center md:justify-start pb-2 md:pb-0">
        {topNavLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 whitespace-nowrap ${location.pathname.startsWith(link.to) ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex space-x-2 mt-2 md:mt-0 items-center">
        {!user ? (
          <>
            <Link to="/register" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${location.pathname === '/register' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Register</Link>
            <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${location.pathname === '/login' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}>Login</Link>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                {user.username ? user.username[0] : '?'}
              </div>
              <span className="text-blue-800 font-semibold">{user.username}</span>
              <button
                className="ml-2 px-3 py-1 rounded bg-gray-200 text-blue-700 hover:bg-gray-300 text-sm font-medium transition"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

function Sidebar() {
  const location = useLocation();
  const sideNavLinks = [
    { to: "/twitter", label: "Twitter" },
    { to: "/facebook", label: "Facebook" },
    { to: "/linkedin", label: "LinkedIn" },
    { to: "/instagram", label: "Instagram" },
    { to: "/youtube", label: "YouTube" },
    { to: "/pinterest", label: "Pinterest" },
    { to: "/tumblr", label: "Tumblr" },
    { to: "/reddit", label: "Reddit" },
    { to: "/tiktok", label: "TikTok" },
  ];
  return (
    <aside className="hidden md:flex flex-col min-w-[180px] max-w-[220px] bg-white/80 border-r border-blue-100 py-6 px-2 gap-1 sticky top-[64px] h-[calc(100vh-64px)]">
      <div className="text-xs font-bold text-blue-700 mb-2 px-2">Schedule by App</div>
      {sideNavLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 whitespace-nowrap ${location.pathname.startsWith(link.to) ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 max-w-6xl mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logo-test" element={<LogoTest />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schedule" element={<PostScheduler />} />
              <Route path="/apikeys" element={<ApiKeyManager />} />
              <Route path="/manage-app-credentials" element={<AppCredentialManager />} />
              <Route path="/notifications" element={<NotificationPreferences />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/twitter" element={<TwitterAutoPost />} />
              <Route path="/facebook" element={<FacebookAutoPost />} />
              <Route path="/linkedin" element={<LinkedInAutoPost />} />
              <Route path="/instagram" element={<InstagramAutoPost />} />
              <Route path="/youtube" element={<YouTubeAutoPost />} />
              <Route path="/pinterest" element={<PinterestAutoPost />} />
              <Route path="/tumblr" element={<TumblrAutoPost />} />
              <Route path="/reddit" element={<RedditAutoPost />} />
              <Route path="/tiktok" element={<TikTokAutoPost />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp-verification" element={<OTPVerification />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import axios from "axios";

const platforms = [
  "facebook", "twitter", "tumblr", "linkedin", "instagram",
  "youtube", "pinterest", "reddit", "tiktok"
];

export default function AppCredentialManager() {
  const [platform, setPlatform] = useState(platforms[0]);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/app-credentials/set", {
        platform,
        clientId,
        clientSecret,
        redirectUri
      });
      setMessage("Credentials saved!");
    } catch (err) {
      setMessage("Error saving credentials.");
    }
  };

  // Optionally, fetch existing credentials for editing
  const fetchCredentials = async (selectedPlatform) => {
    setPlatform(selectedPlatform);
    setMessage("");
    try {
      const res = await axios.get(`/api/app-credentials/${selectedPlatform}`);
      setClientId(res.data.clientId || "");
      setClientSecret(res.data.clientSecret || "");
      setRedirectUri(res.data.redirectUri || "");
    } catch {
      setClientId("");
      setClientSecret("");
      setRedirectUri("");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight flex items-center gap-2">
        <KeyIcon /> Manage App Credentials
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Platform</label>
          <div className="relative">
            <select
              value={platform}
              onChange={e => fetchCredentials(e.target.value)}
              className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 text-base"
            >
              {platforms.map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
            {platform && <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">{platformIcons[platform]}</span>}
          </div>
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Client Secret</label>
          <input
            type="text"
            value={clientSecret}
            onChange={e => setClientSecret(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Redirect URI</label>
          <input
            type="text"
            value={redirectUri}
            onChange={e => setRedirectUri(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          Save
        </button>
      </form>
      {message && <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold animate-fade-in">{message}</div>}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

const platformIcons = {
  facebook: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F3"/><path d="M15.6 8.5h-2V7.3c0-.4.3-.6.6-.6h1.3V4.7h-1.8c-1.5 0-2.1.8-2.1 2.1v1.7H8.4v2.2h1.2v5.6h2.4v-5.6h1.6l.2-2.2z" fill="#fff"/></svg>
  ),
  twitter: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DA1F2"/><path d="M19 8.3c-.4.2-.8.3-1.2.4.4-.2.7-.6.9-1-.4.2-.8.4-1.2.5-.4-.4-1-.7-1.6-.7-1.2 0-2.1 1-2.1 2.1 0 .2 0 .3.1.5-1.7-.1-3.2-.9-4.2-2.1-.2.3-.3.6-.3 1 0 .7.4 1.3 1 1.7-.3 0-.6-.1-.8-.2v.1c0 1 .7 1.8 1.6 2-.2.1-.4.1-.6.1-.1 0-.2 0-.3-.1.2.7.9 1.2 1.7 1.2-.6.5-1.3.8-2.1.8H6c.8.5 1.7.8 2.7.8 3.2 0 5-2.7 5-5v-.2c.3-.2.6-.5.8-.8z" fill="#fff"/></svg>
  ),
  tumblr: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#36465D"/><path d="M13.5 17.5c-2.2 0-2.5-1.7-2.5-2.5v-3h2v-2h-2V7.5h-2V10h-1v2h1v3c0 2.2 1.8 4 4 4 .7 0 1.3-.1 1.8-.3l-.3-1.7c-.3.1-.7.2-1.2.2z" fill="#fff"/></svg>
  ),
  linkedin: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#0A66C2"/><rect x="7" y="10" width="2" height="7" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="7" rx="1" fill="#fff"/><circle cx="8" cy="8" r="1" fill="#fff"/><rect x="15" y="13" width="2" height="4" rx="1" fill="#fff"/></svg>
  ),
  instagram: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><radialGradient id="ig" cx="12" cy="12" r="12" gradientUnits="userSpaceOnUse"><stop stopColor="#feda75"/><stop offset=".5" stopColor="#fa7e1e"/><stop offset="1" stopColor="#d62976"/></radialGradient><circle cx="12" cy="12" r="12" fill="url(#ig)"/><rect x="7" y="7" width="10" height="10" rx="3" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#fa7e1e"/><circle cx="16" cy="8" r="1" fill="#fa7e1e"/></svg>
  ),
  youtube: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FF0000"/><polygon points="10,8 16,12 10,16" fill="#fff"/></svg>
  ),
  pinterest: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E60023"/><path d="M12 7.5c-2.1 0-3.5 1.5-3.5 3.2 0 .8.3 1.5 1 1.8.1.1.2 0 .2-.1.1-.1.2-.4.2-.5 0-.2-.1-.3-.2-.5-.2-.3-.3-.7-.3-1.1 0-1.5 1.2-2.7 2.8-2.7 1.5 0 2.4.9 2.4 2.2 0 1.7-.7 3.1-1.7 3.1-.6 0-1-.5-.8-1.1.2-.7.5-1.4.5-1.9 0-.4-.2-.7-.6-.7-.5 0-.9.5-.9 1.1 0 .4.1.7.1 1-.1.5-.3 1.1-.3 1.5 0 .6.4 1.1 1.2 1.1 1.5 0 2.5-1.6 2.5-3.7 0-1.6-1.3-2.7-3-2.7z" fill="#fff"/></svg>
  ),
  reddit: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FF4500"/><circle cx="8.5" cy="13.5" r="2" fill="#fff"/><circle cx="15.5" cy="13.5" r="2" fill="#fff"/><ellipse cx="12" cy="17" rx="4" ry="2" fill="#fff"/><circle cx="12" cy="8" r="1" fill="#fff"/></svg>
  ),
  tiktok: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#000"/><path d="M16 8.5c-.7 0-1.3-.2-1.8-.6V15c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.2 0 .4 0 .6.1V12c-.2 0-.4-.1-.6-.1-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V8.5z" fill="#fff"/></svg>
  ),
};
function KeyIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.12"/><rect x="7" y="10" width="10" height="4" rx="2" fill="#2563eb"/><circle cx="17" cy="12" r="2" fill="#2563eb"/></svg>
  );
}

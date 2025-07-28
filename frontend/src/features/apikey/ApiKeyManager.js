// ...existing code...
import React, { useEffect, useState } from "react";

function ApiKeyManager() {
  const [apiKeys, setApiKeys] = useState([]);
  const [platform, setPlatform] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/apikeys")
      .then((res) => res.json())
      .then(setApiKeys);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/apikeys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, apiKey, apiSecret }),
    });
    if (res.ok) {
      setMessage("API Key saved!");
      setPlatform("");
      setApiKey("");
      setApiSecret("");
      fetch("/api/apikeys")
        .then((res) => res.json())
        .then(setApiKeys);
    } else {
      setMessage("Failed to save API Key");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/apikeys/${id}`, { method: "DELETE" });
    fetch("/api/apikeys")
      .then((res) => res.json())
      .then(setApiKeys);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight flex items-center gap-2">
        <KeyIcon /> API Key Manager
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Platform</label>
          <div className="relative">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 text-base"
              required
            >
              <option value="">Select Platform</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            {platform && <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">{platformIcons[platform]}</span>}
          </div>
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">API Key</label>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">API Secret (if required)</label>
          <input
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          Save
        </button>
      </form>
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold animate-fade-in">{message}</div>
      )}
      <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center gap-2"><KeyIcon /> Your API Keys</h3>
      <ul className="space-y-2">
        {apiKeys.map((key) => (
          <li
            key={key.id}
            className="flex justify-between items-center bg-blue-50/40 border border-blue-100 rounded-xl p-4 shadow-sm"
          >
            <span className="flex items-center gap-2">
              {platformIcons[key.platform]} <span className="font-semibold text-blue-900">{key.platform}</span>: <span className="font-mono text-blue-700">{key.apiKey}</span>
            </span>
            <button
              onClick={() => handleDelete(key.id)}
              className="text-red-600 hover:text-red-800 font-bold px-3 py-1 rounded transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default ApiKeyManager;

const platformIcons = {
  twitter: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1DA1F2"/><path d="M19 8.3c-.4.2-.8.3-1.2.4.4-.2.7-.6.9-1-.4.2-.8.4-1.2.5-.4-.4-1-.7-1.6-.7-1.2 0-2.1 1-2.1 2.1 0 .2 0 .3.1.5-1.7-.1-3.2-.9-4.2-2.1-.2.3-.3.6-.3 1 0 .7.4 1.3 1 1.7-.3 0-.6-.1-.8-.2v.1c0 1 .7 1.8 1.6 2-.2.1-.4.1-.6.1-.1 0-.2 0-.3-.1.2.7.9 1.2 1.7 1.2-.6.5-1.3.8-2.1.8H6c.8.5 1.7.8 2.7.8 3.2 0 5-2.7 5-5v-.2c.3-.2.6-.5.8-.8z" fill="#fff"/></svg>
  ),
  facebook: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F3"/><path d="M15.6 8.5h-2V7.3c0-.4.3-.6.6-.6h1.3V4.7h-1.8c-1.5 0-2.1.8-2.1 2.1v1.7H8.4v2.2h1.2v5.6h2.4v-5.6h1.6l.2-2.2z" fill="#fff"/></svg>
  ),
  linkedin: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#0A66C2"/><rect x="7" y="10" width="2" height="7" rx="1" fill="#fff"/><rect x="11" y="10" width="2" height="7" rx="1" fill="#fff"/><circle cx="8" cy="8" r="1" fill="#fff"/><rect x="15" y="13" width="2" height="4" rx="1" fill="#fff"/></svg>
  ),
};
function KeyIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.12"/><rect x="7" y="10" width="10" height="4" rx="2" fill="#2563eb"/><circle cx="17" cy="12" r="2" fill="#2563eb"/></svg>
  );
}

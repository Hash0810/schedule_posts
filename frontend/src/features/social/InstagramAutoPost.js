import React, { useState, useEffect } from "react";

function InstagramAutoPost() {
  const [connected, setConnected] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  // Check connection status on mount
  useEffect(() => {
    fetch("/api/socialauth/status/instagram")
      .then(res => res.json())
      .then(data => setConnected(data.connected))
      .catch(() => setConnected(false));
  }, []);

  const handleConnect = async () => {
    const res = await fetch("/api/socialauth/connect/instagram");
    const url = await res.text();
    window.location.href = url;
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/social/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: postContent, 
        scheduledTime, 
        platform: "instagram",
        imageUrl: imageUrl || null
      }),
    });
    const msg = await res.text();
    setMessage(msg);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <InstagramIcon />
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">Instagram Auto Post</h2>
      </div>
      {!connected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <span className="text-yellow-600 font-bold">⚠️</span>
          <div className="flex-1">
            <p className="text-yellow-800 mb-2">Connect your Instagram account to schedule posts</p>
            <button onClick={handleConnect} className="bg-pink-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-pink-600 transition-all duration-200">
              Connect Instagram
            </button>
          </div>
        </div>
      )}
      {connected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-green-600 font-bold">✔️</span>
          <div className="flex-1 text-green-800 font-semibold">Instagram connected successfully!</div>
        </div>
      )}
      <form onSubmit={handleSchedule} className="space-y-6">
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Post Content</label>
          <textarea 
            value={postContent} 
            onChange={e => setPostContent(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] text-base transition"
            required 
            disabled={!connected}
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Image URL (Required for Instagram)</label>
          <input 
            type="url" 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            placeholder="https://example.com/image.jpg"
            required 
            disabled={!connected}
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Schedule Time</label>
          <input 
            type="datetime-local" 
            value={scheduledTime} 
            onChange={e => setScheduledTime(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            required 
            disabled={!connected}
          />
        </div>
        <button 
          type="submit" 
          className={`w-full px-5 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 ${
            connected 
              ? 'bg-pink-500 text-white hover:bg-pink-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!connected}
        >
          {connected ? 'Schedule Post' : 'Connect Instagram First'}
        </button>
      </form>
      {message && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold animate-fade-in">
          {message}
        </div>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default InstagramAutoPost;

function InstagramIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><radialGradient id="ig" cx="18" cy="18" r="18" gradientUnits="userSpaceOnUse"><stop stopColor="#feda75"/><stop offset=".5" stopColor="#fa7e1e"/><stop offset="1" stopColor="#d62976"/></radialGradient><circle cx="18" cy="18" r="18" fill="url(#ig)"/><rect x="11" y="11" width="14" height="14" rx="5" fill="#fff"/><circle cx="18" cy="18" r="5" fill="#fa7e1e"/><circle cx="25" cy="13" r="2" fill="#fa7e1e"/></svg>
  );
}

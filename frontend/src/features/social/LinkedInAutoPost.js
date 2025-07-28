import React, { useState, useEffect } from "react";

function LinkedInAutoPost() {
  const [connected, setConnected] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  // Check connection status on mount
  useEffect(() => {
    fetch("/api/socialauth/status/linkedin")
      .then(res => res.json())
      .then(data => setConnected(data.connected))
      .catch(() => setConnected(false));
  }, []);

  const handleConnect = async () => {
    const res = await fetch("/api/socialauth/connect/linkedin");
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
        platform: "linkedin",
        imageUrl: imageUrl || null
      }),
    });
    const msg = await res.text();
    setMessage(msg);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <LinkedInIcon />
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">LinkedIn Auto Post</h2>
      </div>
      {!connected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <span className="text-yellow-600 font-bold">⚠️</span>
          <div className="flex-1">
            <p className="text-yellow-800 mb-2">Connect your LinkedIn account to schedule posts</p>
            <button onClick={handleConnect} className="bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-blue-800 transition-all duration-200">
              Connect LinkedIn
            </button>
          </div>
        </div>
      )}
      {connected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-green-600 font-bold">✔️</span>
          <div className="flex-1 text-green-800 font-semibold">LinkedIn connected successfully!</div>
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
          <label className="block font-semibold text-blue-800 mb-1">Image URL (Optional)</label>
          <input 
            type="url" 
            value={imageUrl} 
            onChange={e => setImageUrl(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            placeholder="https://example.com/image.jpg"
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
              ? 'bg-blue-700 text-white hover:bg-blue-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!connected}
        >
          {connected ? 'Schedule Post' : 'Connect LinkedIn First'}
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

export default LinkedInAutoPost;

function LinkedInIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#0A66C2"/><rect x="10" y="15" width="3" height="9" rx="1.5" fill="#fff"/><rect x="16" y="15" width="3" height="9" rx="1.5" fill="#fff"/><circle cx="11.5" cy="12" r="1.5" fill="#fff"/><rect x="22" y="18" width="3" height="6" rx="1.5" fill="#fff"/></svg>
  );
}

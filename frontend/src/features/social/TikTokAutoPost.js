import React, { useState, useEffect } from "react";

function TikTokAutoPost() {
  const [connected, setConnected] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [videoFilePath, setVideoFilePath] = useState("");
  const [message, setMessage] = useState("");

  // Check connection status on mount
  useEffect(() => {
    fetch("/api/socialauth/status/tiktok")
      .then(res => res.json())
      .then(data => setConnected(data.connected))
      .catch(() => setConnected(false));
  }, []);

  const handleConnect = async () => {
    const res = await fetch("/api/socialauth/connect/tiktok");
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
        platform: "tiktok",
        videoFilePath: videoFilePath || null
      }),
    });
    const msg = await res.text();
    setMessage(msg);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <TikTokIcon />
        <h2 className="text-2xl font-extrabold text-blue-900 tracking-tight">TikTok Auto Post</h2>
      </div>
      {!connected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <span className="text-yellow-600 font-bold">⚠️</span>
          <div className="flex-1">
            <p className="text-yellow-800 mb-2">Connect your TikTok account to schedule videos</p>
            <button onClick={handleConnect} className="bg-black text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-gray-800 transition-all duration-200">
              Connect TikTok
            </button>
          </div>
        </div>
      )}
      {connected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-green-600 font-bold">✔️</span>
          <div className="flex-1 text-green-800 font-semibold">TikTok connected successfully!</div>
        </div>
      )}
      <form onSubmit={handleSchedule} className="space-y-6">
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Video Description</label>
          <textarea 
            value={postContent} 
            onChange={e => setPostContent(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] text-base transition"
            required 
            disabled={!connected}
            placeholder="Enter your video description..."
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-800 mb-1">Video File Path</label>
          <input 
            type="text" 
            value={videoFilePath} 
            onChange={e => setVideoFilePath(e.target.value)} 
            className="w-full border border-blue-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
            placeholder="/path/to/video.mp4"
            required 
            disabled={!connected}
          />
          <p className="text-sm text-gray-500 mt-1">Enter the path to your video file</p>
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
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!connected}
        >
          {connected ? 'Schedule Video' : 'Connect TikTok First'}
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

export default TikTokAutoPost;

function TikTokIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#000"/><path d="M25 13.5c-1 0-2-.3-2.8-.8V24c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3c.3 0 .7.1 1 .2v-2.1c-.3-.1-.7-.1-1-.1-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5V13.5z" fill="#fff"/></svg>
  );
}

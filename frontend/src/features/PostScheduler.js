import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, addPost, deletePost, updatePost } from "../slices/postsSlice";

export default function PostScheduler() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.posts);
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [imageUrl, setImageUrl] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      content,
      scheduledTime: scheduledAt,
      platform,
      imageUrl: imageUrl || null,
    };

    if (editing) {
      dispatch(updatePost({ id: editing, ...postData }));
      setEditing(null);
    } else {
      dispatch(addPost(postData));
    }
    setContent("");
    setScheduledAt("");
    setImageUrl("");
  };

  const handleEdit = (post) => {
    setEditing(post.id);
    setContent(post.content);
    setScheduledAt(post.scheduledAt ? post.scheduledAt.slice(0, 16) : "");
    setPlatform(post.platform || "twitter");
    setImageUrl(post.imageUrl || "");
  };

  const handleDelete = (id) => {
    dispatch(deletePost(id));
    if (editing === id) {
      setEditing(null);
      setContent("");
      setScheduledAt("");
      setImageUrl("");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setContent("");
    setScheduledAt("");
    setImageUrl("");
    setPlatform("twitter");
  };

  const platforms = [
    { value: "twitter", label: "Twitter" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "pinterest", label: "Pinterest" },
    { value: "tumblr", label: "Tumblr" },
    { value: "reddit", label: "Reddit" },
    { value: "tiktok", label: "TikTok" },
  ];

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
    instagram: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><radialGradient id="ig" cx="12" cy="12" r="12" gradientUnits="userSpaceOnUse"><stop stopColor="#feda75"/><stop offset=".5" stopColor="#fa7e1e"/><stop offset="1" stopColor="#d62976"/></radialGradient><circle cx="12" cy="12" r="12" fill="url(#ig)"/><rect x="7" y="7" width="10" height="10" rx="3" fill="#fff"/><circle cx="12" cy="12" r="3" fill="#fa7e1e"/><circle cx="16" cy="8" r="1" fill="#fa7e1e"/></svg>
    ),
    youtube: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FF0000"/><polygon points="10,8 16,12 10,16" fill="#fff"/></svg>
    ),
    pinterest: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#E60023"/><path d="M12 7.5c-2.1 0-3.5 1.5-3.5 3.2 0 .8.3 1.5 1 1.8.1.1.2 0 .2-.1.1-.1.2-.4.2-.5 0-.2-.1-.3-.2-.5-.2-.3-.3-.7-.3-1.1 0-1.5 1.2-2.7 2.8-2.7 1.5 0 2.4.9 2.4 2.2 0 1.7-.7 3.1-1.7 3.1-.6 0-1-.5-.8-1.1.2-.7.5-1.4.5-1.9 0-.4-.2-.7-.6-.7-.5 0-.9.5-.9 1.1 0 .4.1.7.1 1-.1.5-.3 1.1-.3 1.5 0 .6.4 1.1 1.2 1.1 1.5 0 2.5-1.6 2.5-3.7 0-1.6-1.3-2.7-3-2.7z" fill="#fff"/></svg>
    ),
    tumblr: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#36465D"/><path d="M13.5 17.5c-2.2 0-2.5-1.7-2.5-2.5v-3h2v-2h-2V7.5h-2V10h-1v2h1v3c0 2.2 1.8 4 4 4 .7 0 1.3-.1 1.8-.3l-.3-1.7c-.3.1-.7.2-1.2.2z" fill="#fff"/></svg>
    ),
    reddit: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#FF4500"/><circle cx="8.5" cy="13.5" r="2" fill="#fff"/><circle cx="15.5" cy="13.5" r="2" fill="#fff"/><ellipse cx="12" cy="17" rx="4" ry="2" fill="#fff"/><circle cx="12" cy="8" r="1" fill="#fff"/></svg>
    ),
    tiktok: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#000"/><path d="M16 8.5c-.7 0-1.3-.2-1.8-.6V15c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.2 0 .4 0 .6.1V12c-.2 0-.4-.1-.6-.1-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V8.5z" fill="#fff"/></svg>
    ),
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'scheduled': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-3xl shadow-2xl border border-blue-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        {editing ? "Edit Scheduled Post" : "Schedule a New Post"}
      </h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Platform</label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
                required
              >
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">{platformIcons[platform]}</span>
            </div>
          </div>
          
          <div>
            <label className="block font-medium text-gray-700 mb-2">Schedule Time</label>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Post Content</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">Image URL (Optional)</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <button 
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg" 
            type="submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Processing...' : (editing ? "Update Post" : "Schedule Post")}
          </button>
          
          {editing && (
            <button 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors" 
              type="button" 
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6 text-blue-800">Scheduled Posts</h3>
        
        {status === "loading" && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {items.length === 0 && status !== "loading" && (
          <div className="text-center py-8 text-gray-500">
            No scheduled posts yet. Create your first post above!
          </div>
        )}
        
        <div className="space-y-4">
          {items.map(post => (
            <div key={post.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow bg-blue-50/30 flex items-start gap-4">
              <div className="flex flex-col items-center mr-4 mt-1">
                {platformIcons[post.platform]}
                <span className="text-xs font-semibold text-gray-500 mt-1 uppercase">{post.platform}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-sm font-medium ${getStatusColor(post.status)}`}>{post.status || 'Scheduled'}</span>
                </div>
                <div className="text-lg font-medium text-gray-900 mb-2">{post.content}</div>
                <div className="text-sm text-gray-500">
                  Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                </div>
                {post.imageUrl && (
                  <div className="text-sm text-gray-500 mt-1">
                    Image: {post.imageUrl}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm" 
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 font-medium text-sm" 
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

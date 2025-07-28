import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics, updateEngagement, createSampleData } from "../slices/analyticsSlice";

export default function AnalyticsDashboard() {
  const dispatch = useDispatch();
  const { data: analytics, status, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const handleUpdateEngagement = () => {
    dispatch(updateEngagement()).then(() => {
      // Refresh analytics after updating engagement
      dispatch(fetchAnalytics());
    });
  };

  const handleCreateSampleData = () => {
    dispatch(createSampleData()).then(() => {
      // Refresh analytics after creating sample data
      dispatch(fetchAnalytics());
    });
  };

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Analytics</h2>
          <p>{error}</p>
          <button 
            onClick={() => dispatch(fetchAnalytics())}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use analytics data if available, otherwise show default values
  const analyticsData = analytics || {
    engagement: 0,
    reach: 0,
    topPost: "No posts yet",
    topPlatform: "No posts yet",
    growth: 0,
    totalPosts: 0,
    recentActivity: 0,
    averageEngagement: 0
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">
        Analytics Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <AnalyticsCard color="blue" title="Total Engagement" value={analyticsData.engagement.toLocaleString()} icon={<CommentIcon />} />
        <AnalyticsCard color="green" title="Total Reach" value={analyticsData.reach.toLocaleString()} icon={<GlobeIcon />} />
        <AnalyticsCard color="yellow" title="Top Post" value={analyticsData.topPost.length > 50 ? analyticsData.topPost.substring(0, 50) + "..." : analyticsData.topPost} icon={<StarIcon />} />
        <AnalyticsCard color="purple" title="Top Platform" value={analyticsData.topPlatform} icon={<DeviceIcon />} />
        <AnalyticsCard color="pink" title="Growth (30 days)" value={analyticsData.growth + "%"} icon={<GrowthIcon />} />
        <AnalyticsCard color="indigo" title="Total Posts" value={analyticsData.totalPosts} icon={<PostIcon />} />
        <AnalyticsCard color="orange" title="Recent Activity (7 days)" value={analyticsData.recentActivity} icon={<FireIcon />} />
        <AnalyticsCard color="teal" title="Avg Engagement" value={Math.round(analyticsData.averageEngagement)} icon={<ChartIcon />} />
      </div>
      {analyticsData.platformBreakdown && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-4">Platform Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analyticsData.platformBreakdown).map(([platform, count]) => (
              <div key={platform} className="bg-gray-50 p-4 rounded-xl text-center shadow border border-blue-50">
                <div className="font-bold text-blue-800 text-lg mb-1">{platform}</div>
                <div className="text-2xl font-mono text-blue-600">{count}</div>
                <div className="text-sm text-gray-500">posts</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <button
          onClick={() => dispatch(fetchAnalytics())}
          className="px-7 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg text-lg"
        >
          Refresh Analytics
        </button>
        <button
          onClick={handleUpdateEngagement}
          className="px-7 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all duration-200 shadow-lg text-lg"
        >
          Update Engagement
        </button>
        <button
          onClick={handleCreateSampleData}
          className="px-7 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all duration-200 shadow-lg text-lg"
        >
          Create Sample Data
        </button>
        <a
          href="/dashboard"
          className="px-7 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all duration-200 shadow-lg text-lg"
        >
          Back to Dashboard
        </a>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function AnalyticsCard({ color, title, value, icon }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    yellow: "bg-yellow-50 text-yellow-900",
    purple: "bg-purple-50 text-purple-900",
    pink: "bg-pink-50 text-pink-900",
    indigo: "bg-indigo-50 text-indigo-900",
    orange: "bg-orange-50 text-orange-900",
    teal: "bg-teal-50 text-teal-900",
  };
  return (
    <div className={`flex items-center gap-5 p-7 rounded-2xl shadow-md border border-blue-50 transition-transform hover:-translate-y-1 hover:shadow-xl duration-200 ${colorMap[color]}`}> 
      <span className="flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <div className="font-bold text-xl mb-1">{title}</div>
        <div className="text-3xl font-mono">{value}</div>
      </div>
    </div>
  );
}
// SVG Icon Components
function CommentIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="6" fill="#2563eb" opacity="0.12"/><rect x="8" y="12" width="24" height="16" rx="4" fill="#2563eb" opacity="0.7"/><circle cx="16" cy="20" r="2" fill="#fff"/><circle cx="24" cy="20" r="2" fill="#fff"/></svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#22d3ee" opacity="0.12"/><circle cx="20" cy="20" r="12" fill="#22d3ee"/><ellipse cx="20" cy="20" rx="8" ry="12" fill="#fff" opacity="0.7"/><ellipse cx="20" cy="20" rx="12" ry="8" fill="#2563eb" opacity="0.2"/></svg>
  );
}
function StarIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#facc15" opacity="0.12"/><circle cx="20" cy="20" r="12" fill="#facc15"/><path d="M20 13l2.4 5.6 6.1.5-4.7 4.1 1.4 6-5.2-3.2-5.2 3.2 1.4-6-4.7-4.1 6.1-.5L20 13z" fill="#fff"/></svg>
  );
}
function DeviceIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="8" fill="#a78bfa" opacity="0.12"/><rect x="12" y="16" width="16" height="10" rx="5" fill="#a78bfa"/><rect x="18" y="28" width="4" height="2" rx="1" fill="#a78bfa"/></svg>
  );
}
function GrowthIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="8" fill="#f472b6" opacity="0.12"/><rect x="12" y="16" width="4" height="10" rx="2" fill="#f472b6"/><rect x="18" y="12" width="4" height="14" rx="2" fill="#f472b6"/><rect x="24" y="18" width="4" height="8" rx="2" fill="#f472b6"/></svg>
  );
}
function PostIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="8" fill="#6366f1" opacity="0.12"/><rect x="12" y="16" width="16" height="10" rx="5" fill="#6366f1"/><rect x="16" y="20" width="8" height="2" rx="1" fill="#fff"/></svg>
  );
}
function FireIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#fb923c" opacity="0.12"/><circle cx="20" cy="20" r="12" fill="#fb923c"/><path d="M20 14c2 2 4 4 4 7a4 4 0 11-8 0c0-3 2-5 4-7z" fill="#fff"/></svg>
  );
}
function ChartIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="8" fill="#14b8a6" opacity="0.12"/><rect x="12" y="16" width="4" height="10" rx="2" fill="#14b8a6"/><rect x="18" y="12" width="4" height="14" rx="2" fill="#14b8a6"/><rect x="24" y="18" width="4" height="8" rx="2" fill="#14b8a6"/></svg>
  );
}

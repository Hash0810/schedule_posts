import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../slices/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  if (error)
    return <div className="p-8 text-red-600 text-center font-semibold">{error}</div>;
  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <StatCard color="blue" title="Scheduled Posts" value={stats.postsScheduled} icon={<CalendarIcon />} />
        <StatCard color="green" title="Published Posts" value={stats.postsPublished} icon={<CheckIcon />} />
        <StatCard color="yellow" title="Notifications" value={stats.notifications} icon={<BellIcon />} />
        <StatCard color="gray" title="Last Login" value={new Date(stats.lastLogin).toLocaleString()} icon={<ClockIcon />} />
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        <a href="/schedule" className="px-7 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-lg text-lg">Schedule a Post</a>
        <a href="/analytics" className="px-7 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all duration-200 shadow-lg text-lg">View Analytics</a>
        <a href="/manage-app-credentials" className="px-7 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all duration-200 shadow-lg text-lg">Manage App Credentials</a>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function StatCard({ color, title, value, icon }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    yellow: "bg-yellow-50 text-yellow-900",
    gray: "bg-gray-50 text-gray-900",
  };
  return (
    <div className={`flex items-center gap-5 p-7 rounded-2xl shadow-md border border-blue-50 transition-transform hover:-translate-y-1 hover:shadow-xl duration-200 ${colorMap[color]}`}> 
      <span className="flex-shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-xl mb-1">{title}</div>
        <div className="text-3xl font-mono">{value}</div>
      </div>
    </div>
  );
}
// SVG Icon Components
function CalendarIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="6" fill="#2563eb" opacity="0.12"/><rect x="8" y="12" width="24" height="16" rx="4" fill="#2563eb" opacity="0.7"/><circle cx="16" cy="20" r="2" fill="#fff"/><circle cx="24" cy="20" r="2" fill="#fff"/></svg>
  );
}
function CheckIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#22c55e" opacity="0.12"/><circle cx="20" cy="20" r="12" fill="#22c55e"/><path d="M15 21l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}
function BellIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="8" y="12" width="24" height="16" rx="8" fill="#facc15" opacity="0.12"/><rect x="12" y="16" width="16" height="10" rx="5" fill="#facc15"/><circle cx="20" cy="30" r="2" fill="#facc15"/></svg>
  );
}
function ClockIcon() {
  return (
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#64748b" opacity="0.12"/><circle cx="20" cy="20" r="12" fill="#64748b"/><path d="M20 14v6l4 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
  );
}

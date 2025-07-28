import React from "react";
import { Link } from "react-router-dom";
import ModernLogoIcon from "../components/ModernLogoIcon";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="w-full max-w-3xl p-10 bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col items-center animate-fade-in">
        <ModernLogoIcon className="w-24 h-24 mb-6 drop-shadow-lg" color="#2563eb" />
        <h1 className="text-5xl font-extrabold text-blue-900 mb-3 text-center tracking-tight leading-tight">Effortless Social Media Scheduling</h1>
        <p className="text-blue-600 text-lg mb-8 text-center max-w-2xl font-medium">
          Schedule, manage, and analyze your social media posts across all major platforms. Secure, multi-tenant, and built for teams and agencies.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200 text-lg">Get Started</Link>
          <Link to="/login" className="px-8 py-3 bg-white border border-blue-400 text-blue-700 rounded-xl font-semibold shadow hover:bg-blue-50 transition-all duration-200 text-lg">Login</Link>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
          <FeatureCard 
            title="Multi-Platform"
            desc="Post to Facebook, Twitter, Instagram, LinkedIn, and more from one dashboard."
            icon={<PlatformIcon />}
          />
          <FeatureCard 
            title="Team Collaboration"
            desc="Invite your team, manage permissions, and collaborate securely."
            icon={<TeamIcon />}
          />
          <FeatureCard 
            title="Analytics & Insights"
            desc="Track engagement, reach, and growth with beautiful charts."
            icon={<AnalyticsIcon />}
          />
          <FeatureCard 
            title="Secure Credentials"
            desc="Store and manage app credentials per user or organization."
            icon={<LockIcon />}
          />
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="flex items-start gap-4 bg-blue-50 rounded-2xl p-6 shadow-md border border-blue-100 transition-transform hover:-translate-y-1 hover:shadow-xl duration-200">
      <span className="flex-shrink-0">{icon}</span>
      <div>
        <div className="font-bold text-blue-900 text-xl mb-1">{title}</div>
        <div className="text-blue-600 text-base">{desc}</div>
      </div>
    </div>
  );
}

// SVG Icon Components
function PlatformIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect x="3" y="7" width="30" height="22" rx="5" fill="#2563eb" opacity="0.12"/><rect x="7" y="11" width="22" height="14" rx="3" fill="#2563eb" opacity="0.7"/><circle cx="13" cy="18" r="2" fill="#fff"/><circle cx="18" cy="18" r="2" fill="#fff"/><circle cx="23" cy="18" r="2" fill="#fff"/></svg>
  );
}
function TeamIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><circle cx="18" cy="14" r="6" fill="#2563eb" opacity="0.15"/><circle cx="18" cy="14" r="4" fill="#2563eb"/><ellipse cx="18" cy="26" rx="10" ry="5" fill="#2563eb" opacity="0.12"/><ellipse cx="18" cy="26" rx="7" ry="3.5" fill="#2563eb"/></svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect x="6" y="24" width="4" height="6" rx="2" fill="#2563eb"/><rect x="14" y="18" width="4" height="12" rx="2" fill="#2563eb"/><rect x="22" y="12" width="4" height="18" rx="2" fill="#2563eb"/><rect x="30" y="6" width="4" height="24" rx="2" fill="#2563eb" opacity="0.3"/></svg>
  );
}
function LockIcon() {
  return (
    <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect x="8" y="16" width="20" height="12" rx="4" fill="#2563eb" opacity="0.12"/><rect x="12" y="20" width="12" height="8" rx="2" fill="#2563eb"/><rect x="15" y="12" width="6" height="8" rx="3" fill="#2563eb"/></svg>
  );
}

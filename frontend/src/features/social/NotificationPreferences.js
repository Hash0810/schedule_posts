import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchNotificationPreferences, 
  updateNotificationPreferences,
  setEmail, 
  setPush 
} from "../../slices/notificationSlice";

export default function NotificationPreferences() {
  const dispatch = useDispatch();
  const { preferences, status, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationPreferences());
  }, [dispatch]);

  const handleEmailChange = (checked) => {
    dispatch(setEmail(checked));
    const updatedPreferences = { ...preferences, emailNotifications: checked };
    dispatch(updateNotificationPreferences(updatedPreferences));
  };

  const handlePushChange = (checked) => {
    dispatch(setPush(checked));
    const updatedPreferences = { ...preferences, pushNotifications: checked };
    dispatch(updateNotificationPreferences(updatedPreferences));
  };

  const handlePreferenceChange = (key, checked) => {
    const updatedPreferences = { ...preferences, [key]: checked };
    dispatch(updateNotificationPreferences(updatedPreferences));
  };

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
        <div className="text-red-600 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-2xl border border-blue-100 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight flex items-center justify-center gap-2">
        <BellIcon /> Notification Preferences
      </h2>
      <div className="space-y-8">
        <SectionCard icon={<MailIcon />} title="General Notifications">
          <Toggle label="Email Notifications" checked={preferences.emailNotifications} onChange={handleEmailChange} />
          <Toggle label="Push Notifications" checked={preferences.pushNotifications} onChange={handlePushChange} />
        </SectionCard>
        <SectionCard icon={<PostIcon />} title="Post Notifications">
          <Toggle label="Post Published Successfully" checked={preferences.postPublishedNotifications} onChange={checked => handlePreferenceChange('postPublishedNotifications', checked)} />
          <Toggle label="Post Failed to Publish" checked={preferences.postFailedNotifications} onChange={checked => handlePreferenceChange('postFailedNotifications', checked)} />
        </SectionCard>
        <SectionCard icon={<CalendarIcon />} title="Schedule Notifications">
          <Toggle label="Schedule Reminders" checked={preferences.scheduleReminderNotifications} onChange={checked => handlePreferenceChange('scheduleReminderNotifications', checked)} />
        </SectionCard>
        <SectionCard icon={<AlertIcon />} title="System Notifications">
          <Toggle label="System Alerts" checked={preferences.systemAlertNotifications} onChange={checked => handlePreferenceChange('systemAlertNotifications', checked)} />
          <Toggle label="Connection Issues" checked={preferences.connectionIssueNotifications} onChange={checked => handlePreferenceChange('connectionIssueNotifications', checked)} />
        </SectionCard>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-6 shadow flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <span>{icon}</span>
        <span className="font-bold text-blue-800 text-lg">{title}</span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="text-blue-700 font-medium flex-1">{label}</span>
      <span className="relative inline-block w-11 h-6 align-middle select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span className="block w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-200"></span>
        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all duration-200"></span>
      </span>
    </label>
  );
}
// SVG Icon Components
function BellIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="4" y="8" width="20" height="12" rx="6" fill="#2563eb" opacity="0.12"/><rect x="7" y="11" width="14" height="8" rx="4" fill="#2563eb"/><circle cx="14" cy="22" r="2" fill="#2563eb"/></svg>
  );
}
function MailIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="4" fill="#2563eb" opacity="0.12"/><rect x="4" y="8" width="16" height="8" rx="2" fill="#2563eb"/><path d="M4 8l8 5 8-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
  );
}
function PostIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="4" fill="#22c55e" opacity="0.12"/><rect x="6" y="8" width="12" height="8" rx="2" fill="#22c55e"/><rect x="9" y="12" width="6" height="2" rx="1" fill="#fff"/></svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4" fill="#facc15" opacity="0.12"/><rect x="5" y="8" width="14" height="8" rx="2" fill="#facc15"/><circle cx="12" cy="12" r="2" fill="#fff"/></svg>
  );
}
function AlertIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="4" fill="#f87171" opacity="0.12"/><rect x="6" y="8" width="12" height="8" rx="2" fill="#f87171"/><rect x="11" y="10" width="2" height="4" rx="1" fill="#fff"/></svg>
  );
}

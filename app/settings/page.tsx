"use client";

import { useState } from "react";
import CitizenSidebar from "@/components/SideBar";
import {
  Bell,
  Lock,
  User,
  Shield,
  Moon,
  Mail,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [statusNotifications, setStatusNotifications] = useState(true);
  const [resolutionNotifications, setResolutionNotifications] = useState(true);

  const [darkMode, setDarkMode] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const sections = [
    {
      id: "account",
      label: "Account",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Moon,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Settings save error:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CitizenSidebar />

      <main className="md:ml-64 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your CivicConnect account and preferences.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
            {/* Settings Navigation */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* ACCOUNT */}
              {activeSection === "account" && (
                <>
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Account Information
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Update your personal information.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Full Name
                        </label>

                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                          <input
                            type="email"
                            disabled
                            placeholder="Your email address"
                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-500"
                          />
                        </div>

                        <p className="mt-1.5 text-xs text-slate-400">
                          Your email address cannot be changed here.
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Phone Number
                        </label>

                        <div className="relative">
                          <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                      {saved && (
                        <span className="flex items-center gap-1.5 text-sm text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Saved successfully
                        </span>
                      )}

                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}

                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </section>
                </>
              )}

              {/* NOTIFICATIONS */}
              {activeSection === "notifications" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Notification Preferences
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose how CivicConnect keeps you updated.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <SettingToggle
                      icon={Mail}
                      title="Email Notifications"
                      description="Receive important updates through email."
                      enabled={emailNotifications}
                      onChange={setEmailNotifications}
                    />

                    <SettingToggle
                      icon={Smartphone}
                      title="Push Notifications"
                      description="Receive notifications about your complaints."
                      enabled={pushNotifications}
                      onChange={setPushNotifications}
                    />

                    <SettingToggle
                      icon={Bell}
                      title="Complaint Status Updates"
                      description="Get notified whenever your complaint status changes."
                      enabled={statusNotifications}
                      onChange={setStatusNotifications}
                    />

                    <SettingToggle
                      icon={CheckCircle2}
                      title="Resolution Updates"
                      description="Get notified when an issue is marked as resolved."
                      enabled={resolutionNotifications}
                      onChange={setResolutionNotifications}
                    />
                  </div>
                </section>
              )}

              {/* SECURITY */}
              {activeSection === "security" && (
                <>
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Change Password
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Keep your account secure with a strong password.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Current Password
                        </label>

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          New Password
                        </label>

                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Confirm New Password
                        </label>

                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        />
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                        Update Password
                      </button>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-red-50 p-3">
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </div>

                      <div className="flex-1">
                        <h2 className="font-semibold text-slate-900">
                          Danger Zone
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Permanently delete your CivicConnect account and
                          associated data.
                        </p>

                        <button className="mt-4 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* PRIVACY */}
              {activeSection === "privacy" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Privacy
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Control how your information is used on CivicConnect.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <SettingToggle
                      icon={Eye}
                      title="Public Reporter Name"
                      description="Allow other citizens to see your name on public complaints."
                      enabled={false}
                      onChange={() => {}}
                    />

                    <SettingToggle
                      icon={Shield}
                      title="Location Privacy"
                      description="Your exact location is only used when necessary for complaint processing."
                      enabled={true}
                      onChange={() => {}}
                    />
                  </div>

                  <div className="mt-6 rounded-xl bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <Shield className="mt-0.5 h-5 w-5 text-slate-600" />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Your data matters
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          CivicConnect only uses information required to
                          process, track, and improve civic complaints.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* APPEARANCE */}
              {activeSection === "appearance" && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Appearance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Customize how CivicConnect looks for you.
                    </p>
                  </div>

                  <SettingToggle
                    icon={Moon}
                    title="Dark Mode"
                    description="Use a darker interface that is easier on the eyes at night."
                    enabled={darkMode}
                    onChange={setDarkMode}
                  />

                  <div className="mt-6 rounded-xl border border-slate-200 p-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">
                      Theme Preview
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => setDarkMode(false)}
                        className={`rounded-xl border p-4 text-left ${
                          !darkMode
                            ? "border-slate-900 ring-2 ring-slate-100"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="mb-3 h-12 rounded-lg bg-slate-100" />
                        <p className="text-sm font-semibold text-slate-800">
                          Light
                        </p>
                      </button>

                      <button
                        onClick={() => setDarkMode(true)}
                        className={`rounded-xl border bg-slate-900 p-4 text-left ${
                          darkMode
                            ? "border-slate-900 ring-2 ring-slate-100"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="mb-3 h-12 rounded-lg bg-slate-700" />
                        <p className="text-sm font-semibold text-white">
                          Dark
                        </p>
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* Sign Out */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  onClick={() => {
                    window.location.href = "/api/auth/signout";
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingToggle({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-100 p-2">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-slate-900" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
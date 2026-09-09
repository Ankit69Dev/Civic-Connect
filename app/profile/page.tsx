"use client";

import { useEffect, useState } from "react";
import CitizenSidebar from "@/components/SideBar";
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: string;
  provider: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/profile");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load profile."
        );
      }

      setProfile(data.user);
      setName(data.user.name || "");
      setPhone(data.user.phone || "");
    } catch (error) {
      console.error("Profile error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  try {
    setUploadingImage(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/profile/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to upload profile picture."
      );
    }

    setProfile(data.user);

    setSuccess("Profile picture updated successfully.");

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  } catch (error) {
    console.error("Profile image upload error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Failed to upload profile picture."
    );
  } finally {
    setUploadingImage(false);

    // Allows selecting the same file again
    event.target.value = "";
  }
}

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update profile."
        );
      }

      setProfile(data.user);

      setName(data.user.name || "");
      setPhone(data.user.phone || "");

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CitizenSidebar />

        <main className="flex min-h-screen items-center justify-center lg:ml-72">
          <div className="text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CitizenSidebar />

        <main className="lg:ml-72">
          <div className="p-6 lg:p-8">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <AlertCircle
                  size={22}
                  className="text-red-500"
                />

                <p className="text-sm font-medium text-red-700">
                  {error || "Unable to load profile."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const initials =
    profile.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Existing Citizen Sidebar */}
      <CitizenSidebar />

      <main className="lg:ml-72">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="px-6 py-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-950">
              Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information and account details.
            </p>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <div className="mx-auto max-w-4xl">
            {/* Profile Header Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="relative shrink-0">
  {profile.image ? (
    <img
      src={profile.image}
      alt="Profile picture"
      className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
    />
  ) : (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 ring-4 ring-white">
      {initials}
    </div>
  )}

  <label
    htmlFor="profile-image"
    className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-md transition hover:bg-slate-800"
  >
    {uploadingImage ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <Camera size={16} />
    )}
  </label>

  <input
    id="profile-image"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={handleImageUpload}
    disabled={uploadingImage}
  />
</div>

                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-slate-950">
                    {profile.name || "Citizen"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.email}
                  </p>

                  <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle
                    size={19}
                    className="text-red-500"
                  />

                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={19}
                    className="text-emerald-600"
                  />

                  <p className="text-sm font-medium text-emerald-700">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {/* Personal Information */}
            <form
              onSubmit={handleSave}
              className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 p-6">
                <h2 className="font-bold text-slate-950">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal details.
                </p>
              </div>

              <div className="space-y-5 p-6">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Email address cannot be changed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end border-t border-slate-200 p-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Account Information */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="font-bold text-slate-950">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information about your CivicConnect account.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-3">
                    <Shield
                      size={19}
                      className="text-slate-400"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Account Role
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Your CivicConnect access level
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {profile.role}
                  </span>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Sign-in Provider
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      How you created your account
                    </p>
                  </div>

                  <span className="text-sm font-medium capitalize text-slate-700">
                    {profile.provider}
                  </span>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Member Since
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Account creation date
                    </p>
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {new Date(
                      profile.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
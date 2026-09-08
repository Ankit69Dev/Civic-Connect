"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileText,
  Loader2,
  MapPin,
  Send,
} from "lucide-react";

import CitizenSidebar from "@/components/SideBar";

type Department = {
  id: string;
  name: string;
  icon: string | null;
};

type FormData = {
  title: string;
  description: string;
  departmentId: string;
  priority: string;
  address: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_LATITUDE = 25.5941;
const DEFAULT_LONGITUDE = 85.1376;

export default function ReportPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    departmentId: "",
    priority: "normal",
    address: "",
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
  });

  useEffect(() => {
    loadDepartments();
    getLocation();
  }, []);

  async function loadDepartments() {
    try {
      setLoadingDepartments(true);

      const response = await fetch("/api/departments", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load departments");
      }

      const data = await response.json();

      setDepartments(data.departments ?? []);
    } catch (error) {
      console.error("Departments loading error:", error);
      setError("Unable to load departments.");
    } finally {
      setLoadingDepartments(false);
    }
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setFormData((previous) => ({
        ...previous,
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      }));

      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((previous) => ({
          ...previous,
          latitude,
          longitude,
        }));

        await reverseGeocode(latitude, longitude);

        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);

        setLoadingLocation(false);

        setFormData((previous) => ({
          ...previous,
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  async function reverseGeocode(
    latitude: number,
    longitude: number
  ) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const address =
        data.display_name ||
        [
          data.address?.road,
          data.address?.city,
          data.address?.state,
        ]
          .filter(Boolean)
          .join(", ");

      if (address) {
        setFormData((previous) => ({
          ...previous,
          address,
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  }

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setError("");
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter an issue title.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    if (!formData.departmentId) {
      setError("Please select a department.");
      return;
    }

    if (!formData.address.trim()) {
      setError("Please provide the issue location.");
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Image upload is intentionally not connected yet.
       * The selected image is currently used only for preview.
       *
       * When you connect Cloudinary/S3/etc., upload the file here
       * and send the resulting image URL as imageUrl.
       */
      const imageUrl = null;

      const response = await fetch("/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          departmentId: formData.departmentId,
          priority: formData.priority,
          address: formData.address.trim(),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to submit the issue."
        );
      }

      setSuccess("Issue reported successfully!");

      setFormData({
        title: "",
        description: "",
        departmentId: "",
        priority: "normal",
        address: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      removeImage();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error) {
      console.error("Issue submission error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while reporting the issue."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Reusable Sidebar */}
      <CitizenSidebar />

      {/* Main Content */}
      <main className="min-h-screen lg:ml-72">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            

            <div>
              <p className="mb-1 text-sm font-medium text-slate-500">
                CivicConnect
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Report an Issue
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                Help improve your community by reporting a civic
                issue to the appropriate department.
              </p>
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">{success}</p>

                <p className="mt-1 text-sm text-green-700">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
              {/* Form */}
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-100 p-2.5">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-950">
                        Issue Details
                      </h2>

                      <p className="text-sm text-slate-500">
                        Tell us what needs attention.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Issue Title
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Large pothole on Main Road"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required
                    />
                  </div>

                  {/* Department + Priority */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="departmentId"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Department
                        <span className="ml-1 text-red-500">*</span>
                      </label>

                      <select
                        id="departmentId"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                        disabled={loadingDepartments}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
                        required
                      >
                        <option value="">
                          {loadingDepartments
                            ? "Loading departments..."
                            : "Select department"}
                        </option>

                        {departments.map((department) => (
                          <option
                            key={department.id}
                            value={department.id}
                          >
                            {department.icon
                              ? `${department.icon} `
                              : ""}
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="priority"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Priority
                      </label>

                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Description
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the problem, where it is located, and any other useful details..."
                      rows={7}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      required
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Be as specific as possible so the department
                      can understand the problem quickly.
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Issue Location
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter the location of the issue"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                        required
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-slate-400">
                        Coordinates:{" "}
                        {formData.latitude.toFixed(5)},{" "}
                        {formData.longitude.toFixed(5)}
                      </p>

                      <button
                        type="button"
                        onClick={getLocation}
                        disabled={loadingLocation}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-950 disabled:opacity-50"
                      >
                        {loadingLocation ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <MapPin size={14} />
                        )}

                        Use my current location
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Photo Evidence
                    </label>

                    {!imagePreview ? (
                      <label
                        htmlFor="image"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <div className="mb-3 rounded-full bg-slate-100 p-3">
                          <Camera
                            size={24}
                            className="text-slate-500"
                          />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          Upload a photo
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          PNG, JPG or WEBP — maximum 5 MB
                        </p>

                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative overflow-hidden rounded-xl border border-slate-200">
                        <img
                          src={imagePreview}
                          alt="Issue preview"
                          className="max-h-[350px] w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute right-3 top-3 rounded-lg bg-black/70 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="border-t border-slate-100 pt-6">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {submitting ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Report
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* Summary Sidebar */}
              <aside className="h-fit space-y-6">
                {/* Preview */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-bold text-slate-950">
                      Report Summary
                    </h2>
                  </div>

                  <div className="space-y-5 p-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Title
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {formData.title || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Department
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {departments.find(
                          (department) =>
                            department.id === formData.departmentId
                        )?.name || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Priority
                      </p>

                      <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                        {formData.priority}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Location
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {formData.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information */}
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-white/10 p-2.5">
                      <MapPin size={19} />
                    </div>

                    <h2 className="font-bold">
                      Why location matters
                    </h2>
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    Accurate location information helps the relevant
                    department find and resolve your complaint faster.
                  </p>
                </div>

                {/* Process */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="font-bold text-slate-950">
                    What happens next?
                  </h2>

                  <div className="mt-5 space-y-5">
                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        1
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Report submitted
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Your complaint is added to CivicConnect.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        2
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Department review
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          The appropriate department reviews the
                          issue.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        3
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          Resolution
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Track the complaint until it is resolved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
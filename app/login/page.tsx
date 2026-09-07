"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sprout,
  User,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const IMAGE_URL =
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85";

  const resetMessages = () => setError("");

  const handleEmailSubmit = async () => {
    resetMessages();

    if (mode === "register") {
      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed.");
          setLoading(false);
          return;
        }

        // auto sign-in right after registering
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        setLoading(false);
        if (result?.error) {
          setError("Account created — please log in.");
          setMode("login");
        } else {
          router.push("/");
          router.refresh();
        }
      } catch {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      }
      return;
    }

    // login
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handlePhoneLogin = () => {
    setOtpSent(true);
  };

  return (
    <main className="min-h-screen bg-mist">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================================================= */}
        {/* LEFT SIDE — AUTH CARD */}
        {/* ================================================= */}
        <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-20">
          <a
            href="/"
            className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-medium text-ink/70 shadow-sm transition-all hover:-translate-x-0.5 hover:border-ink/20 hover:text-ink sm:left-10 lg:left-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>

          <div className="w-full max-w-md pt-10">
            <a href="/" className="mb-8 flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-civic-green/10 ring-1 ring-civic-green/20">
                <Sprout className="h-6 w-6 text-civic-green" strokeWidth={2.25} />
              </span>
              <span className="font-display leading-tight text-ink">
                <span className="block text-lg font-semibold">CivicConnect</span>
                <span className="block text-[11px] font-medium text-ink/50">
                  Cleaner Cities, Brighter Future
                </span>
              </span>
            </a>

            <div className="mb-7">
              <p className="mb-2 text-sm font-medium text-civic-green">
                Welcome to CivicConnect
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/50">
                {mode === "login"
                  ? "Login to continue reporting and tracking civic issues."
                  : "Join your community and help make your city better."}
              </p>
            </div>

            {/* Login / Register Toggle */}
            <div className="mb-7 flex rounded-xl bg-ink/5 p-1">
              <button
                onClick={() => {
                  setMode("login");
                  setOtpSent(false);
                  resetMessages();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === "login" ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setOtpSent(false);
                  resetMessages();
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  mode === "register" ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink"
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Method */}
            {mode === "login" && (
              <div className="mb-5 flex gap-2">
                <button
                  onClick={() => {
                    setLoginMethod("email");
                    setOtpSent(false);
                    resetMessages();
                  }}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                    loginMethod === "email"
                      ? "border-civic-green bg-civic-green/5 text-civic-green"
                      : "border-ink/10 text-ink/50 hover:border-ink/20"
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => {
                    setLoginMethod("phone");
                    setOtpSent(false);
                    resetMessages();
                  }}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition ${
                    loginMethod === "phone"
                      ? "border-civic-green bg-civic-green/5 text-civic-green"
                      : "border-ink/10 text-ink/50 hover:border-ink/20"
                  }`}
                >
                  Phone Number
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] text-rose-600">
                {error}
              </div>
            )}

            {/* EMAIL LOGIN / REGISTER */}
            {(mode === "register" || loginMethod === "email") && (
              <div className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink">Full name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ankit Pandey"
                        className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-12 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-ink">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-12 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/35 hover:text-ink"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button className="text-xs font-medium text-civic-green hover:underline">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleEmailSubmit}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5 hover:bg-navy/95 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Login to CivicConnect" : "Create Account"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* PHONE LOGIN — still a UI-only dummy flow */}
            {mode === "login" && loginMethod === "phone" && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink">
                        Phone number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handlePhoneLogin}
                      className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5"
                    >
                      Send OTP
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-ink">Enter OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        className="h-12 w-full rounded-xl border border-ink/10 bg-white px-4 text-center text-lg font-semibold tracking-[0.5em] text-ink outline-none focus:border-civic-green focus:ring-4 focus:ring-civic-green/10"
                      />
                      <p className="mt-2 text-xs text-ink/45">
                        Dummy OTP: <strong className="text-civic-green">123456</strong> — phone
                        login isn&apos;t wired to a real SMS provider yet
                      </p>
                    </div>
                    <button
                      type="button"
                      className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-white shadow-panel transition hover:-translate-y-0.5"
                    >
                      Verify OTP
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs font-medium text-civic-green hover:underline"
                    >
                      Change phone number
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-ink/10" />
              <span className="text-xs text-ink/35">OR</span>
              <div className="h-px flex-1 bg-ink/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ink/10 bg-white text-sm font-semibold text-ink transition hover:border-ink/20 hover:bg-ink/[0.02]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-ink/40">
              By continuing, you agree to CivicConnect&apos;s{" "}
              <button className="font-medium text-ink/60 hover:underline">Terms of Service</button>{" "}
              and{" "}
              <button className="font-medium text-ink/60 hover:underline">Privacy Policy</button>.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE — IMAGE (unchanged from your version) */}
        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={IMAGE_URL}
            alt="CivicConnect community"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/65" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
            <div className="flex justify-end">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md">
                Your city. Your voice. Your impact.
              </span>
            </div>
            <div className="max-w-xl">
              <h1 className="font-display text-4xl font-semibold leading-tight text-white xl:text-5xl">
                Together, we can build
                <span className="block text-emerald-300">better cities.</span>
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/65">
                Report civic issues, track their progress, and help your community create cleaner,
                safer and smarter neighborhoods.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75 backdrop-blur">
                  Fast Reporting
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75 backdrop-blur">
                  Transparent Tracking
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75 backdrop-blur">
                  Stronger Communities
                </span>
              </div>
            </div>
            <p className="text-xs text-white/40">Cleaner Cities, Brighter Future</p>
          </div>
        </section>
      </div>
    </main>
  );
}
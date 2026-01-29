"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  studentLogin,
  studentSignup,
  sendStudentOtp,
  verifyStudentOtp,
  resetStudentPassword,
} from "@/lib/api/studentAuth";
import { setToken, getToken } from "@/lib/auth";
import { storeStudentIdFromToken } from "@/lib/studentAuthHelper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BG_IMAGE = "/login_background_02.png";

export default function StudentAuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [stage, setStage] = useState<"auth" | "forgot" | "otp" | "reset">(
    "auth"
  );

  const [std_email, setStdEmail] = useState("");
  const [password, setPassword] = useState("");
  const [std_name, setStdName] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await studentLogin(std_email, password);
      setToken(res.accessToken);
      storeStudentIdFromToken(res.accessToken);
      router.push("/user-portal/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await studentSignup({ std_name, std_email, password });
      setError("");
      setMode("login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendStudentOtp({ std_email });
      setStage("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const otpValue = otp.join("");
      const res = await verifyStudentOtp({ std_email, otp: otpValue });
      setToken(res.accessToken);
      setStage("reset");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("Authentication token missing");
      await resetStudentPassword({ std_email, newPassword }, token);
      storeStudentIdFromToken(token);
      router.push("/user-portal/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const isForgotFlow = stage !== "auth" && mode === "login";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white relative">
      {/* absolute back button */}

      <Link href="/public/home" className="absolute top-4 left-4 cursor-pointer z-10 hidden md:block">
        <button className=" bg-gradient-to-r from-cyan-600 to-sky-700 hover:from-cyan-700 hover:to-sky-800 flex gap-3 items-center cursor-pointer text-white py-1 px-4 rounded-lg">
          <ArrowLeft size={20} />
          Back
        </button>
      </Link>

      {/* ── Form Side ── */}
      <div className="relative flex items-center justify-center min-h-screen sm:px-5 py-0 ">
        {/* Subtle mobile background */}
        <div
          className="absolute inset-0 bg-cover bg-right opacity-[0.3] lg:hidden"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />

        <div className="relative backdrop-blur-[2px] w-full max-w-[420px] md:bg-white sm:rounded-2xl  p-8 md:p-10 lg:shadow-none lg:bg-transparent">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/ace_text.png"
              alt="ACE Institutions"
              className="md:h-16 h-14"
            />
          </div>

          {/* Title */}
          <h1 className="md:text-3xl text-2xl font-bold text-center text-gray-900 mb-2">
            {isForgotFlow
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : "Welcome Back"}
          </h1>

          <p className="text-center text-gray-800 md:text-gray-500 mb-8 text-sm md:text-base">
            {isForgotFlow
              ? "Enter your email to receive OTP"
              : "Join ACE to access exclusive learning content"}
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ── LOGIN ── */}
          {mode === "login" && stage === "auth" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={std_email}
                    onChange={(e) => setStdEmail(e.target.value)}
                    className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStage("forgot")}
                className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 font-medium block ml-auto"
              >
                Forgot password?
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500  to-blue-500 cursor-pointer text-white py-3.5 rounded-lg font-medium  transition-all hover:from-cyan-400 hover:to-blue-400 duration-300"
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium"
                >
                  Create Account
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP ── */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={std_name}
                    onChange={(e) => setStdName(e.target.value)}
                    className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={std_email}
                    onChange={(e) => setStdEmail(e.target.value)}
                    className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="student@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500  to-blue-500 cursor-pointer text-white py-3.5 rounded-lg font-medium transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  Login
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD FLOW ── */}
          {isForgotFlow && (
            <>
              {stage === "forgot" && (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={std_email}
                      onChange={(e) => setStdEmail(e.target.value)}
                      className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                      placeholder="student@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500  to-blue-500 text-white py-3.5 rounded-lg font-medium cursor-pointer transition-all duration-300 hover:from-cyan-400 hover:to-blue-400"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStage("auth")}
                    className="text-sm cursor-pointer text-gray-600 hover:text-gray-800 block mx-auto"
                  >
                    Back to login
                  </button>
                </form>
              )}

              {stage === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="grid grid-cols-6 gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, i)}
                          className="text-center text-xl bg-gray-100 font-semibold border border-gray-300 rounded-lg py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.some((v) => !v)}
                    className="w-full bg-gradient-to-r from-cyan-500  to-blue-500 text-white py-3.5 rounded-lg font-medium  transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 cursor-pointer"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStage("forgot")}
                    className="text-sm text-gray-600 hover:text-gray-800 block mx-auto"
                  >
                    Back
                  </button>
                </form>
              )}

              {stage === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3.5 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500  to-blue-500 text-white py-3.5 rounded-lg font-medium  transition-all duration-300 hover:from-cyan-400 hover:to-blue-400 cursor-pointer"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Background Image Side (desktop only) ── */}
      <div
        className="hidden lg:block bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
    </div>
  );
}

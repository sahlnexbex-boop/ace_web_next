"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/lib/auth";
import { sendOtp, verifyOtp, resetPassword, loginUser } from "@/lib/api/auth";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(user_name, password);
      setToken(res.accessToken);
      router.push("/admin/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendOtp({ email });
      setStage("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const otpValue = otp.join("");
      const res = await verifyOtp({ email, otp: otpValue });
      if (res.message === "OTP verified successfully") {
        setToken(res.accessToken);
        setStage("reset");
      }
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        newPassword
      )
    ) {
      setError("Password must include letters, numbers, and special characters");
      setLoading(false);
      return;
    }
    try {
      const token = getToken();
      if (!token) throw new Error("No token available");
      await resetPassword({ email, newPassword }, token);
      router.push("/admin/protected/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5 && value) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://content3.jdmagicbox.com/comp/malappuram/m4/9999px483.x483.181229205043.a6m4/catalogue/ace-academy-tirur-malappuram-tutorials-95ybkvfk44.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Centered Form */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-white">
        <h2 className="text-3xl font-bold text-center mb-10 tracking-wide">
          {stage === "login"
            ? "Welcome Back to Ace"
            : stage === "forgot"
            ? "Forgot Password"
            : stage === "otp"
            ? "Verify OTP"
            : "Reset Password"}
        </h2>

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        {stage === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setUser_name(e.target.value)}
              className="w-full bg-transparent border border-gray-300/30 rounded p-2 mb-4 text-white placeholder-gray-100"
              placeholder="Your Username"
              required
            />
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-300/30 rounded p-2 text-white placeholder-gray-100 pr-10"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => setStage("forgot")}
                className="text-sm text-blue-300 cursor-pointer mb-10 hover:text-blue-200"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-xl cursor-pointer font-semibold transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {stage === "forgot" && (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-gray-300/30 rounded p-2 mb-4 text-white placeholder-gray-300"
              placeholder="Your Email"
              required
            />
            <div className="text-right">
              <button
                type="button"
                onClick={() => setStage("login")}
                className="text-sm text-blue-300 cursor-pointer mb-10 hover:text-blue-200"
              >
                back to login!
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-xl cursor-pointer font-semibold transition-all"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-12 h-12 text-center bg-transparent border border-gray-300/30 rounded text-lg text-white"
                  maxLength={1}
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded font-semibold transition-all cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {stage === "reset" && (
          <form onSubmit={handleResetSubmit}>
            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-300/30 rounded p-2 text-white placeholder-gray-300 pr-10"
                placeholder="New Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border border-gray-300/30 rounded p-2 text-white placeholder-gray-300 pr-10"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded font-semibold transition-all cursor-pointer"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

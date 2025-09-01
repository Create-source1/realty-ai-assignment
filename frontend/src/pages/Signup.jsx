import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mic } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup(username, email, password);
      alert("Signup successful. Please login.");
      nav("/login");
    } catch (e) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f9ff] to-[#eaeaff] px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {/* Logo and intro */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Voice Notes AI
          </h1>
          <p className="text-gray-600 mt-2">
            Start your intelligent note-taking journey
          </p>
        </div>

        {/* Signup form */}
        <form
          onSubmit={onSubmit}
          className="w-full bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold text-center">Create Account</h1>
          <p className="text-gray-500 text-sm text-center -mt-2">
            Join thousands of users transforming their voice into smart notes
          </p>

          {/* Full Name */}
          <input
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            placeholder="Enter your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Email */}
          <input
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <input
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirm Password */}
          <input
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

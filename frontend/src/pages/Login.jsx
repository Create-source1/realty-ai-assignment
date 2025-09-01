import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mic } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f9ff] to-[#eaeaff] px-4">
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
          Transform your voice into intelligent notes
        </p>
      </div>

      {/* Login form */}
      <form
        onSubmit={onSubmit}
        className="w-full bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4"
      >
        {/* Heading */}
        <h1 className="text-2xl font-bold text-purple-600 text-center">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm text-center -mt-2">
          Sign in to your account to continue
        </p>

        {/* Email input */}
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password input */}
        <input
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}
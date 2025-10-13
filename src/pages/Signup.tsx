import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Brain,
  BarChart3,
  Users,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:5051/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  const services = [
    {
      icon: Brain,
      title: "Online Therapy",
      description:
        "Connect with licensed therapists through secure video sessions tailored to your needs.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: BarChart3,
      title: "Mood Tracking",
      description:
        "Monitor your emotional wellbeing with intelligent insights and personalized recommendations.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join supportive communities and connect with others on similar journeys.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: MessageCircle,
      title: "AI Chat Assistant",
      description:
        "24/7 AI-powered support for immediate guidance and coping strategies.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: BookOpen,
      title: "Mental Health Resources",
      description:
        "Access evidence-based articles, videos, exercises, and tools for your wellness journey.",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Signup Form */}
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white rounded-xl shadow-xl p-8">
              <div>
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                  Create Your Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Join MindCare and start your wellness journey
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm\" color="text-white" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      to="/login1"
                      className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                      Sign in here
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Side - Services Information */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 lg:p-12 flex items-center">
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Unlock Your Mental Health Journey
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Create your account to access comprehensive mental health support
              services designed for your wellbeing.
            </p>

            <div className="space-y-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                >
                  <div
                    className={`w-10 h-10 ${service.color.replace("text-", "text-white bg-")} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">Join</span>
                <span className="font-bold text-white">10,000+ users</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-blue-100">Get started</span>
                <span className="font-bold text-white">Free today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

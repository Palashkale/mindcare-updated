import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const publicNavLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Contact", path: "/#contact" },
  ];

  const authenticatedNavLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Therapy", path: "/therapy" },
    { name: "Mood Tracking", path: "/mood-tracking" },
    { name: "Community", path: "/community" },
    { name: "AI Chat", path: "/ai-chat" },
    { name: "Resources", path: "/resources" },
  ];

  const navLinks = user ? authenticatedNavLinks : publicNavLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderUserGreeting = () =>
    user && (
      <div className="flex items-center space-x-4">
        <div
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isScrolled || location.pathname !== "/"
              ? "text-gray-900"
              : "text-white"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Hi, {user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2 group"
          >
            <Heart className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span
              className={`text-xl font-bold transition-colors ${
                isScrolled || location.pathname !== "/"
                  ? "text-gray-900"
                  : "text-white"
              }`}
            >
              Mindcare
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path
                    ? "text-blue-600"
                    : isScrolled || location.pathname !== "/"
                      ? "text-gray-900"
                      : "text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              renderUserGreeting()
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    isScrolled || location.pathname !== "/"
                      ? "text-gray-900 hover:text-blue-600"
                      : "text-white hover:text-blue-200"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup1"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled || location.pathname !== "/"
                ? "text-gray-900 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="px-3 py-2 text-base font-medium text-gray-900">
                    Hi, {user.name}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup1"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

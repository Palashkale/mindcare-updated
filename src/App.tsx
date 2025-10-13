import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MedicationReminder from "./pages/Alert";
import Therapy from "./pages/Therapy";
import MoodTracking from "./pages/MoodTracking";
import Community from "./pages/Community";
import CommunityChat from "./pages/CommunityChat";
import AIChat from "./pages/AIChat";
import Resources from "./pages/Resources";
import Game from "./pages/games";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/medication-reminder"
              element={
                <PrivateRoute>
                  <MedicationReminder />
                </PrivateRoute>
              }
            />
            <Route
              path="/therapy"
              element={
                <PrivateRoute>
                  <Therapy />
                </PrivateRoute>
              }
            />
            <Route
              path="/mood-tracking"
              element={
                <PrivateRoute>
                  <MoodTracking />
                </PrivateRoute>
              }
            />
            <Route
              path="/community"
              element={
                <PrivateRoute>
                  <Community />
                </PrivateRoute>
              }
            />
            <Route
              path="/community/:id"
              element={
                <PrivateRoute>
                  <CommunityChat />
                </PrivateRoute>
              }
            />

            <Route
              path="/ai-chat"
              element={
                <PrivateRoute>
                  <AIChat />
                </PrivateRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <PrivateRoute>
                  <Resources />
                </PrivateRoute>
              }
            />
            <Route
              path="/games"
              element={
                <PrivateRoute>
                  <Game />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

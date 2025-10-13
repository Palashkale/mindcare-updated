import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  TrendingUp,
  Users,
  MessageCircle,
  BookOpen,
  Pill,
  Award,
  Gamepad,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AnimatedSection from "../components/AnimatedSection";

interface Booking {
  id: number;
  doctorName: string;
  timeSlot: string;
  bookingDate: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [joinedCommunities, setJoinedCommunities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const quickActions = [
    {
      icon: Calendar,
      title: "Book Session",
      description: "Schedule your next therapy session",
      link: "/therapy",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Track Mood",
      description: "Log your current mood and feelings",
      link: "/mood-tracking",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with supportive peers",
      link: "/community",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: MessageCircle,
      title: "AI Chat",
      description: "Get instant support and guidance",
      link: "/ai-chat",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      icon: Gamepad,
      title: "Games",
      description: "Stress and Anxiety Relief Games",
      link: "/games",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      icon: Pill,
      title: "Medication Manager",
      description: "Track and manage your prescriptions",
      link: "/medication-reminder",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const recentActivity = [
    {
      type: "session",
      title: "Therapy Session with Dr. Sarah",
      date: "2 days ago",
      status: "completed",
    },
    {
      type: "mood",
      title: "Mood Check-in",
      date: "1 day ago",
      status: "logged",
    },
    {
      type: "community",
      title: "Joined Anxiety Support Group",
      date: "3 days ago",
      status: "active",
    },
    {
      type: "resource",
      title: "Completed Mindfulness Exercise",
      date: "1 day ago",
      status: "completed",
    },
  ];

  useEffect(() => {
    const fetchJoinedCommunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5051/api/communities/joined",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setJoinedCommunities(data);
        } else {
          console.error("Failed to fetch joined communities");
        }
      } catch (err) {
        console.error("Error fetching joined communities:", err);
      }
    };

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5051/api/doctors/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchJoinedCommunities();
    fetchBookings();
  }, []);

  const handleLeave = async (communityId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5051/api/communities/${communityId}/leave`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.ok) {
        setJoinedCommunities((prev) =>
          prev.filter((comm) => comm.id !== communityId),
        );
      } else {
        console.error("Failed to leave group");
      }
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };
  const handleMarkAsDone = async (bookingId: number) => {
    try {
      const res = await fetch(
        `http://localhost:5051/api/doctors/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      } else {
        console.error("Failed to mark session as done");
      }
    } catch (err) {
      console.error("Error marking session as done:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedSection>
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-blue-100 text-lg">
              How are you feeling today? Your wellbeing journey continues here.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      to={action.link}
                      className={`${action.color} text-white p-6 rounded-lg transition-all duration-300 transform hover:scale-105 group`}
                    >
                      <action.icon className="h-8 w-8 mb-3" />
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Recent Activity */}
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {activity.type === "session" && (
                          <Calendar className="h-6 w-6 text-blue-600" />
                        )}
                        {activity.type === "mood" && (
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        )}
                        {activity.type === "community" && (
                          <Users className="h-6 w-6 text-purple-600" />
                        )}
                        {activity.type === "resource" && (
                          <BookOpen className="h-6 w-6 text-orange-600" />
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : activity.status === "logged"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Upcoming Therapy Sessions
                </h2>

                {loadingBookings ? (
                  <p className="text-gray-500 text-sm">Loading...</p>
                ) : bookings.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No upcoming sessions found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border-l-4 border-blue-500 pl-4 py-2 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.doctorName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.timeSlot} —{" "}
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `http://localhost:5051/api/doctors/bookings/${booking.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                  },
                                },
                              );
                              if (res.ok) {
                                setBookings((prev) =>
                                  prev.filter((b) => b.id !== booking.id),
                                );
                              } else {
                                console.error("Failed to delete booking");
                              }
                            } catch (err) {
                              console.error("Error deleting booking", err);
                            }
                          }}
                          className="text-xs text-red-600 hover:text-red-800 hover:underline"
                        >
                          Mark as Done
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Joined Communities */}
            <AnimatedSection delay={250}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Joined Communities
                </h2>

                {joinedCommunities.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    You haven't joined any communities yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {joinedCommunities.map((comm) => (
                      <div
                        key={comm.id}
                        className="flex justify-between items-start bg-gray-50 hover:bg-gray-100 transition-all rounded-lg p-5 shadow-sm border border-gray-200"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {comm.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {comm.description}
                          </p>
                          <div className="text-xs text-gray-500 space-x-3">
                            <span>{comm.members} members</span>
                            <span>•</span>
                            <span>Last activity: {comm.lastActivity}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-xs px-3 py-1 font-semibold rounded-full border ${comm.color}`}
                          >
                            {comm.category}
                          </span>
                          <button
                            onClick={() => handleLeave(comm.id)}
                            className="flex items-center gap-1 text-xs mt-1 text-red-600 hover:text-red-700 hover:underline transition"
                          >
                            <LogOut className="h-4 w-4" />
                            Leave Group
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Progress Overview */}
            <AnimatedSection delay={400}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Progress
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Weekly Sessions
                      </span>
                      <span className="text-sm text-gray-500">2/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "67%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Mood Tracking
                      </span>
                      <span className="text-sm text-gray-500">5/7 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "71%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Community Engagement
                      </span>
                      <span className="text-sm text-gray-500">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-yellow-800">
                      Great job this week! You're making excellent progress.
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

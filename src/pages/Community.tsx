import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Filter } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useNavigate } from "react-router-dom";

interface Community {
  id: number;
  name: string;
  members: number;
  category: string;
  description: string;
  lastActivity: string;
  isJoined: boolean;
  color: string;
}

const Community: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [activeTab, setActiveTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch all communities
  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5051/api/communities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch communities:", res.statusText);
        return;
      }

      const data = await res.json();
      setCommunities(data);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    }
  };

  // Join group
  const handleJoin = async (communityId: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5051/api/communities/${communityId}/join`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        const updatedCommunity = await res.json();
        setCommunities((prev) =>
          prev.map((group) =>
            group.id === updatedCommunity.id ? updatedCommunity : group,
          ),
        );
      } else {
        console.error("Failed to join group");
      }
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  // Search handler
  const handleSearch = async (query: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5051/api/communities/search?keyword=${encodeURIComponent(
          query,
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setCommunities(data);
      } catch (parseError) {
        console.error("Invalid JSON response from backend:", parseError, text);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchCommunities();
    } else {
      const delayDebounce = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with others who understand your journey. Share
              experiences, find support, and build meaningful relationships.
            </p>
          </div>
        </AnimatedSection>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["groups"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Group List */}
        <AnimatedSection delay={200}>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search support groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>

              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </button>
            </div>

            {communities.length === 0 && (
              <div className="text-gray-500 text-center py-10">
                No communities found.
              </div>
            )}

            {communities.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/community/${group.id}`)} // ✅ FIXED ROUTE
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {group.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${group.color}`}
                      >
                        {group.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="mr-4">{group.members} members</span>
                      <span>Last activity: {group.lastActivity}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card navigation
                      handleJoin(group.id);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      group.isJoined
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {group.isJoined ? "Joined" : "Join Group"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Community;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { EventSourcePolyfill } from "event-source-polyfill";
import {
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Brain,
  Sun,
  Sparkles,
  Users,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  DotProps,
} from "recharts";

type MoodSummary = { mood: string; count: number };
type MoodHistoryItem = { date: string; mood: number; moodLabel: string };
type Community = {
  id: number;
  name: string;
  description: string;
  members: number;
  category?: string;
  lastActivity?: string;
  color?: string;
  isJoined?: boolean;
};

const moodLabelsMap: Record<number, string> = {
  1: "sad",
  2: "angry",
  3: "neutral",
  4: "happy",
  5: "excited",
};

const moodColors: Record<string, string> = {
  sad: "#ff4d4f",
  neutral: "#d9d9d9",
  happy: "#52c41a",
  excited: "#1890ff",
  angry: "#fa8c16",
};

const MoodIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  sad: Frown,
  neutral: Meh,
  happy: Smile,
  excited: Smile,
  angry: Frown,
};

const MoodDot = (props: DotProps & { moodLabel?: string }) => {
  const { cx, cy, moodLabel } = props;
  if (cx === undefined || cy === undefined || !moodLabel) return null;
  const Icon = MoodIconMap[moodLabel] || Meh;
  const color = moodColors[moodLabel] || "#888";

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="white"
        stroke={color}
        strokeWidth={2}
      />
      <Icon x={cx - 8} y={cy - 8} width={16} height={16} color={color} />
    </g>
  );
};

const MoodTracking = () => {
  const [summary, setSummary] = useState<MoodSummary[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodHistoryItem[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [noteText, setNoteText] = useState("");
  const [dailyTip, setDailyTip] = useState("");
  const [suggestedCommunities, setSuggestedCommunities] = useState<Community[]>(
    [],
  );

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get("http://localhost:5051/api/mood-summary", config)
      .then((res) => {
        const data = Object.entries(res.data).map(([mood, count]) => ({
          mood,
          count,
        }));
        setSummary(data);
      })
      .catch((err) => console.error("Error fetching mood summary:", err));
  }, []);

  const listenToDailyTipStream = () => {
    setDailyTip("");
    const token = localStorage.getItem("token");

    const eventSource = new EventSourcePolyfill(
      "http://localhost:5051/api/daily-tip",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let tipContent = "";

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
      } else if (event.data.startsWith("[ERROR]")) {
        console.error("Error from SSE:", event.data);
        eventSource.close();
      } else {
        tipContent += event.data;
        setDailyTip(tipContent);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };
  };

  const fetchSuggestedCommunities = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5051/api/communities/suggested",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuggestedCommunities(res.data || []);
    } catch (err) {
      console.error("Error fetching suggested communities:", err);
    }
  };

  const handleJoinCommunity = async (communityId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("You are not logged in.");
        return;
      }

      await axios.put(
        `http://localhost:5051/api/communities/${communityId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update local state to reflect joined status
      setSuggestedCommunities((prev) =>
        prev.map((community) =>
          community.id === communityId
            ? { ...community, isJoined: true }
            : community,
        ),
      );
    } catch (err) {
      console.error("Error joining community:", err);
    }
  };

  useEffect(() => {
    listenToDailyTipStream();
    fetchSuggestedCommunities();
  }, []);

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor],
    );
  };

  const saveMoodEntry = async () => {
    if (selectedMood === null) {
      alert("Please select a mood before saving.");
      return;
    }

    const payload = {
      date: format(new Date(), "yyyy-MM-dd"),
      mood: selectedMood,
      factors: selectedFactors,
      note: noteText,
    };

    try {
      await axios.post("http://localhost:5051/api/mood", payload, config);
      alert("Mood saved!");
      setSelectedMood(null);
      setSelectedFactors([]);
      setNoteText("");
      fetchMoodHistory();
    } catch (err) {
      alert("Error saving mood");
      console.error(err);
    }
  };

  const fetchMoodHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5051/api/mood", config);
      const dataWithLabels: MoodHistoryItem[] = res.data.map((item: any) => ({
        ...item,
        moodLabel: moodLabelsMap[item.mood] || "neutral",
      }));
      setMoodHistory(dataWithLabels);
    } catch (error) {
      console.error("Failed to fetch mood history:", error);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const moods = [
    {
      value: 1,
      icon: Frown,
      label: "Very Low",
      color: "text-red-500",
      bg: "bg-red-50 hover:bg-red-100",
    },
    {
      value: 2,
      icon: Frown,
      label: "Low",
      color: "text-orange-500",
      bg: "bg-orange-50 hover:bg-orange-100",
    },
    {
      value: 3,
      icon: Meh,
      label: "Neutral",
      color: "text-yellow-500",
      bg: "bg-yellow-50 hover:bg-yellow-100",
    },
    {
      value: 4,
      icon: Smile,
      label: "Good",
      color: "text-green-500",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      value: 5,
      icon: Smile,
      label: "Excellent",
      color: "text-blue-500",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
  ];

  const factors = [
    "Sleep Quality",
    "Exercise",
    "Work Stress",
    "Relationships",
    "Weather",
    "Nutrition",
    "Social Activities",
    "Meditation",
    "Medication",
    "Health Issues",
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: "Mood Trend",
      description:
        "Your mood has improved by 15% this week compared to last week.",
      color: "text-green-600",
    },
    {
      icon: Sun,
      title: "Pattern Detected",
      description: "You tend to feel better on days when you exercise.",
      color: "text-blue-600",
    },
    {
      icon: Brain,
      title: "Recommendation",
      description:
        "Maintain your current sleep schedule – it correlates with better moods.",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mood Tracking
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track your daily emotions and discover patterns to better
              understand your mental wellbeing.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection delay={100}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  How are you feeling today?
                </h2>
                <div className="grid grid-cols-5 gap-4 mb-8">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        selectedMood === mood.value
                          ? `${mood.bg} ring-2 ring-offset-2 ring-blue-500`
                          : mood.bg
                      }`}
                    >
                      <mood.icon
                        className={`h-8 w-8 mx-auto mb-2 ${mood.color}`}
                      />
                      <span className="block text-sm font-medium text-gray-700">
                        {mood.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    What's influencing your mood today?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {factors.map((factor) => (
                      <button
                        key={factor}
                        onClick={() => toggleFactor(factor)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedFactors.includes(factor)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What's on your mind today?"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                </div>

                <button
                  disabled={!selectedMood}
                  onClick={saveMoodEntry}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Today's Mood
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Mood Progress
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodHistory}>
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[0, 6]}
                      ticks={[1, 2, 3, 4, 5]}
                      tickFormatter={(tick) => moodLabelsMap[tick] || tick}
                    />
                    <Tooltip
                      formatter={(value: any, name: string) =>
                        name === "mood" ? moodLabelsMap[value] || value : value
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={(props) => (
                        <MoodDot
                          {...props}
                          moodLabel={moodHistory[props.index]?.moodLabel}
                        />
                      )}
                      activeDot={{ r: 20 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <AnimatedSection delay={300}>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Insights & Patterns
                </h2>
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <insight.icon
                          className={`h-5 w-5 ${insight.color} mr-3 mt-0.5`}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">
                            {insight.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <Sparkles className="h-8 w-8 mb-4" />
                <h2 className="text-xl font-semibold mb-3">Daily Mood Tip</h2>
                {dailyTip?.trim().length > 0 ? (
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {dailyTip}
                  </p>
                ) : (
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Loading personalized tip...
                  </p>
                )}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex items-center mb-4">
                  <Users className="text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Suggested Communities
                  </h2>
                </div>
                {Array.isArray(suggestedCommunities) &&
                suggestedCommunities.length > 0 ? (
                  <ul className="space-y-4">
                    {suggestedCommunities.map((community, index) => (
                      <li
                        key={index}
                        className="border p-4 rounded-md hover:shadow-md transition"
                      >
                        <h3 className="text-blue-700 font-medium">
                          {community.name}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                          {community.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {community.members} members
                          </span>
                          {community.isJoined ? (
                            <button
                              className="text-sm bg-green-100 text-green-700 font-medium px-3 py-1 rounded cursor-default"
                              disabled
                            >
                              Joined Successfully
                            </button>
                          ) : (
                            <button
                              className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                              onClick={() => handleJoinCommunity(community.id)}
                            >
                              Join
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No community suggestions yet.
                  </p>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;

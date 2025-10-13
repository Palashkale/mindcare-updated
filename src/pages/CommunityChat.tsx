import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  lastActivity: string;
  color: string;
}

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
}

const CommunityChat = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5051/api/communities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCommunity(res.data);
      } catch (error: any) {
        console.error("Failed to fetch community", error);
        if (error.response?.status === 401) {
          alert("Unauthorized. Please log in again.");
        }
      }
    };

    fetchCommunity();
  }, [id]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: messages.length + 1,
      text: input,
      sender: "You",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="pt-24 px-4 pb-4 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {community ? (
        <div className="flex flex-col max-w-4xl mx-auto h-[85vh] rounded-2xl shadow-2xl bg-white overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-6 sticky top-0 z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {community.name}
                </h2>
                <p className="text-indigo-100 text-base leading-relaxed mb-4 max-w-2xl">
                  {community.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-lg">👥</span>
                <span className="font-medium">
                  {community.members.toLocaleString()} Members
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-lg">🏷️</span>
                <span className="font-medium">{community.category}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-lg">🕒</span>
                <span className="font-medium">
                  {new Date(community.lastActivity).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-50/50 to-white space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No messages yet
                </h3>
                <p className="text-slate-500 max-w-md">
                  Be the first to start the conversation in this community!
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex flex-col max-w-md">
                    <div
                      className={`rounded-2xl px-5 py-3 shadow-sm ${
                        msg.sender === "You"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white ml-auto"
                          : "bg-white text-slate-800 border border-slate-200"
                      }`}
                    >
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          msg.sender === "You"
                            ? "text-indigo-100"
                            : "text-slate-500"
                        }`}
                      >
                        {msg.sender}
                      </div>
                      <div className="text-sm leading-relaxed">{msg.text}</div>
                    </div>
                    <div
                      className={`text-xs text-slate-400 mt-1 px-2 ${
                        msg.sender === "You" ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-slate-200">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full border-2 border-slate-200 px-5 py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400"
                  placeholder="Type your message..."
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"></div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Loading community...
          </h3>
          <p className="text-slate-500">
            Please wait while we fetch the community details
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityChat;

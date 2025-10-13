import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Star,
  Video,
  MessageCircle,
  User,
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  bio: string;
  availability: string[];
}

const Therapy: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchTherapists = async () => {
      const token = localStorage.getItem("token"); // make sure the token is stored during login
      if (!token) {
        console.error("No auth token found.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5051/api/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(res.data)) {
          setTherapists(res.data);
        } else {
          setTherapists([]);
          console.error("Therapists data is not an array", res.data);
        }
      } catch (err) {
        console.error("Failed to load therapists", err);
      }
    };

    fetchTherapists();
  }, []);

  const handleBooking = async () => {
    if (!selectedTherapist || !selectedTime) {
      setMessage("❌ Please select a therapist and a time.");
      return;
    }

    const token = localStorage.getItem("token"); // or useAuth().token if you use context

    if (!token) {
      setMessage("❌ User not authenticated.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5051/api/doctors/book",
        {
          doctorId: selectedTherapist.id,
          time: selectedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage("Session booked successfully!");
    } catch (error) {
      console.error("Booking failed", error);
      setMessage("❌ Failed to book session.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Therapy Sessions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with licensed therapists who understand your journey and
              are here to support your mental health goals.
            </p>
          </div>
        </AnimatedSection>

        {/* Session Types */}

        {/* Therapists */}
        <AnimatedSection delay={200}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose Your Therapist
            </h2>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-300 ${
                    selectedTherapist?.id === therapist.id
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    setSelectedTherapist(therapist);
                    setSelectedTime(null);
                    setMessage("");
                  }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={therapist.image}
                      alt={therapist.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {therapist.name}
                      </h3>
                      <p className="text-blue-600 text-sm font-medium">
                        {therapist.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-4">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {therapist.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({therapist.reviews} reviews)
                    </span>
                    <span className="ml-auto text-sm text-gray-500">
                      {therapist.experience}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{therapist.bio}</p>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Next Available:
                    </p>
                    <div className="space-y-1">
                      {therapist.availability.slice(0, 2).map((slot, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Booking Section */}
        {selectedTherapist && (
          <AnimatedSection delay={300}>
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Book Your Session
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Therapist Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Selected Therapist
                  </h3>
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <img
                      src={selectedTherapist.image}
                      alt={selectedTherapist.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedTherapist.name}
                      </h4>
                      <p className="text-sm text-blue-600">
                        {selectedTherapist.specialty}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
                    Available Times
                  </h3>
                  <div className="space-y-2">
                    {selectedTherapist.availability.map((slot, idx) => (
                      <button
                        key={idx}
                        className={`w-full text-left p-3 border rounded-lg ${
                          selectedTime === slot
                            ? "bg-blue-100 border-blue-500"
                            : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Session Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Session Details
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">
                          Individual Therapy
                        </span>
                        <span className="font-medium">₹1200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Duration</span>
                        <span className="font-medium">50 minutes</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Secure Messaging
                      </div>
                    </div>

                    <button
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      onClick={handleBooking}
                    >
                      Book Session - ₹1200
                    </button>

                    <p className="text-sm text-center text-blue-500 mt-2">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Features */}
        <AnimatedSection delay={400}>
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Why Choose Our Therapy Platform?
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Video,
                  title: "HD Video Sessions",
                  description:
                    "Crystal clear video calls with secure encryption",
                },
                {
                  icon: Calendar,
                  title: "Flexible Scheduling",
                  description: "Book sessions that fit your schedule, 24/7",
                },
                {
                  icon: User,
                  title: "Licensed Professionals",
                  description: "All therapists are fully licensed and verified",
                },
                {
                  icon: MessageCircle,
                  title: "Secure Messaging",
                  description: "Communicate safely between sessions",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-sm"
                >
                  <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Therapy;

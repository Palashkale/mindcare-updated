import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPills,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  dosageTime: string;
  startDate: string;
  endDate: string;
  instructions: string;
  prescribedBy: string;
  active: boolean;
  taken: boolean;
  lastTakenDate: string | null;
  emailNotification: boolean;
  escalateAfterHours: number;
  missed?: boolean;
}

const API_BASE_URL = "http://localhost:5051/api";

const PatientMedicationManagement: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [newMedication, setNewMedication] = useState<
    Omit<Medication, "id" | "taken" | "lastTakenDate" | "missed">
  >({
    name: "",
    dosage: "",
    frequency: "",
    dosageTime: "",
    startDate: "",
    endDate: "",
    instructions: "",
    prescribedBy: "",
    active: true,
    emailNotification: true,
    escalateAfterHours: 2,
  });

  useEffect(() => {
    if (token) {
      const fetchMedications = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/medications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setMedications(response.data);
        } catch (err) {
          setError("Failed to fetch medications");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchMedications();
    }
  }, [token]);

  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dosage) {
      setError("Name and dosage are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE_URL}/medications`,
        newMedication,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMedications([...medications, response.data]);
      setNewMedication({
        name: "",
        dosage: "",
        frequency: "",
        dosageTime: "",
        startDate: "",
        endDate: "",
        instructions: "",
        prescribedBy: "",
        active: true,
        emailNotification: true,
        escalateAfterHours: 2,
      });
      setError("");
    } catch (err) {
      setError("Failed to add medication");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (medicationId: number) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/medications/${medicationId}/mark-taken`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const today = new Date().toISOString().split("T")[0];
      setMedications(
        medications.map((med) =>
          med.id === medicationId
            ? { ...med, taken: true, lastTakenDate: today, missed: false }
            : med,
        ),
      );
    } catch (err) {
      setError("Failed to mark medication as taken");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateMedication = async (medicationId: number) => {
    try {
      setLoading(true);
      await axios.patch(
        `${API_BASE_URL}/medications/${medicationId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMedications(
        medications.map((med) =>
          med.id === medicationId ? { ...med, active: false } : med,
        ),
      );
    } catch (err) {
      setError("Failed to deactivate medication");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTimeString = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getTodayDateString = () => new Date().toISOString().split("T")[0];

  // Keep these functions for internal logic but don't use them in UI
  const getDueMedications = () => {
    const now = new Date();
    const currentTime = getTimeString(now);
    const today = getTodayDateString();

    return medications.filter(
      (med) =>
        med.active &&
        med.dosageTime === currentTime &&
        med.startDate <= today &&
        med.endDate >= today &&
        (!med.taken || med.lastTakenDate !== today),
    );
  };

  const getMissedMedications = () => {
    if (medications.some((med) => med.missed !== undefined)) {
      return medications.filter((med) => med.missed);
    }

    const now = new Date();
    const currentTime = getTimeString(now);
    const today = getTodayDateString();

    return medications.filter((med) => {
      const medTime = med.dosageTime;
      return (
        med.active &&
        medTime < currentTime &&
        med.startDate <= today &&
        med.endDate >= today &&
        (!med.taken || med.lastTakenDate !== today)
      );
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMedications([...medications]);
    }, 60000);

    return () => clearInterval(interval);
  }, [medications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaPills className="mr-3 text-blue-600" />
            <span>Medication Management</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your medications and track your doses
          </p>
        </header>

        {/* Add Medication Section */}
        <section className="mb-10 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-800 flex items-center">
              <FaPlus className="mr-2 text-blue-600" /> Add New Medication
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., Ibuprofen"
                  required
                />
              </div>

              {/* Dosage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage *
                </label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosage: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., 200mg"
                  required
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="e.g., Every 6 hours"
                />
              </div>

              {/* Dosage Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaClock className="mr-2 text-gray-500" /> Dosage Time
                </label>
                <input
                  type="time"
                  value={newMedication.dosageTime}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      dosageTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> Start Date
                </label>
                <input
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      startDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> End Date
                </label>
                <input
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              {/* Prescribed By */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaUserMd className="mr-2 text-gray-500" /> Prescribed By
                </label>
                <input
                  type="text"
                  value={newMedication.prescribedBy}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      prescribedBy: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Doctor's name"
                />
              </div>

              {/* Instructions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2 text-gray-500" /> Special
                  Instructions
                </label>
                <textarea
                  value={newMedication.instructions}
                  onChange={(e) =>
                    setNewMedication({
                      ...newMedication,
                      instructions: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows={3}
                  placeholder="Any special instructions for taking this medication"
                />
              </div>

              {/* Notification Settings */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotification"
                    checked={newMedication.emailNotification}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        emailNotification: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="emailNotification"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Enable Email Notifications
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Escalate After (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMedication.escalateAfterHours}
                    onChange={(e) =>
                      setNewMedication({
                        ...newMedication,
                        escalateAfterHours: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleAddMedication}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors shadow-md"
            >
              <FaPlus className="mr-2" /> Add Medication
            </button>
          </div>
        </section>

        {/* Medication List Section */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">
              Your Active Medications
            </h2>

            {medications.filter((m) => m.active).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Medication
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Schedule
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medications
                      .filter((m) => m.active)
                      .map((med) => (
                        <tr key={med.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {med.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {med.dosage}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {med.prescribedBy}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {med.instructions}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FaClock className="mr-2 text-gray-400" />
                              <span>{med.dosageTime}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <FaCalendarAlt className="mr-2 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {med.startDate} to {med.endDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {med.taken &&
                            med.lastTakenDate ===
                              new Date().toISOString().split("T")[0] ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaCheck className="mr-1" /> Taken today
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleMarkAsTaken(med.id)}
                                className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                                title="Mark as taken"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeactivateMedication(med.id)
                                }
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                title="Deactivate"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <FaPills size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No active medications
                </h3>
                <p className="text-gray-500">Add medications to get started</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PatientMedicationManagement;

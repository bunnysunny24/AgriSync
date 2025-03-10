import React, { useState, useEffect } from "react";
import { registerStorage, updateAvailability, getFarmerSlots } from "./web3";
import { animate, AnimatePresence, MotionConfig } from "framer-motion";

const StorageForm = () => {
    const [capacity, setCapacity] = useState("");
    const [slotId, setSlotId] = useState("");
    const [available, setAvailable] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [activeTab, setActiveTab] = useState("register");

    const fetchSlots = async () => {
        try {
            setLoading(true);
            setError(""); // Clear any previous errors
            const userSlots = await getFarmerSlots();
            if (userSlots && userSlots.length > 0) {
                setSlots(userSlots);
            } else {
                setSlots([]);
            }
        } catch (error) {
            setError("❌ Error fetching storage slots. Check console for details.");
            console.error("❌ Fetch Slots Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleRegister = async () => {
        if (!capacity || capacity <= 0) {
            setError("⚠️ Please enter a valid capacity!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await registerStorage(Number(capacity));
            showSuccessMessage("✅ Storage Registered!");
            setCapacity(""); 
            fetchSlots(); 
        } catch (error) {
            setError("❌ Registration Failed. Check console for details.");
            console.error("❌ Register Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!slotId || slotId < 0 || !available || available < 0) {
            setError("⚠️ Please enter a valid Slot ID and availability!");
            return;
        }
        try {
            setLoading(true);
            setError("");
            await updateAvailability(Number(slotId), Number(available));
            showSuccessMessage("✅ Storage Availability Updated!");
            setSlotId("");
            setAvailable("");
            fetchSlots(); 
        } catch (error) {
            setError("❌ Update Failed. Check console for details.");
            console.error("❌ Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <MotionConfig transition={{ duration: 0.3 }}>
                <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-smart-green text-smart-yellow p-6">
                        <h1 className="text-2xl font-bold flex items-center">
                            <span className="mr-2">📦</span> SmartStorage Management
                        </h1>
                        <p className="text-white/80 mt-2">Decentralized storage solution on the blockchain</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b">
                        <button 
                            className={`px-4 py-3 flex-1 font-medium ${activeTab === "register" ? "text-smart-green border-b-2 border-smart-yellow" : "text-gray-500"}`}
                            onClick={() => setActiveTab("register")}
                        >
                            Register Storage
                        </button>
                        <button 
                            className={`px-4 py-3 flex-1 font-medium ${activeTab === "update" ? "text-smart-green border-b-2 border-smart-yellow" : "text-gray-500"}`}
                            onClick={() => setActiveTab("update")}
                        >
                            Update Availability
                        </button>
                        <button 
                            className={`px-4 py-3 flex-1 font-medium ${activeTab === "view" ? "text-smart-green border-b-2 border-smart-yellow" : "text-gray-500"}`}
                            onClick={() => setActiveTab("view")}
                        >
                            View Slots
                        </button>
                    </div>

                    <AnimatePresence>
                        {successMessage && (
                            <div 
                                className="bg-green-50 text-green-800 px-4 py-3 border-l-4 border-green-500 m-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {successMessage}
                            </div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {error && (
                            <div 
                                className="bg-red-50 text-red-800 px-4 py-3 border-l-4 border-red-500 m-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                {error}
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="p-6">
                        {activeTab === "register" && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-smart-green">Register New Storage Slot</h2>
                                <div className="space-y-2">
                                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                                        Storage Capacity (GB)
                                    </label>
                                    <input
                                        id="capacity"
                                        type="number"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        placeholder="Enter Capacity"
                                        min="1"
                                        disabled={loading}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-yellow focus:border-smart-yellow transition"
                                    />
                                </div>
                                <button 
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-smart-green text-white hover:bg-opacity-90 active:transform active:scale-95'}`}
                                >
                                    {loading ? 'Processing...' : 'Register Storage'}
                                </button>
                            </div>
                        )}

                        {activeTab === "update" && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-smart-green">Update Storage Availability</h2>
                                <div className="space-y-2">
                                    <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">
                                        Slot ID
                                    </label>
                                    <input
                                        id="slotId"
                                        type="number"
                                        value={slotId}
                                        onChange={(e) => setSlotId(e.target.value)}
                                        placeholder="Enter Slot ID"
                                        min="0"
                                        disabled={loading}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-yellow focus:border-smart-yellow transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                                        Available Space (GB)
                                    </label>
                                    <input
                                        id="available"
                                        type="number"
                                        value={available}
                                        onChange={(e) => setAvailable(e.target.value)}
                                        placeholder="Enter New Availability"
                                        min="0"
                                        disabled={loading}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-yellow focus:border-smart-yellow transition"
                                    />
                                </div>
                                <button 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-smart-green text-white hover:bg-opacity-90 active:transform active:scale-95'}`}
                                >
                                    {loading ? 'Processing...' : 'Update Availability'}
                                </button>
                            </div>
                        )}

                        {activeTab === "view" && (
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-smart-green flex items-center">
                                    <span className="mr-2">📋</span> Your Storage Slots
                                </h2>
                                
                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smart-green"></div>
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="space-y-3">
                                        {slots.map((slot, index) => (
                                            <div 
                                                key={index}
                                                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-gray-50"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ 
                                                    opacity: 1, 
                                                    y: 0,
                                                    transition: { delay: index * 0.1 }
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-smart-green text-white rounded-full mr-3">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-smart-green">Slot ID: {slot}</h3>
                                                        <p className="text-sm text-gray-500">Click to view details</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <div className="text-4xl mb-3">📦</div>
                                        <h3 className="text-lg font-medium text-gray-700">No Storage Slots Found</h3>
                                        <p className="text-gray-500 mt-1">Register a new storage slot to get started</p>
                                        <button 
                                            onClick={() => setActiveTab("register")}
                                            className="mt-4 px-4 py-2 bg-smart-yellow text-smart-green rounded-lg font-medium hover:bg-opacity-90 transition"
                                        >
                                            Register Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>SmartStorage Decentralized Network &copy; 2025</p>
                </div>
            </MotionConfig>
        </div>
    );
};

export default StorageForm;
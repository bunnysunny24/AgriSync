import React, { useState, useEffect } from "react";
import { registerStorage, updateAvailability, getFarmerSlots } from "./web3";

const StorageForm = () => {
    const [capacity, setCapacity] = useState("");
    const [slotId, setSlotId] = useState("");
    const [available, setAvailable] = useState("");
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Fetch Farmer Slots on Load & After Update
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

    // ✅ Register Storage Slot
    const handleRegister = async () => {
        if (!capacity || capacity <= 0) {
            alert("⚠️ Please enter a valid capacity!");
            return;
        }
        try {
            setLoading(true);
            await registerStorage(Number(capacity));
            alert("✅ Storage Registered!");
            setCapacity(""); // Reset input
            fetchSlots(); // Refresh slot list
        } catch (error) {
            setError("❌ Registration Failed. Check console for details.");
            console.error("❌ Register Error:", error);
        }
    };

    // ✅ Update Storage Availability
    const handleUpdate = async () => {
        if (!slotId || slotId < 0 || !available || available < 0) {
            alert("⚠️ Please enter a valid Slot ID and availability!");
            return;
        }
        try {
            setLoading(true);
            await updateAvailability(Number(slotId), Number(available));
            alert("✅ Storage Availability Updated!");
            setSlotId("");
            setAvailable("");
            fetchSlots(); // Refresh slot list
        } catch (error) {
            setError("❌ Update Failed. Check console for details.");
            console.error("❌ Update Error:", error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>📦 Register Storage Slot</h2>
            <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter Capacity"
                min="1"
                disabled={loading}
            />
            <button onClick={handleRegister} disabled={loading}>Register</button>

            <h2>🔄 Update Availability</h2>
            <input
                type="number"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                placeholder="Enter Slot ID"
                min="0"
                disabled={loading}
            />
            <input
                type="number"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                placeholder="Enter New Availability"
                min="0"
                disabled={loading}
            />
            <button onClick={handleUpdate} disabled={loading}>Update</button>

            <h2>📋 Your Storage Slots</h2>
            {loading ? (
                <p>⏳ Loading slots...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : slots.length > 0 ? (
                <ul>
                    {slots.map((slot, index) => (
                        <li key={index}>🆔 Slot ID: {slot}</li>
                    ))}
                </ul>
            ) : (
                <p>⚠️ No storage slots found.</p>
            )}
        </div>
    );
};

export default StorageForm;

import React, { useState, useEffect } from "react";
import { registerStorage, updateAvailability, getFarmerSlots } from "./web3";

const StorageForm = () => {
    const [capacity, setCapacity] = useState("");
    const [slotId, setSlotId] = useState("");
    const [available, setAvailable] = useState("");
    const [slots, setSlots] = useState([]);

    // ✅ Fetch Farmer Slots on Load
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const userSlots = await getFarmerSlots();
                if (userSlots && userSlots.length > 0) {
                    setSlots(userSlots);
                } else {
                    console.warn("⚠️ No storage slots found!");
                }
            } catch (error) {
                console.error("❌ Error fetching storage slots:", error);
            }
        };
        fetchSlots();
    }, []);

    // ✅ Register Storage Slot
    const handleRegister = async () => {
        if (!capacity || capacity <= 0) {
            alert("⚠️ Please enter a valid capacity!");
            return;
        }
        try {
            await registerStorage(Number(capacity));
            alert("✅ Storage Registered!");
            setCapacity(""); // Reset Input
        } catch (error) {
            alert("❌ Registration Failed!");
            console.error("Error:", error);
        }
    };

    // ✅ Update Storage Availability
    const handleUpdate = async () => {
        if (!slotId || !available) {
            alert("⚠️ Please enter valid slot ID and availability!");
            return;
        }
        try {
            await updateAvailability(Number(slotId), Number(available));
            alert("✅ Storage Availability Updated!");
            setSlotId("");
            setAvailable("");
        } catch (error) {
            alert("❌ Update Failed!");
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>📦 Register Storage Slot</h2>
            <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter Capacity"
                min="1"
            />
            <button onClick={handleRegister}>Register</button>

            <h2>🔄 Update Availability</h2>
            <input
                type="number"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                placeholder="Enter Slot ID"
                min="0"
            />
            <input
                type="number"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                placeholder="Enter New Availability"
                min="0"
            />
            <button onClick={handleUpdate}>Update</button>

            <h2>📋 Your Storage Slots</h2>
            {slots.length > 0 ? (
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

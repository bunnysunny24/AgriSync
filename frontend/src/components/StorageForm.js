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
            const userSlots = await getFarmerSlots();
            if (userSlots) setSlots(userSlots);
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
            await registerStorage(capacity);
            alert("✅ Storage Registered!");
            setCapacity(""); // Reset Input
        } catch (error) {
            alert("❌ Registration Failed!");
        }
    };

    // ✅ Update Storage Availability
    const handleUpdate = async () => {
        if (!slotId || !available) {
            alert("⚠️ Please enter valid slot ID and availability!");
            return;
        }
        try {
            await updateAvailability(slotId, available);
            alert("✅ Storage Availability Updated!");
            setSlotId("");
            setAvailable("");
        } catch (error) {
            alert("❌ Update Failed!");
        }
    };

    return (
        <div>
            <h2>Register Storage Slot</h2>
            <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter Capacity"
            />
            <button onClick={handleRegister}>Register</button>

            <h2>Update Availability</h2>
            <input
                type="number"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                placeholder="Enter Slot ID"
            />
            <input
                type="number"
                value={available}
                onChange={(e) => setAvailable(e.target.value)}
                placeholder="Enter New Availability"
            />
            <button onClick={handleUpdate}>Update</button>

            <h2>📦 Your Storage Slots</h2>
            <ul>
                {slots.length > 0 ? slots.map((slot, index) => (
                    <li key={index}>Slot ID: {slot}</li>
                )) : <p>No slots found.</p>}
            </ul>
        </div>
    );
};

export default StorageForm;

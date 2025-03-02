import React, { useState } from "react";
import { registerStorage, updateAvailability, getFarmerSlots } from "./web3";

const StorageForm = () => {
    const [capacity, setCapacity] = useState("");

    const handleRegister = async () => {
        await registerStorage(capacity);
        alert("Storage Registered!");
    };

    return (
        <div>
            <h2>Register Storage Slot</h2>
            <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Enter Capacity" />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default StorageForm;

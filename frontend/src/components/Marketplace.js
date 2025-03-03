import React, { useState, useEffect } from "react";
import { listCrop, buyCrop, getCrop } from "./marketplaceWeb3";

const Marketplace = () => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [cropId, setCropId] = useState("");
    const [cropDetails, setCropDetails] = useState(null);

    // ✅ List Crop for Sale
    const handleListCrop = async () => {
        console.log("🔹 Listing Crop: ", name, quantity, price);
    
        if (!name || quantity <= 0 || price <= 0) {
            alert("⚠️ Please enter valid details!");
            return;
        }
    
        try {
            await listCrop(name, Number(quantity), Number(price));
            alert("✅ Crop listed successfully!");
        } catch (error) {
            console.error("❌ Error listing crop:", error);
            alert("❌ Listing Failed: " + error.message);
        }
    };
    

    // ✅ Buy Crop
    const handleBuyCrop = async () => {
        await buyCrop(cropId, cropDetails[4]);
        alert("✅ Crop purchased successfully!");
    };

    // ✅ Fetch Crop Details
    const handleFetchCrop = async () => {
        const crop = await getCrop(cropId);
        setCropDetails(crop);
    };

    return (
        <div>
            <h2>🌾 List a Crop</h2>
            <input type="text" placeholder="Crop Name" onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
            <input type="number" placeholder="Price (wei)" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={handleListCrop}>List Crop</button>

            <h2>🔍 Buy a Crop</h2>
            <input type="number" placeholder="Enter Crop ID" onChange={(e) => setCropId(e.target.value)} />
            <button onClick={handleFetchCrop}>Fetch Crop</button>
            {cropDetails && <button onClick={handleBuyCrop}>Buy Crop</button>}
        </div>
    );
};

export default Marketplace;

import React, { useState, useEffect } from "react";
import { listCrop, buyCrop, getCrop } from "./marketplaceWeb3";
import { 
  animate, 
  AnimatePresence, 
  MotionConfig
} from "framer-motion";

const Marketplace = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [cropId, setCropId] = useState("");
  const [cropDetails, setCropDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState("list"); 
  const [showListSuccess, setShowListSuccess] = useState(false);
  const [showBuySuccess, setShowBuySuccess] = useState(false);

  const handleListCrop = async () => {
    console.log("🔹 Listing Crop: ", name, quantity, price);

    if (!name || quantity <= 0 || price <= 0) {
      alert("⚠️ Please enter valid details!");
      return;
    }

    setLoading(true);
    try {
      await listCrop(name, Number(quantity), Number(price));
      setLoading(false);
      // Reset fields
      setName("");
      setQuantity("");
      setPrice("");
      
      setShowListSuccess(true);
      setTimeout(() => {
        setShowListSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error listing crop:", error);
      alert("❌ Listing Failed: " + error.message);
      setLoading(false);
    }
  };

  const handleBuyCrop = async () => {
    setLoading(true);
    try {
      await buyCrop(cropId, cropDetails[4]);
      setLoading(false);
      setCropDetails(null);
      setCropId("");
      
      setShowBuySuccess(true);
      setTimeout(() => {
        setShowBuySuccess(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error purchasing crop:", error);
      alert("❌ Purchase Failed: " + error.message);
      setLoading(false);
    }
  };

  const handleFetchCrop = async () => {
    if (!cropId) {
      alert("⚠️ Please enter a crop ID!");
      return;
    }
    
    setLoading(true);
    try {
      const crop = await getCrop(cropId);
      setCropDetails(crop);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching crop:", error);
      alert("❌ Fetch Failed: " + error.message);
      setLoading(false);
    }
  };

  const animateIn = (element) => {
    animate(
      element,
      { y: [20, 0], opacity: [0, 1] },
      { duration: 0.5, ease: "easeOut" }
    );
  };

  const animatePress = (element) => {
    animate(
      element,
      { scale: 0.98 },
      { duration: 0.1, ease: "easeOut" }
    ).then(() => {
      animate(
        element,
        { scale: 1 },
        { duration: 0.2, ease: "easeOut" }
      );
    });
  };

  useEffect(() => {
    const currentSection = document.getElementById(section + "-section");
    if (currentSection) {
      animateIn(currentSection);
    }
  }, [section]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <MotionConfig>
        <div 
          id="marketplace-container"
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-smart-green p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="text-smart-yellow">🌾</span>
              <span className="ml-3">
                FarmChain Marketplace
              </span>
            </h1>
            <p className="text-smart-yellow mt-2 opacity-90">Buy and sell crops on the blockchain</p>
          </div>

          {/* the Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSection("list")}
              className={`flex-1 py-4 font-medium text-center transition-all duration-300 ${
                section === "list"
                  ? "text-smart-green border-b-2 border-smart-yellow"
                  : "text-gray-500 hover:text-smart-green"
              }`}
            >
              <div className="flex justify-center items-center">
                <span className="mr-2 text-xl">🌱</span> List Crops
              </div>
            </button>
            <button
              onClick={() => setSection("buy")}
              className={`flex-1 py-4 font-medium text-center transition-all duration-300 ${
                section === "buy"
                  ? "text-smart-green border-b-2 border-smart-yellow"
                  : "text-gray-500 hover:text-smart-green"
              }`}
            >
              <div className="flex justify-center items-center">
                <span className="mr-2 text-xl">🛒</span> Buy Crops
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* edhi List Crop Section */}
            {section === "list" && (
              <div 
                id="list-section"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-smart-green flex items-center">
                  <span className="mr-2">🌾</span> List a Crop
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Crop Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-smart-green"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-smart-green"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="number"
                      placeholder="Price (wei)"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-smart-green"
                    />
                  </div>
                  
                  <button
                    onClick={(e) => {
                      animatePress(e.currentTarget);
                      handleListCrop();
                    }}
                    disabled={loading}
                    className="w-full bg-smart-green hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow-md transform transition-all flex justify-center items-center"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <span className="mr-2">🌱</span> List Crop
                      </>
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {showListSuccess && (
                      <div 
                        className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mt-4"
                        ref={(el) => el && animateIn(el)}
                      >
                        <div className="flex items-center">
                          <div className="py-1">
                            <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold">Success!</p>
                            <p className="text-sm">Your crop has been listed successfully.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* edhi Buy Crop Section */}
            {section === "buy" && (
              <div 
                id="buy-section"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-smart-green flex items-center">
                  <span className="mr-2">🔍</span> Buy a Crop
                </h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <div className="flex-grow">
                      <input
                        type="number"
                        placeholder="Enter Crop ID"
                        value={cropId}
                        onChange={(e) => setCropId(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-smart-green"
                      />
                    </div>
                    
                    <button
                      onClick={(e) => {
                        animatePress(e.currentTarget);
                        handleFetchCrop();
                      }}
                      disabled={loading}
                      className="bg-smart-yellow hover:bg-opacity-90 text-smart-green font-medium py-3 px-6 rounded-lg shadow-md transform transition-all"
                    >
                      {loading ? (
                        <svg className="animate-spin h-5 w-5 text-smart-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <span>🔍 Find</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {cropDetails && (
                      <div
                        className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200"
                        ref={(el) => el && animateIn(el)}
                      >
                        <h3 className="text-xl font-semibold text-smart-green mb-3">Crop Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm">Name</p>
                            <p className="font-medium text-smart-green">{cropDetails[0]}</p>
                          </div>
                          <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm">Quantity</p>
                            <p className="font-medium text-smart-green">{cropDetails[1].toString()}</p>
                          </div>
                          <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm">Price (wei)</p>
                            <p className="font-medium text-smart-green">{cropDetails[2].toString()}</p>
                          </div>
                          <div className="bg-white p-3 rounded-md shadow-sm">
                            <p className="text-gray-500 text-sm">Seller</p>
                            <p className="font-medium text-smart-green truncate">{cropDetails[3]}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            animatePress(e.currentTarget);
                            handleBuyCrop();
                          }}
                          disabled={loading}
                          className="w-full mt-4 bg-smart-green hover:bg-opacity-90 text-white font-medium py-3 px-6 rounded-lg shadow-md transform transition-all flex justify-center items-center"
                        >
                          {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              <span className="mr-2">🛒</span> Buy This Crop
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {showBuySuccess && (
                      <div
                        className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md mt-4"
                        ref={(el) => el && animateIn(el)}
                      >
                        <div className="flex items-center">
                          <div className="py-1">
                            <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold">Purchase Successful!</p>
                            <p className="text-sm">You have successfully purchased this crop.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm border-t">
            <div className="flex justify-center items-center space-x-2">
              <span>🌾</span>
              <span>Powered by FarmChain Technology</span>
              <span>🌱</span>
            </div>
          </div>
        </div>
      </MotionConfig>
    </div>
  );
};

export default Marketplace;
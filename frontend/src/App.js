import React from "react";
import StorageForm from "./components/StorageForm";  // ✅ Check this path
import Marketplace from "./components/Marketplace";  // ✅ Check this path
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🌾 Crop Storage & Marketplace</h1>
        <StorageForm />
        <hr />
        <Marketplace />
      </header>
    </div>
  );
}

export default App;

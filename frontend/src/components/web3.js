import Web3 from "web3";

// ✅ Check if MetaMask is Installed
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" });
} else {
    console.error("❌ MetaMask not detected!");
}

// ✅ Smart Contract Address & ABI
const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
const abi = [ // 🔹 Removed extra brackets
    {
        "inputs": [{"internalType": "uint256","name": "slotId","type": "uint256"}],
        "name": "deactivateSlot",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256","name": "capacity","type": "uint256"}],
        "name": "registerStorage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256","name": "slotId","type": "uint256"},
                   {"internalType": "uint256","name": "newAvailable","type": "uint256"}],
        "name": "updateAvailability",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "farmer","type": "address"}],
        "name": "getFarmerSlots",
        "outputs": [{"internalType": "uint256[]","name": "","type": "uint256[]"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(abi, contractAddress);

// ✅ Register Storage Slot
export const registerStorage = async (capacity) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.registerStorage(capacity).send({ from: accounts[0] });
        console.log("✅ Storage slot registered!");
    } catch (error) {
        console.error("❌ Error registering storage:", error);
    }
};

// ✅ Update Storage Availability
export const updateAvailability = async (slotId, available) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.updateAvailability(slotId, available).send({ from: accounts[0] });
        console.log("✅ Availability updated!");
    } catch (error) {
        console.error("❌ Error updating availability:", error);
    }
};

// ✅ Get Farmer's Storage Slots
export const getFarmerSlots = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const slots = await contract.methods.getFarmerSlots(accounts[0]).call();
        console.log("📦 Your Storage Slots:", slots);
        return slots;
    } catch (error) {
        console.error("❌ Error fetching storage slots:", error);
    }
};
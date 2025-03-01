import Web3 from "web3";

// ✅ Connect to Ethereum (Using Metamask)
const web3 = new Web3(window.ethereum);
await window.ethereum.request({ method: "eth_requestAccounts" });

// ✅ Smart Contract Address & ABI (Paste deployed address & ABI)
const contractAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
const abi = [ /* Contract ABI here */ ];
const contract = new web3.eth.Contract(abi, contractAddress);

// ✅ Register Storage Slot
export const registerStorage = async (capacity) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.registerStorage(capacity).send({ from: accounts[0] });
    console.log("Storage slot registered!");
};

// ✅ Update Storage Availability
export const updateAvailability = async (slotId, available) => {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.updateAvailability(slotId, available).send({ from: accounts[0] });
    console.log("Availability updated!");
};

// ✅ Get Farmer's Storage Slots
export const getFarmerSlots = async () => {
    const accounts = await web3.eth.getAccounts();
    const slots = await contract.methods.getFarmerSlots(accounts[0]).call();
    console.log("Your Storage Slots:", slots);
};

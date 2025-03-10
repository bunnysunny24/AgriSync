import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const contractAddress = "0x00c56AE214FaE7C06560b0Eda2bfBb33784fdA48"; // Update if needed
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "SlotDeactivated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "capacity",
				"type": "uint256"
			}
		],
		"name": "SlotRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "available",
				"type": "uint256"
			}
		],
		"name": "SlotUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "slotId",
				"type": "uint256"
			}
		],
		"name": "deactivateSlot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "farmerSlots",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			}
		],
		"name": "getFarmerSlots",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextSlotId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "capacity",
				"type": "uint256"
			}
		],
		"name": "registerStorage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "storageSlots",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "capacity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "available",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "slotId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newAvailable",
				"type": "uint256"
			}
		],
		"name": "updateAvailability",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]; 

const contract = new web3.eth.Contract(abi, contractAddress);

const getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    return accounts[0]; 
};

export const registerStorage = async (capacity) => {
    try {
        const account = await getAccount();
        console.log("🔹 Sending transaction from:", account);

        await contract.methods.registerStorage(capacity).send({
            from: account,
            gas: 300000,
        });

        console.log("✅ Storage slot registered!");
    } catch (error) {
        console.error("❌ Error registering storage:", error);
    }
};

export const updateAvailability = async (slotId, available) => {
    try {
        const account = await getAccount();
        console.log(`🔹 Updating Slot ID ${slotId} with availability ${available}`);

        await contract.methods.updateAvailability(slotId, available).send({
            from: account,
            gas: 300000,
        });

        console.log("✅ Availability updated!");
    } catch (error) {
        console.error("❌ Error updating availability:", error);
    }
};

export const getFarmerSlots = async () => {
    try {
        const account = await getAccount();
        console.log("🔹 Fetching slots for:", account);

        const slots = await contract.methods.getFarmerSlots(account).call();
        console.log("📦 Your Storage Slots:", slots);
        return slots;
    } catch (error) {
        console.error("❌ Error fetching storage slots:", error);
    }
};

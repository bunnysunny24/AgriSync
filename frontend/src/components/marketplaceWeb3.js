import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));


const contractAddress = "0x1406E4b10DEb8feA28BF50bd4F66DdABF7d9A5F5"; // edhi gaunche lo undi check chey
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "quantity", "type": "uint256" },
            { "internalType": "uint256", "name": "price", "type": "uint256" }
        ],
        "name": "listCrop",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "cropId", "type": "uint256" }],
        "name": "buyCrop",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "cropId", "type": "uint256" }],
        "name": "getCrop",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "address", "name": "", "type": "address" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(abi, contractAddress);

export const listCrop = async (name, quantity, price) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.listCrop(name, quantity, price).send({
            from: accounts[0],
            gas: 300000, 
        });
        console.log("✅ Crop listed for sale!");
    } catch (error) {
        if (error.message.includes("revert")) {
            console.error("❌ Transaction Reverted: ", error.message);
        } else {
            console.error("❌ Error listing crop:", error);
        }
    }
};

export const buyCrop = async (cropId, price) => {
    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.buyCrop(cropId).send({ from: accounts[0], value: price });
        console.log("✅ Crop purchased!");
    } catch (error) {
        console.error("❌ Error buying crop:", error);
    }
};

export const getCrop = async (cropId) => {
    try {
        const crop = await contract.methods.getCrop(cropId).call();
        return crop;
    } catch (error) {
        console.error("❌ Error fetching crop:", error);
    }
};

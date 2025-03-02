const StorageContract = artifacts.require("StorageManagement"); // Change this to your contract name

module.exports = function (deployer) {
    deployer.deploy(StorageContract);
};

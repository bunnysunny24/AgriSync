const StorageContract = artifacts.require("StorageManagement"); 

module.exports = function (deployer) {
    deployer.deploy(StorageContract);
};

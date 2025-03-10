// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Marketplace {
    struct Crop {
        uint id;
        address payable farmer;
        string name;
        uint quantity;
        uint price;
        bool sold;
    }

    uint public nextCropId;
    mapping(uint => Crop) public crops;

    event CropListed(uint id, address farmer, string name, uint quantity, uint price);
    event CropSold(uint id, address buyer);

    function listCrop(string memory name, uint quantity, uint price) public {
        require(quantity > 0, "Quantity must be greater than zero");
        require(price > 0, "Price must be greater than zero");

        crops[nextCropId] = Crop(nextCropId, payable(msg.sender), name, quantity, price, false);
        emit CropListed(nextCropId, msg.sender, name, quantity, price);
        nextCropId++;
    }

    function buyCrop(uint cropId) public payable {
        Crop storage crop = crops[cropId];
        require(!crop.sold, "Crop already sold");
        require(msg.value >= crop.price, "Insufficient payment");

        crop.farmer.transfer(msg.value);
        crop.sold = true;

        emit CropSold(cropId, msg.sender);
    }

    function getCrop(uint cropId) public view returns (uint, address, string memory, uint, uint, bool) {
        Crop memory crop = crops[cropId];
        return (crop.id, crop.farmer, crop.name, crop.quantity, crop.price, crop.sold);
    }
}

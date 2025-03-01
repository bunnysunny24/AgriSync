// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StorageManagement {
    struct StorageSlot {
        uint id;
        address owner;
        uint capacity;
        uint available;
        bool isActive;
    }

    mapping(uint => StorageSlot) public storageSlots;
    mapping(address => uint[]) public farmerSlots;
    uint public nextSlotId;

    event SlotRegistered(uint id, address owner, uint capacity);
    event SlotUpdated(uint id, uint available);
    event SlotDeactivated(uint id);

    // ✅ Register a new storage slot
    function registerStorage(uint capacity) public {
        require(capacity > 0, "Capacity must be greater than zero");
        
        storageSlots[nextSlotId] = StorageSlot(nextSlotId, msg.sender, capacity, capacity, true);
        farmerSlots[msg.sender].push(nextSlotId);
        
        emit SlotRegistered(nextSlotId, msg.sender, capacity);
        nextSlotId++;
    }

    // ✅ Update storage availability (e.g., after usage)
    function updateAvailability(uint slotId, uint newAvailable) public {
        require(storageSlots[slotId].owner == msg.sender, "Unauthorized");
        require(storageSlots[slotId].isActive, "Slot is inactive");
        require(newAvailable <= storageSlots[slotId].capacity, "Invalid availability");

        storageSlots[slotId].available = newAvailable;
        emit SlotUpdated(slotId, newAvailable);
    }

    // ✅ Deactivate storage slot (e.g., if damaged)
    function deactivateSlot(uint slotId) public {
        require(storageSlots[slotId].owner == msg.sender, "Unauthorized");
        require(storageSlots[slotId].isActive, "Slot already inactive");

        storageSlots[slotId].isActive = false;
        emit SlotDeactivated(slotId);
    }

    // ✅ Get farmer's slots
    function getFarmerSlots(address farmer) public view returns (uint[] memory) {
        return farmerSlots[farmer];
    }
}

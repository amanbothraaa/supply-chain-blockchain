// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductAuth {
    struct Location {
        int256 latitude;
        int256 longitude;
        uint256 timestamp;
        string description;
    }

    struct Product {
        uint id;
        string name;
        string description;
        string category;
        string manufacturer;
        uint256 manufacturingDate;
        address currentOwner;
        Location[] locationHistory;
    }

    mapping(uint => Product) public products;
    mapping(address => uint[]) public ownerProducts;
    uint private nextProductId = 1;

    event ProductRegistered(uint id, string name, address owner);
    event OwnershipTransferred(uint id, address previousOwner, address newOwner);
    event LocationUpdated(uint id, int256 latitude, int256 longitude, string description);

    function registerProduct(
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _manufacturer,
        uint256 _manufacturingDate
    ) public {
        uint productId = nextProductId++;
        products[productId] = Product({
            id: productId,
            name: _name,
            description: _description,
            category: _category,
            manufacturer: _manufacturer,
            manufacturingDate: _manufacturingDate,
            currentOwner: msg.sender,
            locationHistory: new Location[](0)
        });

        ownerProducts[msg.sender].push(productId);
        emit ProductRegistered(productId, _name, msg.sender);
    }

    function transferOwnership(uint _productId, address _newOwner) public {
        require(products[_productId].currentOwner == msg.sender, "Not the current owner");
        require(_newOwner != address(0), "Invalid new owner address");

        address previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;
        
        // Remove from previous owner's list
        uint[] storage prevOwnerProducts = ownerProducts[previousOwner];
        for (uint i = 0; i < prevOwnerProducts.length; i++) {
            if (prevOwnerProducts[i] == _productId) {
                prevOwnerProducts[i] = prevOwnerProducts[prevOwnerProducts.length - 1];
                prevOwnerProducts.pop();
                break;
            }
        }
        
        // Add to new owner's list
        ownerProducts[_newOwner].push(_productId);

        emit OwnershipTransferred(_productId, previousOwner, _newOwner);
    }

    function updateLocation(
        uint _productId,
        int256 _latitude,
        int256 _longitude,
        string memory _description
    ) public {
        require(products[_productId].currentOwner == msg.sender, "Not the current owner");
        
        Location memory newLocation = Location({
            latitude: _latitude,
            longitude: _longitude,
            timestamp: block.timestamp,
            description: _description
        });
        
        products[_productId].locationHistory.push(newLocation);
        
        emit LocationUpdated(_productId, _latitude, _longitude, _description);
    }

    function getProduct(uint _productId) public view returns (
        string memory name,
        string memory description,
        string memory category,
        string memory manufacturer,
        uint256 manufacturingDate,
        address owner,
        Location[] memory locationHistory
    ) {
        Product memory product = products[_productId];
        return (
            product.name,
            product.description,
            product.category,
            product.manufacturer,
            product.manufacturingDate,
            product.currentOwner,
            product.locationHistory
        );
    }

    function getOwnerProducts(address _owner) public view returns (uint[] memory) {
        return ownerProducts[_owner];
    }
} 
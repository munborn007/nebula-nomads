// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Nebula Nomads — ERC-721 NFT collection.
 * Supply: 10,000 | Mint price: 0.1 ETH | Max 10 per tx.
 * Test wallet 0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b mints for free.
 */
contract NebulaNomads is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000;
    uint256 public constant MINT_PRICE = 0.1 ether;
    uint256 public constant MAX_PER_TX = 10;

    address public constant TEST_WALLET = 0x8e5464173Cf64cdcdE93Aa15C41EeB8E1752E82b;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;

    constructor(string memory baseURI_) ERC721("Nebula Nomads", "NNOMAD") Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
    }

    /**
     * Mint `quantity` tokens. Pay MINT_PRICE * quantity unless caller is TEST_WALLET (free).
     */
    function mint(uint256 quantity) external payable {
        require(quantity > 0 && quantity <= MAX_PER_TX, "Invalid quantity");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "Exceeds max supply");

        uint256 cost = msg.sender == TEST_WALLET ? 0 : MINT_PRICE * quantity;
        require(msg.value >= cost, "Insufficient ETH");

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(msg.sender, _nextTokenId);
            _nextTokenId++;
        }

        if (msg.value > cost && cost == 0) {
            (bool ok, ) = msg.sender.call{ value: msg.value }("");
            require(ok, "Refund failed");
        } else if (msg.value > cost) {
            (bool ok, ) = msg.sender.call{ value: msg.value - cost }("");
            require(ok, "Refund failed");
        }
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId), ".json"));
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function withdraw() external onlyOwner {
        (bool ok, ) = owner().call{ value: address(this).balance }("");
        require(ok, "Withdraw failed");
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}

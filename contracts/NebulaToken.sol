// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * NEBULA ERC-20 — in-game shard/token for Metaverse economy.
 * Mint on quests/battles/staking rewards; burn on marketplace/mints.
 */
contract NebulaToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("Nebula Shard", "NEBULA") Ownable(msg.sender) {}

    /// @notice Mint shards to address (quest/battle/staking rewards)
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /// @notice Burn shards (marketplace, mints)
    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}

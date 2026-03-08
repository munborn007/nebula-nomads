// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * BattleContract — P2E arena wagers and match outcomes.
 * Wager shards/ETH; server validates results; contract distributes payouts.
 */
contract BattleContract is Ownable {
    struct Match {
        address player1;
        address player2;
        uint256 wager;
        uint8 winner; // 0 pending, 1 p1, 2 p2
        bool settled;
    }

    mapping(uint256 => Match) public matches;
    uint256 public matchId;
    mapping(address => uint256) public pendingWagers;

    event MatchCreated(uint256 indexed id, address player1, address player2, uint256 wager);
    event MatchSettled(uint256 indexed id, uint8 winner);

    constructor() Ownable(msg.sender) {}

    /// @notice Create 1v1 match with wager (ETH)
    function createMatch(address opponent) external payable {
        require(msg.value > 0, "Wager required");
        matchId++;
        matches[matchId] = Match({
            player1: msg.sender,
            player2: opponent,
            wager: msg.value,
            winner: 0,
            settled: false
        });
        emit MatchCreated(matchId, msg.sender, opponent, msg.value);
    }

    /// @notice Settle match (owner/server validates)
    function settleMatch(uint256 id, uint8 winner) external onlyOwner {
        Match storage m = matches[id];
        require(!m.settled, "Already settled");
        require(winner == 1 || winner == 2, "Invalid winner");

        m.winner = winner;
        m.settled = true;

        uint256 total = m.wager * 2;
        uint256 fee = total / 20; // 5% fee
        uint256 payout = total - fee;

        if (winner == 1) {
            (bool ok1, ) = m.player1.call{ value: payout }("");
            require(ok1, "Payout failed");
        } else {
            (bool ok2, ) = m.player2.call{ value: payout }("");
            require(ok2, "Payout failed");
        }
        (bool okFee, ) = owner().call{ value: fee }("");
        require(okFee, "Fee failed");

        emit MatchSettled(id, winner);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationEngine is Ownable {
    struct Reputation {
        uint256 totalMissions;
        uint256 completedMissions;
        uint256 failedMissions;
        uint256 score; // 0 - 10000 (basis points, e.g. 9500 = 95%)
        uint256 lastUpdated;
    }

    mapping(uint256 => Reputation) public reputations; // agentId => Reputation

    event ReputationUpdated(uint256 indexed agentId, uint256 newScore, uint256 totalMissions);
    event MissionRecorded(uint256 indexed agentId, bool success);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function recordMissionResult(uint256 _agentId, bool _success) external onlyOwner {
        Reputation storage rep = reputations[_agentId];

        rep.totalMissions++;
        if (_success) {
            rep.completedMissions++;
        } else {
            rep.failedMissions++;
        }

        // Calculate score as percentage in basis points
        if (rep.totalMissions > 0) {
            rep.score = (rep.completedMissions * 10000) / rep.totalMissions;
        }

        rep.lastUpdated = block.timestamp;

        emit MissionRecorded(_agentId, _success);
        emit ReputationUpdated(_agentId, rep.score, rep.totalMissions);
    }

    function getReputation(uint256 _agentId) external view returns (Reputation memory) {
        return reputations[_agentId];
    }

    function getScore(uint256 _agentId) external view returns (uint256) {
        return reputations[_agentId].score;
    }

    function isReliable(uint256 _agentId, uint256 _threshold) external view returns (bool) {
        Reputation memory rep = reputations[_agentId];
        return rep.totalMissions >= 3 && rep.score >= _threshold;
    }
}

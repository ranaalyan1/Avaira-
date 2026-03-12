// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MissionManager is Ownable {
    enum MissionStatus { Open, Assigned, Completed, Failed, Cancelled }

    struct Mission {
        string title;
        string description;
        address creator;
        uint256 reward;
        uint256 assignedAgentId;
        MissionStatus status;
        uint256 createdAt;
        uint256 completedAt;
    }

    IERC20 public rewardToken;
    mapping(uint256 => Mission) public missions;
    uint256 public nextMissionId;

    event MissionCreated(uint256 indexed missionId, string title, address indexed creator, uint256 reward);
    event MissionAssigned(uint256 indexed missionId, uint256 indexed agentId);
    event MissionCompleted(uint256 indexed missionId, uint256 indexed agentId, uint256 reward);
    event MissionFailed(uint256 indexed missionId, uint256 indexed agentId);
    event MissionCancelled(uint256 indexed missionId);

    constructor(address initialOwner, address _rewardToken) Ownable(initialOwner) {
        rewardToken = IERC20(_rewardToken);
    }

    function createMission(
        string memory _title,
        string memory _description,
        uint256 _reward
    ) external {
        require(_reward > 0, "Reward must be > 0");
        require(
            rewardToken.transferFrom(msg.sender, address(this), _reward),
            "Token transfer failed"
        );

        uint256 missionId = nextMissionId++;
        missions[missionId] = Mission({
            title: _title,
            description: _description,
            creator: msg.sender,
            reward: _reward,
            assignedAgentId: 0,
            status: MissionStatus.Open,
            createdAt: block.timestamp,
            completedAt: 0
        });

        emit MissionCreated(missionId, _title, msg.sender, _reward);
    }

    function assignMission(uint256 _missionId, uint256 _agentId) external {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Open, "Mission not open");
        require(mission.creator == msg.sender, "Not mission creator");

        mission.assignedAgentId = _agentId;
        mission.status = MissionStatus.Assigned;

        emit MissionAssigned(_missionId, _agentId);
    }

    function completeMission(uint256 _missionId) external onlyOwner {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Assigned, "Mission not assigned");

        mission.status = MissionStatus.Completed;
        mission.completedAt = block.timestamp;

        emit MissionCompleted(_missionId, mission.assignedAgentId, mission.reward);
    }

    function failMission(uint256 _missionId) external onlyOwner {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Assigned, "Mission not assigned");

        mission.status = MissionStatus.Failed;

        // Return reward to creator
        require(
            rewardToken.transfer(mission.creator, mission.reward),
            "Refund failed"
        );

        emit MissionFailed(_missionId, mission.assignedAgentId);
    }

    function cancelMission(uint256 _missionId) external {
        Mission storage mission = missions[_missionId];
        require(mission.creator == msg.sender, "Not mission creator");
        require(mission.status == MissionStatus.Open, "Cannot cancel");

        mission.status = MissionStatus.Cancelled;

        // Return escrowed reward
        require(
            rewardToken.transfer(mission.creator, mission.reward),
            "Refund failed"
        );

        emit MissionCancelled(_missionId);
    }

    function getMission(uint256 _missionId) external view returns (Mission memory) {
        return missions[_missionId];
    }

    function claimReward(uint256 _missionId, address _agentOwner) external onlyOwner {
        Mission storage mission = missions[_missionId];
        require(mission.status == MissionStatus.Completed, "Mission not completed");
        require(mission.reward > 0, "Already claimed");

        uint256 reward = mission.reward;
        mission.reward = 0;

        require(
            rewardToken.transfer(_agentOwner, reward),
            "Reward transfer failed"
        );
    }
}

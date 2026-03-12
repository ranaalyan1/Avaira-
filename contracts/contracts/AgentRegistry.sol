// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgentRegistry is Ownable {
    struct Agent {
        string name;
        string metadataURI;
        address owner;
        bool isActive;
        uint256 registeredAt;
    }

    mapping(uint256 => Agent) public agents;
    uint256 public nextAgentId;

    event AgentRegistered(uint256 indexed agentId, string name, address indexed owner);
    event AgentStatusChanged(uint256 indexed agentId, bool isActive);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerAgent(string memory _name, string memory _metadataURI) public {
        uint256 agentId = nextAgentId++;
        agents[agentId] = Agent({
            name: _name,
            metadataURI: _metadataURI,
            owner: msg.sender,
            isActive: true,
            registeredAt: block.timestamp
        });

        emit AgentRegistered(agentId, _name, msg.sender);
    }

    function toggleAgentStatus(uint256 _agentId) public {
        require(agents[_agentId].owner == msg.sender, "Not the owner");
        agents[_agentId].isActive = !agents[_agentId].isActive;
        emit AgentStatusChanged(_agentId, agents[_agentId].isActive);
    }

    function getAgent(uint256 _agentId) public view returns (Agent memory) {
        return agents[_agentId];
    }
}

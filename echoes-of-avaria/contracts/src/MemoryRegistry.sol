// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MemoryRegistry {
    mapping(address => uint256) public playerChapter;

    event MemoryLogged(
        address indexed player,
        uint256 indexed chapterId,
        bytes32 memoryHash,
        string uri,
        uint256 timestamp
    );

    function logMemory(uint256 chapterId, bytes32 memoryHash, string calldata uri) external {
        if (bytes(uri).length == 0) {
            revert("EmptyURI");
        }

        uint256 currentChapter = playerChapter[msg.sender];
        if (chapterId > currentChapter) {
            playerChapter[msg.sender] = chapterId;
        }

        emit MemoryLogged(msg.sender, chapterId, memoryHash, uri, block.timestamp);
    }
}

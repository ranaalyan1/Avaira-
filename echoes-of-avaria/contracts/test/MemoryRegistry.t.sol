// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MemoryRegistry.sol";

contract MemoryRegistryTest is Test {
    MemoryRegistry private registry;

    event MemoryLogged(
        address indexed player,
        uint256 indexed chapterId,
        bytes32 memoryHash,
        string uri,
        uint256 timestamp
    );

    function setUp() public {
        registry = new MemoryRegistry();
    }

    function testProgressUpdatesOnlyWhenIncreasing() public {
        bytes32 hash = keccak256("first");
        registry.logMemory(1, hash, "ipfs://one");
        assertEq(registry.playerChapter(address(this)), 1);

        registry.logMemory(1, keccak256("same"), "ipfs://same");
        assertEq(registry.playerChapter(address(this)), 1);

        registry.logMemory(0, keccak256("lower"), "ipfs://lower");
        assertEq(registry.playerChapter(address(this)), 1);

        registry.logMemory(2, keccak256("higher"), "ipfs://higher");
        assertEq(registry.playerChapter(address(this)), 2);
    }

    function testEmitsEventWithTimestamp() public {
        uint256 chapterId = 3;
        bytes32 hash = keccak256("event");
        string memory uri = "ipfs://event";

        vm.warp(123456);
        vm.expectEmit(true, true, true, true);
        emit MemoryLogged(address(this), chapterId, hash, uri, 123456);

        registry.logMemory(chapterId, hash, uri);
    }

    function testRevertsOnEmptyUri() public {
        vm.expectRevert(bytes("EmptyURI"));
        registry.logMemory(1, keccak256("bad"), "");
    }
}

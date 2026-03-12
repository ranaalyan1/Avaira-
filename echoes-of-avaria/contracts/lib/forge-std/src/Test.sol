// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Vm.sol";

contract Test {
    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertEq(uint256 a, uint256 b) internal pure {
        if (a != b) {
            revert("assertEq(uint256) failed");
        }
    }

    function assertEq(address a, address b) internal pure {
        if (a != b) {
            revert("assertEq(address) failed");
        }
    }
}

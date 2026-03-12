// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface Vm {
    function expectEmit(bool, bool, bool, bool) external;
    function expectRevert(bytes calldata) external;
    function expectRevert(bytes4) external;
    function expectRevert() external;
    function warp(uint256) external;
}

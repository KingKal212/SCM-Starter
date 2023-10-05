// SPDX-License-Identifier: MIT
pragma solidity  0.8.18;

contract tally{
    uint public tally =0;

    function addTally() public{
        tally += 5;
    }
    function removeTally() public {
        tally -=5;
    }
}

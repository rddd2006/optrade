// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OpinionTrade.sol";

contract DeployOpinionTradeScript is Script {
    function run() public returns (OpinionTrade) {
        vm.startBroadcast();
        OpinionTrade opinionTrade = new OpinionTrade();
        console.log("OpinionTrade contract deployed to:", address(opinionTrade));
        vm.stopBroadcast();
        return opinionTrade;
    }
}
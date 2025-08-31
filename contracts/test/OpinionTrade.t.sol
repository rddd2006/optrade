// contracts/test/OpinionTrade.t.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OpinionTrade.sol";

contract OpinionTradeTest is Test {
    OpinionTrade public opinionTrade;

    function setUp() public {
        opinionTrade = new OpinionTrade();
    }

    function test_CreateMarket() public {
        string memory question = "Will AI achieve AGI by 2030?";
        opinionTrade.createMarket(question);
        
        // --- THIS IS THE CORRECTED PART ---
        // We retrieve each simple field individually instead of the whole struct.
        (
            uint256 id,
            string memory questionFromChain,
            uint256 yesPool,
            uint256 noPool,
            uint256 totalBettors,
            OpinionTrade.MarketState state
        ) = opinionTrade.markets(1);

        // Now, we assert against the new variables.
        assertEq(id, 1);
        assertEq(questionFromChain, question);
        assertEq(uint(state), uint(OpinionTrade.MarketState.PENDING));
    }
}
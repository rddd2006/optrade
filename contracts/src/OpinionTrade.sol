// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/console.sol";

contract OpinionTrade {
    address public moderator;
    uint256 public marketCounter;

    // The fee required to create a new market
    uint256 public constant CREATION_FEE = 0.001 ether;

    enum MarketState { PENDING, RESOLVED_YES, RESOLVED_NO }

    struct Market {
        uint256 id;
        string question;
        uint256 yesPool;
        uint256 noPool;
        uint256 totalBettors;
        MarketState state;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
        mapping(address => bool) hasClaimed;
    }

    mapping(uint256 => Market) public markets;
    mapping(uint256 => address[]) public yesBettors;
    mapping(uint256 => address[]) public noBettors;

    event MarketCreated(uint256 indexed marketId, string question, address indexed creator);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, bool isYes, uint256 amount);
    event MarketResolved(uint256 indexed marketId, MarketState outcome);
    event WinningsClaimed(uint256 indexed marketId, address indexed winner, uint256 amount);

    constructor() {
        moderator = msg.sender;
        marketCounter = 0;
    }

    modifier onlyModerator() {
        require(msg.sender == moderator, "Only the moderator can perform this action.");
        _;
    }

    function createMarket(string memory _question) public payable {
        // Require the creator to pay the exact creation fee
        require(msg.value == CREATION_FEE, "Incorrect creation fee");

        marketCounter++;
        Market storage newMarket = markets[marketCounter];
        newMarket.id = marketCounter;
        newMarket.question = _question;
        newMarket.state = MarketState.PENDING;
        emit MarketCreated(marketCounter, _question, msg.sender);
    }

    function placeBet(uint256 _marketId, bool _isYes) public payable {
        require(msg.value > 0, "Bet amount must be greater than 0.");
        Market storage market = markets[_marketId];
        require(market.id != 0, "Market does not exist.");
        require(market.state == MarketState.PENDING, "Market is already resolved.");

        if (_isYes) {
            if (market.yesBets[msg.sender] == 0) { // First time betting 'yes'
                yesBettors[_marketId].push(msg.sender);
            }
            market.yesBets[msg.sender] += msg.value;
            market.yesPool += msg.value;
        } else {
            if (market.noBets[msg.sender] == 0) { // First time betting 'no'
                noBettors[_marketId].push(msg.sender);
            }
            market.noBets[msg.sender] += msg.value;
            market.noPool += msg.value;
        }
        
        market.totalBettors = yesBettors[_marketId].length + noBettors[_marketId].length;
        emit BetPlaced(_marketId, msg.sender, _isYes, msg.value);
    }

    function resolveMarket(uint256 _marketId, bool _didOutcomeOccur) public onlyModerator {
        Market storage market = markets[_marketId];
        require(market.state == MarketState.PENDING, "Market already resolved.");
        
        if (_didOutcomeOccur) {
            market.state = MarketState.RESOLVED_YES;
            emit MarketResolved(_marketId, MarketState.RESOLVED_YES);
        } else {
            market.state = MarketState.RESOLVED_NO;
            emit MarketResolved(_marketId, MarketState.RESOLVED_NO);
        }
    }

    function claimWinnings(uint256 _marketId) public {
        Market storage market = markets[_marketId];
        require(market.state != MarketState.PENDING, "Market is not yet resolved.");
        require(!market.hasClaimed[msg.sender], "You have already claimed your winnings.");

        uint256 winnings = 0;
        uint256 totalPool = market.yesPool + market.noPool;

        if (market.state == MarketState.RESOLVED_YES) {
            require(market.yesBets[msg.sender] > 0, "You did not bet on the winning side.");
            winnings = (totalPool * market.yesBets[msg.sender]) / market.yesPool;
        } else { // RESOLVED_NO
            require(market.noBets[msg.sender] > 0, "You did not bet on the winning side.");
            winnings = (totalPool * market.noBets[msg.sender]) / market.noPool;
        }

        require(winnings > 0, "No winnings to claim.");
        market.hasClaimed[msg.sender] = true;
        
        (bool success, ) = msg.sender.call{value: winnings}("");
        require(success, "Failed to send winnings.");

        emit WinningsClaimed(_marketId, msg.sender, winnings);
    }
}
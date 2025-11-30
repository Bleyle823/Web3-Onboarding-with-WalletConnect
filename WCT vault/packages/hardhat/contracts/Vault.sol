// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract WCTVault is ReentrancyGuard {
    IERC20 public token;
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
    }
    
    mapping(address => Stake) public stakes;
    uint256 public rewardRate = 10; // 10% APR
    uint256 public constant YEAR = 365 days;
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(address _token) {
        token = IERC20(_token);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimRewards();
        }
        
        token.transferFrom(msg.sender, address(this), amount);
        
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
        stakes[msg.sender].lastClaimTime = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    function withdraw(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");
        
        _claimRewards();
        
        stakes[msg.sender].amount -= amount;
        token.transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function claimRewards() external nonReentrant {
        _claimRewards();
    }
    
    function _claimRewards() private {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            stakes[msg.sender].lastClaimTime = block.timestamp;
            token.transfer(msg.sender, rewards);
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    function calculateRewards(address user) public view returns (uint256) {
        Stake memory userStake = stakes[user];
        if (userStake.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        return (userStake.amount * rewardRate * timeStaked) / (100 * YEAR);
    }
    
    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 pendingRewards,
        uint256 stakeDuration
    ) {
        Stake memory userStake = stakes[user];
        return (
            userStake.amount,
            calculateRewards(user),
            block.timestamp - userStake.startTime
        );
    }
}
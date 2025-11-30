// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WCToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    
    event TokensClaimed(address indexed user, uint256 amount);
    event TokensBurned(address indexed user, uint256 amount);
    
    constructor() ERC20("WalletConnect Token", "WCT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    function claim() external {
        require(balanceOf(msg.sender) == 0, "Already claimed");
        _mint(msg.sender, 100 * 10**18); // 100 tokens
        emit TokensClaimed(msg.sender, 100 * 10**18);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
}
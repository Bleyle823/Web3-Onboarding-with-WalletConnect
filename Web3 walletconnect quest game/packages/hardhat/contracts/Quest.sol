// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract QuestGame {
    struct Quest {
        string title;
        string description;
        uint256 xpReward;
        bool active;
    }
    
    struct Player {
        uint256 level;
        uint256 xp;
        uint256[] completedQuests;
    }
    
    Quest[] public quests;
    mapping(address => Player) public players;
    mapping(uint256 => mapping(address => bool)) public questCompleted;
    
    event QuestCreated(uint256 indexed questId, string title);
    event QuestCompleted(address indexed player, uint256 indexed questId, uint256 xpGained);
    event LevelUp(address indexed player, uint256 newLevel);
    
    function createQuest(
        string memory _title,
        string memory _description,
        uint256 _xpReward
    ) external {
        quests.push(Quest({
            title: _title,
            description: _description,
            xpReward: _xpReward,
            active: true
        }));
        
        emit QuestCreated(quests.length - 1, _title);
    }
    
    function completeQuest(uint256 _questId) external {
        require(_questId < quests.length, "Invalid quest");
        require(quests[_questId].active, "Quest inactive");
        require(!questCompleted[_questId][msg.sender], "Already completed");
        
        questCompleted[_questId][msg.sender] = true;
        players[msg.sender].completedQuests.push(_questId);
        
        uint256 xpGained = quests[_questId].xpReward;
        players[msg.sender].xp += xpGained;
        
        // Level up logic (100 XP per level)
        uint256 newLevel = players[msg.sender].xp / 100;
        if (newLevel > players[msg.sender].level) {
            players[msg.sender].level = newLevel;
            emit LevelUp(msg.sender, newLevel);
        }
        
        emit QuestCompleted(msg.sender, _questId, xpGained);
    }
    
    function getPlayerStats(address _player) external view returns (
        uint256 level,
        uint256 xp,
        uint256 questsCompleted
    ) {
        Player memory player = players[_player];
        return (player.level, player.xp, player.completedQuests.length);
    }
}
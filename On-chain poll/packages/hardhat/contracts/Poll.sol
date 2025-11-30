// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Poll {
    struct PollOption {
        string name;
        uint256 voteCount;
    }
    
    struct PollData {
        string question;
        PollOption[] options;
        uint256 endTime;
        bool active;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => PollData) public polls;
    uint256 public pollCount;
    
    event PollCreated(uint256 indexed pollId, string question, uint256 endTime);
    event Voted(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    
    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _duration
    ) external returns (uint256) {
        require(_options.length >= 2, "Need at least 2 options");
        require(_options.length <= 10, "Maximum 10 options");
        
        uint256 pollId = pollCount++;
        PollData storage newPoll = polls[pollId];
        newPoll.question = _question;
        newPoll.endTime = block.timestamp + _duration;
        newPoll.active = true;
        
        for (uint256 i = 0; i < _options.length; i++) {
            newPoll.options.push(PollOption({
                name: _options[i],
                voteCount: 0
            }));
        }
        
        emit PollCreated(pollId, _question, newPoll.endTime);
        return pollId;
    }
    
    function vote(uint256 _pollId, uint256 _optionIndex) external {
        PollData storage poll = polls[_pollId];
        require(poll.active, "Poll is not active");
        require(block.timestamp < poll.endTime, "Poll has ended");
        require(!poll.hasVoted[msg.sender], "Already voted");
        require(_optionIndex < poll.options.length, "Invalid option");
        
        poll.hasVoted[msg.sender] = true;
        poll.options[_optionIndex].voteCount++;
        
        emit Voted(_pollId, msg.sender, _optionIndex);
    }
    
    function getPollResults(uint256 _pollId) external view returns (
        string memory question,
        string[] memory optionNames,
        uint256[] memory voteCounts,
        uint256 totalVotes,
        bool active
    ) {
        PollData storage poll = polls[_pollId];
        uint256 optionCount = poll.options.length;
        
        optionNames = new string[](optionCount);
        voteCounts = new uint256[](optionCount);
        totalVotes = 0;
        
        for (uint256 i = 0; i < optionCount; i++) {
            optionNames[i] = poll.options[i].name;
            voteCounts[i] = poll.options[i].voteCount;
            totalVotes += poll.options[i].voteCount;
        }
        
        return (poll.question, optionNames, voteCounts, totalVotes, poll.active);
    }
    
    function hasVoted(uint256 _pollId, address _voter) external view returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }
}
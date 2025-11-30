// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Trivia {
    IERC20 public rewardToken;
    address public owner;
    
    struct Question {
        string question;
        bytes32 answerHash;
        uint256 reward;
        bool active;
    }
    
    Question[] public questions;
    mapping(uint256 => mapping(address => bool)) public hasAnswered;
    
    event QuestionAdded(uint256 indexed questionId, uint256 reward);
    event CorrectAnswer(uint256 indexed questionId, address indexed player, uint256 reward);
    
    constructor(address _token) {
        rewardToken = IERC20(_token);
        owner = msg.sender;
    }
    
    function addQuestion(
        string memory _question,
        string memory _answer,
        uint256 _reward
    ) external {
        require(msg.sender == owner, "Only owner");
        bytes32 answerHash = keccak256(abi.encodePacked(_answer));
        
        questions.push(Question({
            question: _question,
            answerHash: answerHash,
            reward: _reward,
            active: true
        }));
        
        emit QuestionAdded(questions.length - 1, _reward);
    }
    
    function answerQuestion(uint256 _questionId, string memory _answer) external {
        require(_questionId < questions.length, "Invalid question");
        Question storage q = questions[_questionId];
        require(q.active, "Question inactive");
        require(!hasAnswered[_questionId][msg.sender], "Already answered");
        
        bytes32 answerHash = keccak256(abi.encodePacked(_answer));
        require(answerHash == q.answerHash, "Wrong answer");
        
        hasAnswered[_questionId][msg.sender] = true;
        rewardToken.transfer(msg.sender, q.reward);
        
        emit CorrectAnswer(_questionId, msg.sender, q.reward);
    }
    
    function getQuestionCount() external view returns (uint256) {
        return questions.length;
    }
}
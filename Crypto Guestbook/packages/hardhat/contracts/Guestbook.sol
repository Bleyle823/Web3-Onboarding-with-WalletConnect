// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Guestbook
 * @dev Store messages from visitors on-chain
 */
contract Guestbook {
    // Struct to store message data
    struct Message {
        address signer;
        string content;
        uint256 timestamp;
    }

    // Array to store all messages
    Message[] public messages;

    // Mapping to track user message count
    mapping(address => uint256) public messageCount;

    // Event emitted when new message is added
    event MessageAdded(
        address indexed signer,
        string content,
        uint256 timestamp,
        uint256 messageId
    );

    /**
     * @dev Add a new message to the guestbook
     * @param _content The message content
     */
    function signGuestbook(string calldata _content) external {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 280, "Message too long (max 280 chars)");

        // Create new message
        Message memory newMessage = Message({
            signer: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        // Add to array
        messages.push(newMessage);
        
        // Increment user's message count
        messageCount[msg.sender]++;

        // Emit event
        emit MessageAdded(
            msg.sender,
            _content,
            block.timestamp,
            messages.length - 1
        );
    }

    /**
     * @dev Get total number of messages
     */
    function getTotalMessages() external view returns (uint256) {
        return messages.length;
    }

    /**
     * @dev Get a specific message by ID
     */
    function getMessage(uint256 _id) external view returns (
        address signer,
        string memory content,
        uint256 timestamp
    ) {
        require(_id < messages.length, "Message does not exist");
        Message memory message = messages[_id];
        return (message.signer, message.content, message.timestamp);
    }

    /**
     * @dev Get all messages (use with caution for large datasets)
     */
    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }

    /**
     * @dev Get messages by a specific address
     */
    function getMessagesBySigner(address _signer) external view returns (Message[] memory) {
        uint256 count = messageCount[_signer];
        Message[] memory userMessages = new Message[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < messages.length; i++) {
            if (messages[i].signer == _signer) {
                userMessages[index] = messages[i];
                index++;
            }
        }

        return userMessages;
    }
}
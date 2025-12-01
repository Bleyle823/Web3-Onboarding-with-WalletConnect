// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title WalletConnectNFT
 * @dev Complete NFT contract with minting, metadata, and WalletConnect optimization
 * @notice This contract is designed for easy integration with WalletConnect
 */
contract WalletConnectNFT is ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // ============ State Variables ============
    
    uint256 private _tokenIds;
    
    // Collection info
    string public baseTokenURI;
    string public collectionDescription = "WalletConnect NFT Collection - Mint your unique digital asset!";
    
    // Minting configuration
    uint256 public mintPrice = 0.001 ether; // Affordable for testing
    uint256 public maxSupply = 10000;
    uint256 public maxMintPerWallet = 10;
    bool public mintingEnabled = true;
    bool public publicMintEnabled = true;
    
    // Whitelist for presale
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public mintedPerWallet;
    
    // Royalties (EIP-2981)
    address public royaltyReceiver;
    uint96 public royaltyFeeNumerator = 500; // 5% = 500/10000

    // ============ Events ============
    
    event NFTMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 mintPrice
    );
    event MintPriceUpdated(uint256 oldPrice, uint256 newPrice);
    event MintingToggled(bool enabled);
    event PublicMintToggled(bool enabled);
    event BaseURIUpdated(string newBaseURI);
    event WhitelistUpdated(address indexed user, bool status);
    event Withdrawn(address indexed owner, uint256 amount);

    // ============ Constructor ============

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        baseTokenURI = _baseTokenURI;
        royaltyReceiver = msg.sender;
    }

    // ============ Minting Functions ============

    /**
     * @dev Public mint function - main entry point for users
     * @param _tokenURI IPFS URI for the NFT metadata
     */
    function mint(string memory _tokenURI) external payable nonReentrant returns (uint256) {
        require(mintingEnabled, "Minting is disabled");
        require(publicMintEnabled || whitelist[msg.sender], "Public mint not enabled");
        require(_tokenIds < maxSupply, "Max supply reached");
        require(msg.value >= mintPrice, "Insufficient payment");
        require(
            mintedPerWallet[msg.sender] < maxMintPerWallet,
            "Exceeded max mint per wallet"
        );
        require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");

        return _mintNFT(msg.sender, _tokenURI);
    }

    /**
     * @dev Batch mint multiple NFTs in one transaction
     * @param _tokenURIs Array of IPFS URIs
     */
    function mintBatch(string[] memory _tokenURIs) 
        external 
        payable 
        nonReentrant 
        returns (uint256[] memory) 
    {
        require(mintingEnabled, "Minting is disabled");
        require(publicMintEnabled || whitelist[msg.sender], "Public mint not enabled");
        require(_tokenURIs.length > 0, "Must mint at least 1");
        require(_tokenURIs.length <= 20, "Maximum 20 per transaction");
        require(
            _tokenIds + _tokenURIs.length <= maxSupply,
            "Would exceed max supply"
        );
        require(
            msg.value >= mintPrice * _tokenURIs.length,
            "Insufficient payment"
        );
        require(
            mintedPerWallet[msg.sender] + _tokenURIs.length <= maxMintPerWallet,
            "Would exceed max mint per wallet"
        );

        uint256[] memory tokenIds = new uint256[](_tokenURIs.length);

        for (uint256 i = 0; i < _tokenURIs.length; i++) {
            tokenIds[i] = _mintNFT(msg.sender, _tokenURIs[i]);
        }

        return tokenIds;
    }

    /**
     * @dev Free mint for whitelisted addresses
     * @param _tokenURI IPFS URI for the NFT metadata
     */
    function freeMint(string memory _tokenURI) external nonReentrant returns (uint256) {
        require(mintingEnabled, "Minting is disabled");
        require(whitelist[msg.sender], "Not whitelisted");
        require(_tokenIds < maxSupply, "Max supply reached");
        require(
            mintedPerWallet[msg.sender] < maxMintPerWallet,
            "Exceeded max mint per wallet"
        );

        return _mintNFT(msg.sender, _tokenURI);
    }

    /**
     * @dev Owner can mint to any address (for giveaways, etc.)
     * @param _to Recipient address
     * @param _tokenURI IPFS URI for the NFT metadata
     */
    function mintTo(address _to, string memory _tokenURI) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        require(_tokenIds < maxSupply, "Max supply reached");
        return _mintNFT(_to, _tokenURI);
    }

    /**
     * @dev Internal minting logic
     */
    function _mintNFT(address _to, string memory _tokenURI) 
        private 
        returns (uint256) 
    {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        mintedPerWallet[_to]++;

        emit NFTMinted(_to, newTokenId, _tokenURI, msg.value);

        return newTokenId;
    }

    // ============ View Functions ============

    /**
     * @dev Get total minted supply
     */
    function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Get all token IDs owned by an address
     */
    function tokensOfOwner(address _owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }

        return tokenIds;
    }

    /**
     * @dev Get detailed token information
     */
    function getTokenInfo(uint256 _tokenId) 
        external 
        view 
        returns (
            address owner,
            string memory uri,
            bool exists
        ) 
    {
        exists = _ownerOf(_tokenId) != address(0);
        if (exists) {
            owner = ownerOf(_tokenId);
            uri = tokenURI(_tokenId);
        }
    }

    /**
     * @dev Get minting statistics for an address
     */
    function getMintStats(address _user) 
        external 
        view 
        returns (
            uint256 minted,
            uint256 remaining,
            bool isWhitelisted,
            uint256 price
        ) 
    {
        minted = mintedPerWallet[_user];
        remaining = maxMintPerWallet - minted;
        isWhitelisted = whitelist[_user];
        price = mintPrice;
    }

    /**
     * @dev Get collection statistics
     */
    function getCollectionStats() 
        external 
        view 
        returns (
            uint256 currentSupply,
            uint256 maxSupply_,
            uint256 mintPrice_,
            bool mintingEnabled_,
            bool publicMintEnabled_
        ) 
    {
        return (
            _tokenIds,
            maxSupply,
            mintPrice,
            mintingEnabled,
            publicMintEnabled
        );
    }

    /**
     * @dev Override for base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev Override tokenURI to support both base URI and custom URIs
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    // ============ Whitelist Functions ============

    /**
     * @dev Add address to whitelist
     */
    function addToWhitelist(address _user) external onlyOwner {
        whitelist[_user] = true;
        emit WhitelistUpdated(_user, true);
    }

    /**
     * @dev Add multiple addresses to whitelist
     */
    function addToWhitelistBatch(address[] calldata _users) external onlyOwner {
        for (uint256 i = 0; i < _users.length; i++) {
            whitelist[_users[i]] = true;
            emit WhitelistUpdated(_users[i], true);
        }
    }

    /**
     * @dev Remove address from whitelist
     */
    function removeFromWhitelist(address _user) external onlyOwner {
        whitelist[_user] = false;
        emit WhitelistUpdated(_user, false);
    }

    // ============ Admin Functions ============

    /**
     * @dev Update mint price
     */
    function setMintPrice(uint256 _newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = _newPrice;
        emit MintPriceUpdated(oldPrice, _newPrice);
    }

    /**
     * @dev Update max supply
     */
    function setMaxSupply(uint256 _newMaxSupply) external onlyOwner {
        require(_newMaxSupply >= _tokenIds, "Cannot set below current supply");
        maxSupply = _newMaxSupply;
    }

    /**
     * @dev Update max mint per wallet
     */
    function setMaxMintPerWallet(uint256 _newMax) external onlyOwner {
        maxMintPerWallet = _newMax;
    }

    /**
     * @dev Toggle minting on/off
     */
    function toggleMinting() external onlyOwner {
        mintingEnabled = !mintingEnabled;
        emit MintingToggled(mintingEnabled);
    }

    /**
     * @dev Toggle public minting on/off
     */
    function togglePublicMint() external onlyOwner {
        publicMintEnabled = !publicMintEnabled;
        emit PublicMintToggled(publicMintEnabled);
    }

    /**
     * @dev Update base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseTokenURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    /**
     * @dev Update collection description
     */
    function setCollectionDescription(string memory _description) external onlyOwner {
        collectionDescription = _description;
    }

    /**
     * @dev Update royalty info
     */
    function setRoyaltyInfo(address _receiver, uint96 _feeNumerator) external onlyOwner {
        require(_feeNumerator <= 1000, "Royalty fee too high"); // Max 10%
        royaltyReceiver = _receiver;
        royaltyFeeNumerator = _feeNumerator;
    }

    // ============ Withdraw Functions ============

    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner(), balance);
    }

    /**
     * @dev Withdraw specific amount
     */
    function withdrawAmount(uint256 _amount) external onlyOwner nonReentrant {
        require(_amount <= address(this).balance, "Insufficient balance");
        
        (bool success, ) = payable(owner()).call{value: _amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawn(owner(), _amount);
    }

    // ============ Royalty Functions (EIP-2981) ============

    /**
     * @dev Returns royalty info for a token
     */
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        receiver = royaltyReceiver;
        royaltyAmount = (_salePrice * royaltyFeeNumerator) / 10000;
    }

    // ============ OpenSea Integration ============

    /**
     * @dev Contract-level metadata for OpenSea
     */
    function contractURI() public view returns (string memory) {
        return string(
            abi.encodePacked(
                baseTokenURI,
                "collection.json"
            )
        );
    }

    // ============ Required Overrides ============

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ============ Emergency Functions ============

    /**
     * @dev Pause all minting in case of emergency
     */
    function emergencyPause() external onlyOwner {
        mintingEnabled = false;
        publicMintEnabled = false;
    }

    /**
     * @dev Resume minting after emergency
     */
    function emergencyUnpause() external onlyOwner {
        mintingEnabled = true;
        publicMintEnabled = true;
    }

    /**
     * @dev Receive ETH
     */
    receive() external payable {}
}
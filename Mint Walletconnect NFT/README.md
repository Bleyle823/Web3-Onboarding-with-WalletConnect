# 🎨 Mint WalletConnect NFT

A comprehensive NFT minting platform built with WalletConnect integration, featuring a production-ready ERC-721 smart contract deployed on Base Mainnet.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Contract Details](#contract-details)
- [Deployment Information](#deployment-information)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Smart Contract Functions](#smart-contract-functions)
- [Development](#development)
- [Testing](#testing)
- [Deployment Guide](#deployment-guide)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Mint WalletConnect NFT is a full-stack Web3 application that enables users to mint, manage, and trade NFTs seamlessly through WalletConnect integration. The project includes:

- **Smart Contract**: Production-ready ERC-721 NFT contract with advanced features
- **Frontend**: Next.js application with WalletConnect integration
- **Development Tools**: Hardhat for contract development and deployment
- **Type Safety**: Full TypeScript support with auto-generated contract types

## ✨ Features

### Smart Contract Features

- ✅ **ERC-721 Standard**: Full compliance with ERC-721 NFT standard
- ✅ **URI Storage**: Support for custom token URIs and base URI
- ✅ **Enumerable**: Track all tokens and query by owner
- ✅ **Ownable**: Access control with owner-only functions
- ✅ **Reentrancy Protection**: Secure against reentrancy attacks
- ✅ **Whitelist System**: Presale whitelist functionality
- ✅ **Batch Minting**: Mint multiple NFTs in a single transaction
- ✅ **Royalties**: EIP-2981 royalty standard support
- ✅ **OpenSea Integration**: Contract-level metadata for marketplace compatibility
- ✅ **Emergency Controls**: Pause/unpause functionality for emergency situations

### Minting Features

- **Public Minting**: Open minting with configurable price
- **Whitelist Minting**: Free or discounted minting for whitelisted addresses
- **Batch Minting**: Mint up to 20 NFTs per transaction
- **Per-Wallet Limits**: Configurable maximum mints per wallet
- **Supply Control**: Maximum supply cap (10,000 tokens)
- **Price Management**: Owner can update mint price

### Frontend Features

- 🔗 **WalletConnect/Reown Integration**: Connect with 700+ wallets via WalletConnect Network
- 🎨 **Modern UI**: Beautiful, responsive interface
- 📱 **Mobile Support**: Fully optimized for mobile devices
- 🔍 **Block Explorer**: Built-in transaction and address explorer
- 🐛 **Debug Interface**: Interactive contract interaction UI
- 🌙 **Dark Mode**: Theme support

## 📄 Contract Details

### Contract Information

- **Name**: WalletConnect NFT
- **Symbol**: WCNFT
- **Standard**: ERC-721 (NFT)
- **Solidity Version**: ^0.8.20
- **OpenZeppelin**: v5.0.2

### Contract Configuration

- **Mint Price**: 0.001 ETH (configurable)
- **Max Supply**: 10,000 tokens (configurable)
- **Max Mint Per Wallet**: 10 tokens (configurable)
- **Royalty Fee**: 5% (500/10000, configurable up to 10%)

## 🚀 Deployment Information

### Base Mainnet Deployment

The `WalletConnectNFT` contract has been successfully deployed to **Base Mainnet**.

#### Deployment Details

- **Network**: Base Mainnet (Chain ID: 8453)
- **Contract Address**: [`0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7`](https://basescan.org/address/0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7)
- **Transaction Hash**: [`0x249b09e44368a030dcec84df13192948e76624842c17551fb0870d5931c6ff7e`](https://basescan.org/tx/0x249b09e44368a030dcec84df13192948e76624842c17551fb0870d5931c6ff7e)
- **Gas Used**: 3,199,814
- **Block Number**: 38,895,759

#### View on Block Explorer

- **BaseScan**: [View Contract](https://basescan.org/address/0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7)
- **Transaction**: [View Transaction](https://basescan.org/tx/0x249b09e44368a030dcec84df13192948e76624842c17551fb0870d5931c6ff7e)

### Local Development Deployment

For local testing, the contract is also deployed on the local Hardhat network:

- **Network**: Localhost (Chain ID: 31337)
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## 🛠 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd "Mint Walletconnect NFT"
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set up environment variables** (optional)

Create a `.env` file in `packages/hardhat/` if you need to configure:

```env
ALCHEMY_API_KEY=your_alchemy_api_key
ETHERSCAN_V2_API_KEY=your_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
```

### Quick Start

1. **Start local blockchain**

```bash
cd packages/hardhat
yarn chain
```

2. **Deploy contracts** (in a new terminal)

```bash
cd packages/hardhat
yarn deploy
```

3. **Start frontend** (in a new terminal)

```bash
cd packages/nextjs
yarn start
```

Visit `http://localhost:3000` to interact with your contracts!

## 📁 Project Structure

```
Mint Walletconnect NFT/
├── packages/
│   ├── hardhat/              # Smart contract development
│   │   ├── contracts/        # Solidity contracts
│   │   │   └── NFT.sol       # WalletConnectNFT contract
│   │   ├── deploy/           # Deployment scripts
│   │   │   └── 01_deploy_wallet_connect_nft.ts
│   │   ├── scripts/          # Utility scripts
│   │   ├── test/             # Contract tests
│   │   └── hardhat.config.ts # Hardhat configuration
│   │
│   └── nextjs/               # Frontend application
│       ├── app/              # Next.js app directory
│       ├── components/       # React components
│       ├── contracts/        # Auto-generated contract types
│       │   └── deployedContracts.ts
│       ├── hooks/            # Custom React hooks
│       └── scaffold.config.ts
│
└── README.md
```

## 🔧 Smart Contract Functions

### Public Functions

#### Minting

- `mint(string memory _tokenURI)` - Mint a single NFT (payable)
- `mintBatch(string[] memory _tokenURIs)` - Mint multiple NFTs (payable, max 20)
- `freeMint(string memory _tokenURI)` - Free mint for whitelisted addresses

#### View Functions

- `totalSupply()` - Get total number of minted tokens
- `getCollectionStats()` - Get collection statistics
- `getMintStats(address _user)` - Get minting stats for a user
- `getTokenInfo(uint256 _tokenId)` - Get detailed token information
- `tokensOfOwner(address _owner)` - Get all token IDs owned by an address
- `tokenURI(uint256 _tokenId)` - Get the URI for a token
- `contractURI()` - Get contract-level metadata for OpenSea

#### ERC-721 Standard Functions

- `balanceOf(address owner)` - Get balance of an address
- `ownerOf(uint256 tokenId)` - Get owner of a token
- `approve(address to, uint256 tokenId)` - Approve token transfer
- `transferFrom(address from, address to, uint256 tokenId)` - Transfer token
- `safeTransferFrom(...)` - Safe token transfer

### Owner-Only Functions

#### Configuration

- `setMintPrice(uint256 _newPrice)` - Update mint price
- `setMaxSupply(uint256 _newMaxSupply)` - Update max supply
- `setMaxMintPerWallet(uint256 _newMax)` - Update per-wallet limit
- `setBaseURI(string memory _newBaseURI)` - Update base token URI
- `setCollectionDescription(string memory _description)` - Update description
- `setRoyaltyInfo(address _receiver, uint96 _feeNumerator)` - Set royalty info

#### Minting Control

- `toggleMinting()` - Enable/disable all minting
- `togglePublicMint()` - Enable/disable public minting
- `mintTo(address _to, string memory _tokenURI)` - Owner mint to address

#### Whitelist Management

- `addToWhitelist(address _user)` - Add user to whitelist
- `addToWhitelistBatch(address[] memory _users)` - Batch add to whitelist
- `removeFromWhitelist(address _user)` - Remove from whitelist

#### Emergency Functions

- `emergencyPause()` - Pause all minting
- `emergencyUnpause()` - Resume minting

#### Withdrawal

- `withdraw()` - Withdraw all contract balance
- `withdrawAmount(uint256 _amount)` - Withdraw specific amount

### Events

- `NFTMinted(address indexed minter, uint256 indexed tokenId, string tokenURI, uint256 mintPrice)`
- `MintPriceUpdated(uint256 oldPrice, uint256 newPrice)`
- `MintingToggled(bool enabled)`
- `PublicMintToggled(bool enabled)`
- `BaseURIUpdated(string newBaseURI)`
- `WhitelistUpdated(address indexed user, bool status)`
- `Withdrawn(address indexed owner, uint256 amount)`

## 💻 Development

### Compile Contracts

```bash
cd packages/hardhat
yarn compile
```

### Run Tests

```bash
cd packages/hardhat
yarn test
```

### Generate TypeScript Types

Types are automatically generated after deployment. To manually generate:

```bash
cd packages/hardhat
yarn generateTsAbis
```

### Format Code

```bash
yarn format
```

### Lint Code

```bash
yarn lint
```

## 🧪 Testing

Run the test suite:

```bash
cd packages/hardhat
yarn test
```

The test suite includes:
- Contract deployment tests
- Minting functionality tests
- Access control tests
- Whitelist tests
- Royalty tests

## 📤 Deployment Guide

### Deploy to Local Network

```bash
cd packages/hardhat
yarn chain          # Terminal 1: Start local node
yarn deploy         # Terminal 2: Deploy contracts
```

### Deploy to Base Mainnet

1. **Set up your deployer account**

```bash
cd packages/hardhat
yarn account:import
```

Enter your private key and set a password. Make sure your wallet has Base ETH for gas fees.

2. **Deploy to Base**

```bash
yarn deploy --tags WalletConnectNFT --network base
```

3. **Verify Contract** (optional)

```bash
yarn verify --network base
```

### Deploy to Other Networks

The project supports multiple networks. Update `hardhat.config.ts` and deploy:

```bash
yarn deploy --tags WalletConnectNFT --network <network-name>
```

Supported networks:
- `localhost` - Local Hardhat network
- `base` - Base Mainnet
- `baseSepolia` - Base Sepolia Testnet
- `sepolia` - Ethereum Sepolia Testnet
- `mainnet` - Ethereum Mainnet
- And more...

## 🔒 Security

### Security Features

- ✅ **ReentrancyGuard**: Protection against reentrancy attacks
- ✅ **Ownable**: Access control for sensitive functions
- ✅ **Input Validation**: Comprehensive require statements
- ✅ **OpenZeppelin**: Battle-tested security libraries
- ✅ **Safe Math**: Solidity 0.8+ built-in overflow protection

### Best Practices

- Always test contracts on testnets before mainnet deployment
- Review all owner-only functions before deployment
- Use multi-sig wallets for contract ownership
- Regularly audit contract code
- Keep private keys secure and never commit them to version control

### Audit Recommendations

Before deploying to production, consider:
- Professional smart contract audit
- Formal verification
- Bug bounty program
- Community review

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENCE](LICENCE) file for details.

## 🔗 WalletConnect/Reown Integration

This project is fully compatible with **WalletConnect** and **Reown** (formerly WalletConnect Inc.) for seamless wallet connections.

### Wallet Support

The app uses **RainbowKit** which is built on top of **WalletConnect/Reown**, enabling connections to:
- **700+ wallets** via the WalletConnect Network
- **65,000+ apps** across EVM, Solana, Bitcoin, and more
- Direct connections to popular wallets: MetaMask, Coinbase Wallet, Ledger, Rainbow, Safe, and more

### Configuration

The project is pre-configured with WalletConnect/Reown for secure wallet connections:
- **WalletConnect Project ID**: Uses default project ID - works out of the box, no setup required
- **Network Support**: Base Mainnet and Hardhat (EVM-compatible)
- **Ready to Use**: All default values are configured and ready for immediate use

### Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [WalletConnect App SDK Documentation](https://docs.walletconnect.network/app-sdk/overview)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Reown Cloud Dashboard](https://cloud.walletconnect.com)

## 🔗 Useful Links

- [Base Mainnet Explorer](https://basescan.org)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Check the documentation
- Review the contract code

## 🎉 Acknowledgments

- Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- Uses [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- Deployed on [Base](https://base.org/) - Coinbase's L2 network
- Integrated with [WalletConnect](https://walletconnect.com/)

---

**Happy Minting! 🚀**

# Web3 Onboarding with WalletConnect

A comprehensive collection of Web3 decentralized applications (dApps) built with **WalletConnect/Reown** integration, designed to showcase various blockchain use cases and provide seamless wallet connectivity across 700+ wallets.

## 🔗 WalletConnect Integration

All projects in this repository are fully integrated with **WalletConnect** and **Reown** (formerly WalletConnect Inc.) for seamless wallet connections. The applications use **RainbowKit**, which is built on top of WalletConnect/Reown, enabling:

- **700+ wallets** via the WalletConnect Network
- **65,000+ apps** across EVM, Solana, Bitcoin, and more
- Direct connections to popular wallets: MetaMask, Coinbase Wallet, Ledger, Rainbow, Safe, and more
- **Zero configuration required** - All projects work out of the box with default WalletConnect Project IDs

### Technology Stack

All projects are built using:
- **Scaffold-ETH 2** - Open-source toolkit for building dApps
- **Next.js** - React framework for frontend
- **RainbowKit** - Wallet connection UI built on WalletConnect
- **Hardhat** - Smart contract development framework
- **Wagmi** & **Viem** - Ethereum React hooks and utilities
- **TypeScript** - Type-safe development

---

## 📦 Projects Overview

### 1. 🎨 Mint WalletConnect NFT

**Live Demo:** [https://nextjs-mua5rbtbt-bleyle125s-projects.vercel.app](https://nextjs-mua5rbtbt-bleyle125s-projects.vercel.app)

A production-ready NFT minting platform featuring a comprehensive ERC-721 smart contract deployed on **Base Mainnet**.

**Features:**
- Full ERC-721 NFT standard compliance
- Public and whitelist minting
- Batch minting (up to 20 NFTs per transaction)
- Royalty support (EIP-2981)
- OpenSea marketplace integration
- Emergency pause/unpause functionality
- Configurable mint price, supply limits, and per-wallet limits

**Contract Address (Base Mainnet):** [`0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7`](https://basescan.org/address/0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7)

**Token Details:**
- Name: WalletConnect NFT
- Symbol: WCNFT
- Max Supply: 10,000 tokens
- Mint Price: 0.001 ETH (configurable)

---

### 2. 📊 On-Chain Poll

**Live Demo:** 
- Production: [https://nextjs-zeta-one-98.vercel.app](https://nextjs-zeta-one-98.vercel.app)
- Preview: [https://nextjs-mi8jd3x14-bleyle125s-projects.vercel.app](https://nextjs-mi8jd3x14-bleyle125s-projects.vercel.app)

A decentralized voting and polling system that allows users to create polls and vote on-chain with transparent, immutable results.

**Features:**
- Create polls with custom questions and 2-10 options
- One vote per address per poll (prevents double voting)
- Real-time poll results with vote counts and percentages
- Time-limited polls with duration settings
- View voting history and status

**Contract Address (Base Mainnet):** [`0x5C14c249DA94C7757F0B57b178CC887E9b1AA03B`](https://basescan.org/address/0x5C14c249DA94C7757F0B57b178CC887E9b1AA03B)

**Contract Functions:**
- `createPoll()` - Create new polls with questions and options
- `vote()` - Cast votes on active polls
- `getPollResults()` - Retrieve poll statistics
- `hasVoted()` - Check voting status

---

### 3. 📝 Crypto Guestbook

An on-chain guestbook where users can leave permanent messages on the blockchain, creating an immutable record of visitor interactions.

**Features:**
- Leave messages up to 280 characters
- View all messages with timestamps
- Track messages by signer address
- Query messages by specific users
- Immutable on-chain storage

**Contract Functions:**
- `signGuestbook()` - Add a new message
- `getAllMessages()` - Retrieve all messages
- `getMessagesBySigner()` - Get messages from a specific address
- `getTotalMessages()` - Get total message count

---

### 4. 🎮 WalletConnect Trivia

An interactive trivia game with ERC20 token rewards for correct answers, gamifying blockchain education and engagement.

**Features:**
- Answer trivia questions to earn tokens
- One answer per question per address
- ERC20 token rewards for correct answers
- Owner can add new questions
- Track answered questions per user

**Contract Functions:**
- `addQuestion()` - Owner adds new trivia questions
- `answerQuestion()` - Players answer and earn rewards
- `getQuestionCount()` - View available questions

---

### 5. 💰 WCT Token Transfer

An ERC20 token system featuring the "WalletConnect Token" (WCT) with claim functionality for user onboarding.

**Features:**
- ERC20 standard token: "WalletConnect Token" (WCT)
- Initial supply: 1,000,000 tokens
- One-time claim of 100 tokens per address
- Token burning functionality
- Owner-controlled token management

**Token Details:**
- Name: WalletConnect Token
- Symbol: WCT
- Initial Supply: 1,000,000 WCT
- Claim Amount: 100 WCT per address

**Contract Functions:**
- `claim()` - Claim 100 tokens (one-time per address)
- `burn()` - Burn your tokens
- Standard ERC20 functions (transfer, approve, etc.)

---

### 6. 🏦 WCT Vault

A staking vault for WCT tokens that allows users to stake tokens and earn rewards with a 10% Annual Percentage Rate (APR).

**Features:**
- Stake WCT tokens to earn rewards
- 10% APR reward rate
- Automatic reward calculation
- Claim rewards anytime
- Withdraw staked tokens
- Reentrancy protection for security

**Contract Functions:**
- `stake()` - Stake tokens to start earning
- `withdraw()` - Withdraw staked tokens
- `claimRewards()` - Claim accumulated rewards
- `calculateRewards()` - View pending rewards
- `getStakeInfo()` - Get complete stake information

**Reward System:**
- APR: 10%
- Rewards calculated based on time staked
- Automatic reward accrual

---

### 7. 🎯 Web3 WalletConnect Quest Game

A gamified quest system with XP (experience points) and leveling mechanics, designed to engage users through blockchain-based achievements.

**Features:**
- Complete quests to earn XP
- Level up system (100 XP per level)
- Track completed quests
- Player statistics and progress
- Quest creation and management

**Contract Functions:**
- `createQuest()` - Create new quests
- `completeQuest()` - Complete quests and earn XP
- `getPlayerStats()` - View player level, XP, and completed quests

**Game Mechanics:**
- XP rewards per quest completion
- Level progression (100 XP = 1 level)
- Quest completion tracking
- Player profile system

---

### 8. ✍️ Digital Signature Wallet

A basic smart contract template for blockchain interactions, featuring greeting functionality and user tracking.

**Features:**
- Set and update greetings on-chain
- Track user interactions
- Premium features with ETH payments
- Owner withdrawal functionality

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= v20.18.3)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/downloads)

### Quick Start

Each project follows the same structure and can be run independently:

1. **Navigate to a project directory:**
   ```bash
   cd "Mint Walletconnect NFT"  # or any other project
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Start local blockchain (Terminal 1):**
   ```bash
   yarn chain
   ```

4. **Deploy contracts (Terminal 2):**
   ```bash
   yarn deploy
   ```

5. **Start frontend (Terminal 3):**
   ```bash
   yarn start
   ```

6. **Visit the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### WalletConnect Configuration

All projects are pre-configured with WalletConnect/Reown:
- **Default Project ID**: Works out of the box, no setup required
- **Network Support**: Hardhat (local), Base Mainnet, and other EVM networks
- **Ready to Use**: All default values configured for immediate use

To customize WalletConnect settings, update the configuration in:
- `packages/nextjs/services/web3/wagmiConnectors.tsx`
- `packages/nextjs/scaffold.config.ts`

---

## 📁 Project Structure

Each project follows the Scaffold-ETH 2 monorepo structure:

```
Project Name/
├── packages/
│   ├── hardhat/              # Smart contract development
│   │   ├── contracts/        # Solidity contracts
│   │   ├── deploy/           # Deployment scripts
│   │   ├── scripts/          # Utility scripts
│   │   └── test/             # Contract tests
│   │
│   └── nextjs/               # Frontend application
│       ├── app/              # Next.js app directory
│       ├── components/       # React components
│       ├── hooks/            # Custom React hooks
│       └── services/         # Web3 services (WalletConnect)
│
└── README.md
```

---

## 🔧 Development

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
```bash
cd packages/hardhat
yarn generateTsAbis
```

### Format & Lint
```bash
yarn format
yarn lint
```

---

## 🌐 Deployment

### Local Development
All projects can be deployed locally using Hardhat's local network.

### Production Networks
Several projects are deployed on **Base Mainnet**:
- **Mint WalletConnect NFT**: `0xDaDE199589D2dFcFe2328ee92D02B1FD78c53Ea7`
- **On-Chain Poll**: `0x5C14c249DA94C7757F0B57b178CC887E9b1AA03B`

To deploy to other networks:
```bash
yarn deploy --network <network-name>
```

Supported networks include:
- `localhost` - Local Hardhat network
- `base` - Base Mainnet
- `baseSepolia` - Base Sepolia Testnet
- `sepolia` - Ethereum Sepolia Testnet
- `mainnet` - Ethereum Mainnet

---

## 🔒 Security

All projects follow security best practices:
- ✅ **OpenZeppelin Contracts** - Battle-tested security libraries
- ✅ **ReentrancyGuard** - Protection against reentrancy attacks
- ✅ **Access Control** - Owner-only functions where appropriate
- ✅ **Input Validation** - Comprehensive require statements
- ✅ **Safe Math** - Solidity 0.8+ built-in overflow protection

**Note:** Before deploying to production, consider:
- Professional smart contract audit
- Formal verification
- Bug bounty program
- Community review

---

## 📚 Resources

### WalletConnect/Reown
- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [WalletConnect App SDK Documentation](https://docs.walletconnect.network/app-sdk/overview)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs/introduction)
- [Reown Cloud Dashboard](https://cloud.walletconnect.com)

### Development Tools
- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)

### Block Explorers
- [BaseScan](https://basescan.org) - Base Mainnet Explorer
- [Etherscan](https://etherscan.io) - Ethereum Mainnet Explorer

---

## 🤝 Contributing

Contributions are welcome! Each project follows standard contribution guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## 📝 License

All projects are licensed under the MIT License. See individual project `LICENCE` files for details.

---

## 🎉 Acknowledgments

- Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)
- Uses [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- Integrated with [WalletConnect](https://walletconnect.com/) and [Reown](https://reown.com/)
- Deployed on [Base](https://base.org/) - Coinbase's L2 network
- Powered by [RainbowKit](https://www.rainbowkit.com/)

---

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the project-specific README files
- Review the contract code and documentation

---

**Built for WalletConnect** - All projects showcase seamless wallet connectivity and Web3 onboarding experiences using WalletConnect/Reown technology.

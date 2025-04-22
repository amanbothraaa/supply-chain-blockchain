# 🔐 Authify - Blockchain Product Authentication System

Authify is a decentralized application (dApp) that enables product authentication and ownership tracking using Ethereum blockchain technology. Built with Solidity, React, and ethers.js, it provides a secure and transparent way to register products and transfer ownership.

## 🌟 Features

- Register new products on the blockchain
- Transfer product ownership securely
- View product details and ownership history
- MetaMask wallet integration
- Modern React + Tailwind CSS frontend

## 🛠️ Tech Stack

- **Smart Contract**: Solidity
- **Development Environment**: Hardhat
- **Frontend**: React + Tailwind CSS
- **Blockchain Interaction**: ethers.js
- **Wallet Integration**: MetaMask
- **Network**: Ethereum Sepolia Testnet
- **Node Provider**: Alchemy/Infura

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/downloads)
- [MetaMask](https://metamask.io/) browser extension
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/authify.git
cd authify
```

### 2. Install Dependencies

```bash
# Install project dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 3. Environment Setup

1. Create a `.env` file in the root directory:
```env
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

2. Create a `.env` file in the frontend directory:
```env
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_RPC_URL=your_alchemy_or_infura_url
```

### 4. Smart Contract Deployment

1. Get some Sepolia test ETH from a faucet
2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### 5. Start the Development Server

```bash
# Start the frontend development server
cd frontend
npm run dev
```

## 📝 Usage

1. Connect your MetaMask wallet to the application
2. Register a new product using the registration form
3. View product details and ownership information
4. Transfer product ownership to another address

## 🧪 Testing

```bash
# Run smart contract tests
npx hardhat test

# Run frontend tests
cd frontend
npm test
```

## 📁 Project Structure

```
authify/
├── contracts/
│   └── ProductAuth.sol
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RegisterProduct.jsx
│   │   │   ├── TransferOwnership.jsx
│   │   │   └── ProductDetails.jsx
│   │   └── App.jsx
│   └── tailwind.config.js
├── scripts/
│   └── deploy.js
└── hardhat.config.js
```

## 🔒 Security

- Never commit your `.env` files or private keys
- Always verify smart contracts on Etherscan
- Use environment variables for sensitive data
- Test thoroughly on testnet before mainnet deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethereum Foundation
- Hardhat Team
- React Team
- Tailwind CSS Team
- ethers.js Team

# OpTrade 📈 - A Decentralized Opinion Trading dApp

OpTrade is a full-stack decentralized application built on the Ethereum blockchain that allows users to bet on the outcomes of future events. It features a modern, responsive UI and a robust backend that indexes on-chain data for a fast and smooth user experience.

This project was built from the ground up, featuring a Foundry smart contract, a Node.js/Express indexer with a PostgreSQL database, and a Next.js/React frontend using wagmi and RainbowKit.

---

## ✨ Features

-   **Decentralized Betting:** All bets and fund pools are managed transparently by a smart contract on the Ethereum blockchain.
-   **Open Market Creation:** Anyone can create a new opinion market by paying a small creation fee (0.001 ETH) to prevent spam.
-   **Moderated Resolution:** A designated moderator has the authority to resolve markets and declare the final outcome (YES or NO).
-   **Real-Time Stats:** The UI displays the total amount of ETH and the number of bettors on both sides of any opinion.
-   **Lovable AI-Style UI:** A sleek, modern interface with animated "flashcards" for each market, built with Next.js and Framer Motion.
-   **Web3 Wallet Integration:** Seamlessly connect wallets like MetaMask or Phantom using RainbowKit.

---

## 🏛️ Architecture Overview

The project is structured into three core components:

1.  **`contracts/` (Foundry):** The Solidity smart contract that governs all on-chain logic, including market creation, betting, and fund distribution.
2.  **`backend/` (Node.js/Express):** A backend service that listens to events from the smart contract, indexes the data into a PostgreSQL database, and provides a fast API for the frontend.
3.  **`frontend/` (Next.js/React):** The user-facing application where users connect their wallets, create markets, and place bets.



---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
-   [**Foundry**](https://getfoundry.sh/): For compiling, testing, and deploying the smart contract.
-   [**Node.js**](https://nodejs.org/en/) (v18 or later): For running the backend and frontend servers.
-   [**Docker**](https://www.docker.com/products/docker-desktop/): For running the local PostgreSQL database.

---

## 🚀 Local Setup and Running

Follow these steps to get the entire application running on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git)
cd optrade-dapp
2. Set Up the Backend & Database
Bash

# Start the PostgreSQL database in the background
docker compose up -d

# Navigate to the backend and install dependencies
cd backend
npm install
3. Set Up the Smart Contract
Bash

# From the root directory, navigate to the contracts folder
cd ../contracts

# Compile the smart contract
forge build
4. Start and Deploy to a Local Blockchain (Anvil)
You will need 3 separate terminals for this part.

Terminal 1: Start Anvil

Bash

# From the root directory
anvil
Keep this terminal running.

Terminal 2: Deploy the Contract

Bash

# Navigate to the contracts directory
cd contracts

# Deploy the contract to Anvil
forge script script/DeployOpinionTrade.s.sol --broadcast --rpc-url [http://127.0.0.1:8545](http://127.0.0.1:8545)
Copy the deployed contract address from the output.

5. Configure and Run the Backend
Terminal 2 (continued):

Open backend/index.js and paste the deployed contract address into the CONTRACT_ADDRESS variable.

Run the backend server:

Bash

cd ../backend
node index.js
You should see a message that the backend is running and listening for events.

6. Configure and Run the Frontend
Terminal 3: Start the Frontend

Open a new terminal and navigate to the frontend directory.

Install dependencies:

Bash

cd frontend
npm install
Configure the frontend:

Open frontend/src/components/CreateMarketForm.tsx and paste the deployed contract address.

Open frontend/src/components/MarketCard.tsx and paste the deployed contract address.

Open frontend/src/app/providers.tsx and add your free projectId from WalletConnect Cloud.

Run the frontend server:

Bash

npm run dev
Your OpTrade dApp is now running at http://localhost:3000!

✅ Testing the Application Locally
Connect Your Wallet: Open http://localhost:3000, click "Connect Wallet", and connect MetaMask or another browser wallet.

Add Anvil Network: Configure your wallet to connect to the local Anvil network (RPC URL: http://127.0.0.1:8545, Chain ID: 31337). Anvil provides a list of private keys with test ETH; import one into your wallet.

Create a Market: Since anyone can create a market, use the form on the UI. Type a question (e.g., "Will it rain in Guwahati tomorrow?") and click "Create Market". Confirm the transaction in your wallet (this will cost 0.001 fake ETH).

Place a Bet: Once the market appears, enter an amount, choose "Bet YES" or "Bet NO", and confirm the transaction.

Check the Backend: Look at the terminal running your backend server. You will see logs for Event: Market Created and Event: Bet Placed as you perform these actions.

📁 Project Structure
optrade-dapp/
├── contracts/      # Foundry project for the Solidity smart contract
│   ├── src/
│   ├── script/
│   └── test/
├── backend/        # Node.js indexer and API server
│   └── index.js
├── frontend/       # Next.js frontend application
│   └── src/
└── docker-compose.yml
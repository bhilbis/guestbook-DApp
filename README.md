# 📖 Web3 Guestbook dApp

A decentralized guestbook application built with **React (TypeScript, Tailwind CSS, Vite)** for the frontend and **Hardhat + Solidity** for the smart contracts.  
Users can write and view messages stored securely on the blockchain.  

---

## ✨ Features
- 📝 Write a message and store it on the blockchain  
- 📜 View all guestbook messages  
- 🔒 Decentralized, transparent, and immutable data  
- 🎨 Modern UI with Tailwind CSS  
- ⚡ Powered by React + TypeScript + Vite  
- 🔗 Smart contract development with Hardhat + Solidity  

---

## 🛠 Tech Stack
**Frontend**
- React + TypeScript
- Tailwind CSS
- Vite
- Ethers.js

**Backend / Blockchain**
- Solidity
- Hardhat
- Node.js

---

## 📂 Project Structure
```plaintext
.
├── guestbook-frontend     # React + TS + Tailwind frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.ts
│
└── hardhat-ex             # Hardhat smart contract project
    ├── contracts
    ├── scripts
    ├── test
    ├── hardhat.config.ts
    └── package.json

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/bhilbis/guestbook-DApp.git
cd <repo-name>
```

### 2. Install Dependencies

**Frontend**
```bash
cd guestbook-frontend
npm install
```

**Smart Contracts**
```bash
cd hardhat-ex
npm install
```

### 3. Compile & Deploy Contracts
```bash
cd hardhat-ex
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network localhost
```

### 4. Run Frontend
Make sure Hardhat local node is running:
```bash
cd hardhat-ex
npx hardhat node
```

Then, in another terminal:
```bash
cd guestbook-frontend
npm run dev
```

Frontend will be available at:  
👉 http://localhost:5173


---

## 📸 Screenshots
<img width="1911" height="981" alt="{981D3382-A708-43C3-9C78-98B07FD846AE}" src="https://github.com/user-attachments/assets/83bd83ba-5d6f-453c-b7a5-0dde54b7dff6" />


---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License
This project is licensed under the MIT License.

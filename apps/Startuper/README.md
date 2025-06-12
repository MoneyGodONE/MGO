/startuper-crowdfund
├── contracts/                  # Solana, BSC, Base smart contracts
│   ├── solana/                 # Anchor program for project funding
│   ├── evm/                    # Solidity contracts for BSC & Base
├── frontend/                   # React frontend for Startuper.be
│   ├── components/             # ProjectCard, PledgeForm, etc.
│   ├── pages/                  # index.tsx, project/[id].tsx
│   └── utils/                  # wallet utils, MGO token helpers
├── firebase-functions/        # Cloud Functions for sync & analytics
│   ├── syncVowsToFirestore.ts
│   ├── mintNFT.ts
│   └── handleCrowdfund.ts     # backend logic for pledges
├── firestore.rules            # Security rules
└── README.md

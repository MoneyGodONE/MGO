✅ 1. Deployment Guide Using Anchor CLI
📦 Prerequisites
Install Rust

Install Solana CLI

Install Anchor

bash

cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

🚀 Steps

bash

# 1. Clone or create the project
anchor init mgo_community_log --program-id 4bvgPRkTMnqRuHxFpCJQ4YpQj6i7cJkYehMjM2qNpump

# 2. Replace lib.rs with our code (already done in the doc)

# 3. Build the project
anchor build

# 4. Start a local test validator (optional but useful)
solana-test-validator

# 5. Deploy to devnet or mainnet
anchor deploy --provider.cluster devnet
# or
anchor deploy --provider.cluster mainnet
✅ After Deployment
You’ll get:

Program ID: Matches your Solana contract

.json IDL file for use in frontend or indexers

✅ 2. Frontend DApp (Vue/React with Tailwind + Anchor)
Here’s a preview of key features:

Input form to submit vows

Checkbox for anonymity

Log of recent vows

Verification dashboard (for authorized wallets)

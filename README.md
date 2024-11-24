# Project Name

## Description
This project utilizes the FlexSDK to interact with a custom network. It demonstrates how to initialize the SDK, retrieve account coin amounts, and more.

## Prerequisites
- Node.js installed on your machine
- A valid private key for authentication

## Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment:
   - Replace `privateKey` in `src/quickstart.ts` with your actual private key.
   - Ensure that `TESTNET_FULLNODE` and `TESTNET_INDEXER` are set to the correct endpoints for your custom network.

## Usage
To run the script and retrieve the account coin amount, execute the following command:

```bash
npx ts-node src/quickstart.ts
```

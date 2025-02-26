const axios = require("axios");
const cron = require("node-cron");

// Global configuration
const config = {
  clientId: "",
  clientSecret: "",
  accountA: {
    vaultId: "01923d35-bdb3-7077-a673-9adf1e14268e",
    walletId: "01923d41-5563-7100-a80a-2ac840389787",
    address: "rKhQzekmU67UPa3NrCj4jDQK1o4XWHeu24",
  },
  accountB: {
    vaultId: "01923d35-bdb3-7077-a673-9adf1e14268e",
    walletId: "01923d42-8148-713f-be85-8c9ae1fc5ffe",
    address: "rMFuFhbFJA8UmrChpsjhEPKkxYK2Vsy6AT",
  },
  authUrl: "https://api.palisade.co/v2/credentials/oauth/token",
  transactionUrl: (vaultId, walletId) =>
    `https://api.palisade.co/v2/vaults/${vaultId}/wallets/${walletId}/transactions/transfer`,
  transactionStatusUrl: (vaultId, walletId, transactionId) =>
    `https://api.palisade.co/v2/vaults/${vaultId}/wallets/${walletId}/transactions/${transactionId}`,
  accessToken: null,
  transactionAmount: "86000",
};

// Function to get access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(config.authUrl, {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });

    config.accessToken = response.data.accessToken;
    console.log("Access Token refreshed");
  } catch (error) {
    console.error("Error getting access token:", error.message);
  }
};

// Function to send XRP between two accounts (amount as string)
const sendTransaction = async (sender, receiver) => {
  try {
    const response = await axios.post(
      config.transactionUrl(sender.vaultId, sender.walletId),
      {
        qty: config.transactionAmount, // Use amount from config
        symbol: "XRP",
        destinationAddress: receiver.address,
      },
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error sending transaction from ${sender.address} to ${receiver.address}:`,
      error.message
    );
  }
};

// Function to check the status of a transaction
const checkTransactionStatus = async (vaultId, walletId, transactionId) => {
  try {
    const response = await axios.get(
      config.transactionStatusUrl(vaultId, walletId, transactionId),
      {
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
        },
      }
    );
    return response.data.status;
  } catch (error) {
    console.error("Error fetching transaction status:", error.message);
  }
};

// Helper function to wait for transaction confirmation
const waitForConfirmation = async (vaultId, walletId, transactionId) => {
  let status;
  while (status !== "CONFIRMED") {
    status = await checkTransactionStatus(vaultId, walletId, transactionId);
    console.log(`Transaction status for ${transactionId}: ${status}`);
    if (status !== "CONFIRMED") {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds before checking again
    }
  }
};

// Function to handle the transaction loop sequentially
const transactionLoop = async () => {
  try {
    while (true) {
      // Send 1 XRP from Account A to Account B
      console.log(
        `Sending ${config.transactionAmount} XRP from Account A to Account B`
      );
      let txAtoB = await sendTransaction(config.accountA, config.accountB);

      if (txAtoB) {
        // Wait for transaction A to B to be confirmed
        await waitForConfirmation(
          config.accountA.vaultId,
          config.accountA.walletId,
          txAtoB.id
        );
        console.log("Transaction from A to B confirmed");

        // Send 1 XRP from Account B to Account A
        console.log(
          `Sending ${config.transactionAmount} XRP from Account B to Account A`
        );
        let txBtoA = await sendTransaction(config.accountB, config.accountA);

        if (txBtoA) {
          // Wait for transaction B to A to be confirmed
          await waitForConfirmation(
            config.accountB.vaultId,
            config.accountB.walletId,
            txBtoA.id
          );
          console.log("Transaction from B to A confirmed");
        }
      }
    }
  } catch (error) {
    console.error("Error in transaction loop:", error.message);
  }
};

// Cron job to refresh access token every 15 seconds
cron.schedule("*/15 * * * * *", async () => {
  await getAccessToken();
});

// Start the transaction process and loop indefinitely
const startTransactionProcess = async () => {
  await getAccessToken(); // Get the initial access token
  await transactionLoop(); // Start the transaction loop and wait for each transaction to confirm
};

startTransactionProcess();

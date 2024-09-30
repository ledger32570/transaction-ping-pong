const axios = require("axios");
const cron = require("node-cron");

// Global configuration
const config = {
  clientId: "",
  clientSecret: "",
  accountA: {
    vaultId: "",
    walletId: "",
    address: "",
  },
  accountB: {
    vaultId: "",
    walletId: "",
    address: "",
  },
  authUrl: "https://api.palisade.co/v2/credentials/oauth/token",
  transactionUrl: (vaultId, walletId) =>
    `https://api.palisade.co/v2/vaults/${vaultId}/wallets/${walletId}/transactions/transfer`,
  transactionStatusUrl: (vaultId, walletId, transactionId) =>
    `https://api.palisade.co/v2/vaults/${vaultId}/wallets/${walletId}/transactions/${transactionId}`,
  accessToken: null,
  transactionAmount: "86000",
};

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

const transactionLoop = async () => {
  try {
    while (true) {
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

        // Send from Account B to Account A
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

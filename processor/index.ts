import * as ripple from "ripple-binary-codec";
import { getInstructions, getTransaction, signRawTransaction } from "../api";
import {
  FLARE_NETWORK,
  PALISADE_SIGNER_VAULT_ID,
  PALISADE_SIGNER_WALLET_ADDRESS,
  PALISADE_SIGNER_WALLET_ID,
  PALISADE_SIGNER_WALLET_PUBLIC_KEY,
} from "../config";
import { Instruction, PaymentInstruction } from "../entities/flare-types";
import {
  delay,
  filterInstructionsSignedByPalisade,
  filterRelevantInstructions,
} from "../utils";
import { routeAndSubmitSignature } from "./route-signature-submission";

// Function to get the status of a transaction
const getTransactionStatus = async (
  vaultId: string,
  walletId: string,
  transactionId: string
): Promise<string | undefined> => {
  const response = await getTransaction(vaultId, walletId, transactionId);

  if (response.success) {
    console.log("Transaction status:", response.data.status);
    return response.data.status;
  } else {
    console.error("Error fetching transaction status:", response);
    return undefined;
  }
};

// Helper function to wait for transaction confirmation
const waitForSignedStatus = async (
  vaultId: string,
  walletId: string,
  transactionId: string
): Promise<void> => {
  let status: string | undefined;

  while (status !== "SIGNED") {
    status = await getTransactionStatus(vaultId, walletId, transactionId);
    if (status) {
      console.log(`Transaction status for ${transactionId}: ${status}`);
      if (status !== "SIGNED") {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds before checking again
      }
    } else {
      // If status is undefined (error occurred), wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

const processTransaction = async (instruction: Instruction) => {
  await delay(1000);

  const txJson: PaymentInstruction = {
    ...(instruction.tx_json as PaymentInstruction),
  };
  txJson.SigningPubKey = "";
  let encodedTransaction: any = null;

  const amount = instruction.tx_json.Amount;
  const type = instruction.tx_json.TransactionType;
  const destination = instruction.tx_json.Destination;

  try {
    console.log(
      `Encoding instruction type: ${type} for amount: ${amount} w. destination: ${destination}`
    );

    encodedTransaction = ripple.encodeForMultisigning(
      txJson,
      PALISADE_SIGNER_WALLET_ADDRESS
    );
  } catch (error) {
    console.error("Error encoding transaction:", error);
    return null;
  }

  console.log(`Encoding complete. Encoded transaction ${encodedTransaction}`);

  if (!encodedTransaction) {
    console.error("Error encoding transaction");
    return null;
  }

  const result: any = await signRawTransaction(
    PALISADE_SIGNER_VAULT_ID,
    PALISADE_SIGNER_WALLET_ID,
    { encodedTransaction, signOnly: true }
  );

  if (result.success) {
    console.log(
      "Transaction request submitted for signing w. id:",
      result.data.id
    );

    console.log(
      `Transaction: ${type} for amount: ${amount} SUBMITTED to Palisade signer`
    );

    // TODO: Manage REJECTED and FAILED statuses
    await waitForSignedStatus(
      PALISADE_SIGNER_VAULT_ID,
      PALISADE_SIGNER_WALLET_ID,
      result.data.id
    );

    console.log(
      `Transaction: ${type} for amount: ${amount} SIGNED by Palisade signer`
    );

    const transactionResponse = await getTransaction(
      PALISADE_SIGNER_VAULT_ID,
      PALISADE_SIGNER_WALLET_ID,
      result.data.id
    );

    if (!!transactionResponse.success) {
      const transaction = transactionResponse.data;

      if (transaction.status === "SIGNED" && !!transaction.canonicalSignature) {
        const data = {
          Instruction: {
            BlockHeight: instruction.details.block_height,
            LogIndex: instruction.details.log_index,
          },
          Signature: {
            Account: PALISADE_SIGNER_WALLET_ADDRESS,
            SigningPubKey: PALISADE_SIGNER_WALLET_PUBLIC_KEY,
            TxnSignature: transaction.canonicalSignature,
          },
        };

        const submitResponse = await routeAndSubmitSignature(type, data);

        if (submitResponse.success) {
          console.log("Signature submitted successfully to Flare backend.");

          return submitResponse.data;
        } else {
          console.error(
            `Error submitting signature for transaction id: ${result.data.id} instruction and response follow:`,
            result.data.id,
            instruction,
            submitResponse
          );
        }

        return null;
      } else {
        console.error(
          "Error fetching transaction response from Palisade signer"
        );
      }
    }
  }
};
// Start the transaction process and loop indefinitely
export const startProcessing = async (): Promise<any> => {
  const response = await getInstructions();

  if (!response.success) {
    console.error("Error fetching instructions:", response);

    return Error("Error fetching instructions");
  }

  const instructions = response.data;
  const actionable = filterRelevantInstructions(response.data);
  const signed = filterInstructionsSignedByPalisade(response.data);

  console.log("Flare network:", FLARE_NETWORK);
  console.log("No instructions:", instructions.length);
  console.log("No instructions to sign: ", actionable.length);
  console.log("No instructions signed by Palisade:", signed.length);
  await delay(5000);

  if (instructions.length === 0) {
    console.log("No relevant instructions found.");
  }

  for (const instruction of actionable) {
    const amount = instruction.tx_json.Amount;
    const type = instruction.tx_json.TransactionType;
    const destination = instruction.tx_json.Destination;

    console.log(
      `Processing instruction type: ${type} for amount: ${amount} w. destination: ${destination}`
    );

    await processTransaction(instruction)
      .then((transactionResponse) => {
        if (transactionResponse) {
          console.log("Instruction processed successfully");
        } else {
          console.error("Error processing transaction");
        }
      })
      .catch((error) => {
        console.log("THREW ERROR");
        console.error(
          "Error processing transaction:",
          error instanceof Error ? error.message : String(error)
        );
      });
  }
};

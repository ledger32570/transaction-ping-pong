import { postEscrowSignature, postPaymentSignature } from "../api";
import { SubmitSignerEvent } from "../entities/flare-types";

export const routeAndSubmitSignature = async (
  type: "Payment" | "EscrowCreate",
  blob: SubmitSignerEvent
) => {
  if (type === "Payment") {
    console.log(`Submitting signature for PAYMENT to Flare backend`);
    return await postPaymentSignature(blob);
  }

  console.log(`Submitting signature for ESCROW_CREATE to Flare backend`);
  return await postEscrowSignature(blob);
};

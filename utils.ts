import { CONSTON_AGENT_LIST, SONGBIRD_AGENT_LIST } from "./agent-list";
import { FLARE_NETWORK, PALISADE_SIGNER_WALLET_ADDRESS } from "./config";
import { Instruction } from "./entities/flare-types";

export const getAgentList = () => {
  if (FLARE_NETWORK === "COSTON") {
    return CONSTON_AGENT_LIST;
  }

  if (FLARE_NETWORK === "SONGBIRD") {
    return SONGBIRD_AGENT_LIST;
  }

  return CONSTON_AGENT_LIST;
};

export const filterRelevantInstructions = (instructions: Instruction[]) => {
  return instructions.filter((instruction) => {
    const isSigned = instruction.signatures.includes(
      PALISADE_SIGNER_WALLET_ADDRESS
    );

    // TODO: Uncomment this when the API is ready
    // const isSubmitted = instruction.details.was_submitted;
    const isSubmitted = false;

    if (!!isSubmitted) {
      return false;
    }

    if (isSigned) {
      return false;
    }

    return getAgentList().includes(instruction.tx_json.Destination);
  });
};

export const filterInstructionsSignedByPalisade = (
  instructions: Instruction[]
) => {
  return instructions.filter((instruction) => {
    const isSigned = instruction.signatures.includes(
      PALISADE_SIGNER_WALLET_ADDRESS
    );

    if (isSigned) {
      return true;
    }
    return false;
  });
};

export const delay = (ms: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

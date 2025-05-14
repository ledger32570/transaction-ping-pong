import axios from "axios";
import {
  FLARE_COLLECTOR_API_KEY,
  FLARE_COLLECTOR_HOST,
  FLARE_PROCESSOR_API_KEY,
  FLARE_PROCESSOR_HOST,
} from "../config";
import { Instruction, SubmitSignerEvent } from "../entities/flare-types";
import {
  AuthResponse,
  BlockchainAddress,
  CreateBlockchainAddressRequest,
  CreateTransaction,
  TransactionObject,
} from "../entities/palisade-types";
import { ApiResponse } from "./types";
import {
  createApiResponseSuccess,
  handleApiResponseError,
  makeApiGatewayRequest,
  makeUnauthenticatedApiGatewayRequest,
} from "./utils";

export function getAccessToken(
  clientId: string,
  clientSecret: string
): Promise<ApiResponse<AuthResponse>> {
  return makeUnauthenticatedApiGatewayRequest(
    "POST",
    `/v2/credentials/oauth/token`,
    {
      clientId: clientId,
      clientSecret: clientSecret,
    }
  );
}

export function createTransaction(
  vaultId: string,
  walletId: string,
  data: CreateTransaction
): Promise<ApiResponse<TransactionObject>> {
  return makeApiGatewayRequest(
    "POST",
    `/v2/vaults/${vaultId}/wallets/${walletId}/transactions/transfer`,
    data
  );
}

export function getTransaction(
  vaultId: string,
  walletId: string,
  transactionId: any
): Promise<ApiResponse<TransactionObject>> {
  return makeApiGatewayRequest(
    "GET",
    `/v2/vaults/${vaultId}/wallets/${walletId}/transactions/${transactionId}`
  );
}

export function signRawTransaction(
  vaultId: string,
  walletId: string,
  data: any
): Promise<ApiResponse<TransactionObject[]>> {
  return makeApiGatewayRequest(
    "POST",
    `/v2/vaults/${vaultId}/wallets/${walletId}/transactions/raw`,
    data
  );
}

export function createBlockchainAddress(
  counterpartyId: string,
  data: CreateBlockchainAddressRequest
): Promise<ApiResponse<BlockchainAddress>> {
  return makeApiGatewayRequest(
    "POST",
    `/v2/counterparties/${counterpartyId}/addresses`,
    data
  );
}

export function postPaymentSignature(
  data: SubmitSignerEvent
): Promise<ApiResponse<{}>> {
  return axios({
    method: "POST",
    url: `${FLARE_PROCESSOR_HOST}/api/v0/payment_sign/submit-msig-signer-event`,
    byPassAuthorization: true,
    data,
    headers: {
      "X-API-KEY": FLARE_PROCESSOR_API_KEY,
    },
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

export function postEscrowSignature(
  data: SubmitSignerEvent
): Promise<ApiResponse<{}>> {
  return axios({
    method: "POST",
    url: `${FLARE_PROCESSOR_HOST}/api/v0/escrow_sign/submit-msig-blob-event`,
    byPassAuthorization: true,
    data,
    headers: {
      "X-API-KEY": FLARE_PROCESSOR_API_KEY,
    },
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

export function getInstructions(): Promise<ApiResponse<Instruction[]>> {
  console.log("Fetching instructions");

  return axios({
    method: "GET",
    url: `${FLARE_COLLECTOR_HOST}/api/v0/instruction`,
    headers: {
      "X-API-KEY": FLARE_COLLECTOR_API_KEY,
    },
    byPassAuthorization: true,
  })
    .then((response) => createApiResponseSuccess(response.data))
    .catch(handleApiResponseError);
}

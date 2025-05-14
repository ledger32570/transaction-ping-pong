import { ApiResponseFilter } from "../api/types";

export interface AuthResponse {
  accessToken: string;
}

export interface MiscObject {
  [prop: string]: any;
}

export interface SimpleObject<T = string> {
  [key: string]: T;
}

export enum AddressTypes {
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export enum SupportedAssets {
  AVAX = "AVAX",
  CAKE = "CAKE",
  DAI = "DAI",
  DAIE = "DAIE",
  GRT = "GRT",
  HBAR = "HBAR",
  LINK = "LINK",
  MATIC = "MATIC",
  SOL = "SOL",
  UNI = "UNI",
  USDC = "USDC",
  USDT = "USDT",
  WAVAX = "WAVAX",
  WBNB = "WBNB",
  WBTC = "WBTC",
  WETH = "WETH",
  WMATIC = "WMATIC",
  WXRP = "WXRP",
  XRP = "XRP",
}

export enum SupportedFiatAssets {
  USD = "USD",
}

export enum SupportedBlockchains {
  UNSPECIFIED = "UNSPECIFIED",
  XRP_LEDGER = "XRP_LEDGER",
  AVALANCHE = "AVALANCHE",
  ETHEREUM = "ETHEREUM",
  POLYGON = "POLYGON",
  BNBCHAIN = "BNBCHAIN",
  BASE = "BASE",
  HEDERA = "HEDERA",
  ARBITRUM = "ARBITRUM",
  ONE_MONEY = "ONE_MONEY",
}

export enum SupportedWalletLimitType {
  CONSTANT = "CONSTANT",
  ROLLING_DURATION = "ROLLING_DURATION",
  PER_TX = "PER_TX",
}

export enum SupportedCounterpartyType {
  ALL = "ALL",
  COUNTERPARTIES = "COUNTERPARTIES",
  COUNTERPARTY_ADDRESSES = "COUNTERPARTY_ADDRESSES",
  WALLET_ADDRESSES = "WALLET_ADDRESSES",
}

export enum AssetStandard {
  UNSPECIFIED = "Unspecified",
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  ISSUED_CURRENCY = "ISSUED_CURRENCY",
}

export interface Asset {
  blockchain: SupportedBlockchains;
  contract: string;
  decimals: string;
  enabled: boolean;
  id: string;
  name: string;
  standard: AssetStandard;
  symbol: string;
  vetted: boolean;
}

export const DefaultAsset: Asset = {
  blockchain: SupportedBlockchains.UNSPECIFIED,
  contract: "",
  decimals: "",
  enabled: false,
  id: "",
  name: "",
  standard: AssetStandard.UNSPECIFIED,
  symbol: "",
  vetted: false,
};

export enum TransactionStatus {
  REQUESTED = "REQUESTED",
  POLICY_CHECK_PENDING = "POLICY_CHECK_PENDING",
  POLICY_CHECK_PASSED = "POLICY_CHECK_PASSED",
  APPROVAL_CHECK_PENDING = "APPROVAL_CHECK_PENDING",
  APPROVAL_CHECK_PASSED = "APPROVAL_CHECK_PASSED",
  SIGNATURE_PENDING = "SIGNATURE_PENDING",
  SIGNED = "SIGNED",
  PUBLISHING = "PUBLISHING",
  PUBLISHED = "PUBLISHED",
  CONFIRMATION_PENDING = "CONFIRMATION_PENDING",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  FAILED = "FAILED",
}

export interface TransactionStatusTimelineEntry {
  createdAt: string;
  metaData?: string;
  status: TransactionStatus;
}

export enum TransactionAction {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  WEB3_RAW = "WEB3_RAW",
  WEB3_SIGN = "WEB3_SIGN",
  PASSKEY_RAW = "PASSKEY_RAW",
  PASSKEY_SIGN = "PASSKEY_SIGN",
  PALISADE_TRANSFER = "PALISADE_TRANSFER",
  PALISADE_RAW = "PALISADE_RAW",
  PALISADE_SWEEP = "PALISADE_SWEEP",
}

export enum TransactionAttributeAction {
  APPROVE = "approve",
  SIGN = "sign",
  TRANSFER = "transfer",
}

export enum GenericTransactionType {
  PAYMENT = "Payment",
  RAW = "RawSigning",
}

export enum XRPTransactionType {
  ACCOUNT_DELETE = "AccountDelete",
  ACCOUNT_SET = "AccountSet",
  CHECK_CANCEL = "CheckCancel",
  CHECK_CASH = "CheckCash",
  CHECK_CREATE = "CheckCreate",
  DEPOSIT_PREAUTH = "DepositPreauth",
  ESCROW_CANCEL = "EscrowCancel",
  ESCROW_CREATE = "EscrowCreate",
  ESCROW_FINISH = "EscrowFinish",
  NFT_TOKEN_ACCEPT_OFFER = "NFTokenAcceptOffer",
  NFT_TOKEN_BURN = "NFTokenBurn",
  NFT_TOKEN_CANCEL_OFFER = "NFTokenCancelOffer",
  NFT_TOKEN_CREATE_OFFER = "NFTokenCreateOffer",
  NFT_TOKEN_MINT = "NFTokenMint",
  OFFER_CANCEL = "OfferCancel",
  OFFER_CREATE = "OfferCreate",
  PAYMENT_CHANNEL_CLAIM = "PaymentChannelClaim",
  PAYMENT_CHANNEL_CREATE = "PaymentChannelCreate",
  PAYMENT_CHANNEL_FUND = "PaymentChannelFund",
  SET_REGULAR_KEY = "SetRegularKey",
  SIGNER_LIST_SET = "SignerListSet",
  TICKET_CREATE = "TicketCreate",
  TRUST_SET = "TrustSet",
}

export enum EVMTransactionType {
  TRANSFER = "transfer(address,uint256)",
  TRANSFER_FROM = "transferFrom(address,address,uint256)",
  APPROVE = "approve(address,uint256)",
  BALANCE_OF = "balanceOf(address)",
  ALLOWANCE = "allowance(address,address)",
  TOTAL_SUPPLY = "totalSupply()",
  NAME = "name()",
  SYMBOL = "symbol()",
  DECIMALS = "decimals()",
  SAFE_TRANSFER_FROM = "safeTransferFrom(address,address,uint256)",
  SAFE_TRANSFER_FROM_WITH_DATA = "safeTransferFrom(address,address,uint256,bytes)",
  SET_APPROVAL_FOR_ALL = "setApprovalForAll(address,bool)",
  GET_APPROVED = "getApproved(uint256)",
  IS_APPROVED_FOR_ALL = "isApprovedForAll(address,address)",
  OWNER_OF = "ownerOf(uint256)",
  SAFE_TRANSFER_FROM_1155 = "safeTransferFrom(address,address,uint256,uint256,bytes)",
  SAFE_BATCH_TRANSFER_FROM = "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  BALANCE_OF_BATCH = "balanceOfBatch(address[],uint256[])",
  BALANCE_OF_1155 = "balanceOf(address,uint256)",
  IMPLEMENTATION = "implementation()",
  ADMIN = "admin()",
  UPGRADE_TO = "upgradeTo(address)",
  STAKE = "stake(uint256)",
  WITHDRAW = "withdraw(uint256)",
  GET_REWARD = "getReward()",
  PROPOSE = "propose(address[],uint256[],string[],bytes[],string)",
  VOTE = "vote(uint256,bool)",
  QUEUE = "queue(uint256)",
  EXECUTE = "execute(uint256)",
}

export type AllTransactionTypes =
  | GenericTransactionType
  | XRPTransactionType
  | EVMTransactionType;

export enum AssetChangePurpose {
  FEE = "FEE",
  TRANSFER = "TRANSFER",
}

export interface AssetChangeAddress {
  address: string;
  walletId: string;
}

export interface AssetChange {
  asset: Asset;
  destination?: AssetChangeAddress;
  purpose: AssetChangePurpose;
  qty: string;
  source?: AssetChangeAddress;
}

export enum AddressType {
  COUNTERPARTY = "COUNTERPARTY",
  WALLET = "WALLET",
  EXTERNAL = "EXTERNAL",
}

export interface Address {
  id?: string;
  organizationId?: string;
  counterpartyId?: string;
  vaultId?: string;
  type: AddressType;
  address: string;
}

export interface TransactionObject {
  action: TransactionAction;
  asset: Asset;
  attributes: Record<string, string>;
  blockchain: SupportedBlockchains;
  canonicalSignature?: string;
  confirmedAssetChanges: AssetChange[];
  confirmedAt: string;
  createdAt: string;
  createdBy: string;
  externalId?: string;
  destination?: Address;
  destinationAddress?: string;
  encodedTransaction?: string;
  failedAt: string;
  feeAsset: Asset;
  feeQty?: string;
  feeQtyLimit?: string;
  hash?: string;
  id: string;
  organizationId: string;
  origin: Address;
  originAddress: string;
  proposedAssetChanges: AssetChange[];
  qty: string;
  reasons?: string[];
  rejectedAt: string;
  rejectedBy: string;
  sequence?: string;
  signature?: string;
  signedTransaction?: string;
  signingHash?: string;
  signOnly: boolean;
  status: TransactionStatus;
  transactionType: AllTransactionTypes;
  updatedAt: string;
  updatedBy: string;
  vaultId: string;
  walletId: string;
  config?: MiscObject;
}

export interface CreateTransaction {
  contract: string;
  symbol?: string;
  destinationAddress: string;
  qty: string;
  sequence?: string;
  config?: MiscObject;
}

export interface CustodianDetails {
  name: string;
  dId: string;
}

export interface FilteredBlockchainAddresses {
  addresses: BlockchainAddress[];
  filter: ApiResponseFilter;
}

export interface ExternalBlockchainAddress {
  address: string;
  blockchains: SupportedBlockchains[];
  description?: string;
  name: string;
}

export enum BlockchainAddressDetailsType {
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export interface BlockchainAddressDetails {
  details?: BlockchainAddressDetails;
  externalAddress: ExternalBlockchainAddress;
  internalAddress?: string;
  type: BlockchainAddressDetailsType;
}

export enum BlockchainAddressStatus {
  COMPLIANCE_COMPLETE = "COMPLIANCE_COMPLETE",
  COMPLIANCE_PENDING = "COMPLIANCE_PENDING",
  CREATED = "CREATED",
  CREATION_APPROVAL_COMPLETE = "CREATION_APPROVAL_COMPLETE",
  CREATION_APPROVAL_PENDING = "CREATION_APPROVAL_PENDING",
  DELETED = "DELETED",
  DELETION_APPROVAL_COMPLETE = "DELETION_APPROVAL_COMPLETE",
  DELETION_APPROVAL_PENDING = "DELETION_APPROVAL_PENDING",
  ENABLED = "ENABLED",
  ERROR = "ERROR",
  REJECTED = "REJECTED",
}

export interface BlockchainAddress {
  active: boolean;
  addressId: string;
  counterpartyId: string;
  createdAt: string;
  createdBy: string;
  custodian: CustodianDetails;
  details: BlockchainAddressDetails;
  organizationId: string;
  status: BlockchainAddressStatus;
  termsAndConditionsAccepted: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface CreateBlockchainAddressRequest {
  custodian?: CustodianDetails;
  details: BlockchainAddressDetails;
  termsAndConditionsAccepted: boolean;
}

export interface GlobalBlockchainAddressUpdated {
  counterpartyEventsGlobalAddressUpdated: {
    update: {
      address: BlockchainAddress;
    };
  };
}

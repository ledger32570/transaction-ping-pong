export interface Account {
  vaultId: string;
  walletId: string;
  address: string;
  publicKey: string;
}

export interface PaymentInstruction {
  Account: string;
  Amount: string;
  Destination: string;
  Fee: string;
  Sequence: number;
  SigningPubKey: string;
  TransactionType: "Payment";
  Memos?: [
    {
      Memo: {
        MemoData: string;
      };
    }
  ];
}

export interface EscrowInstruction {
  Account: string;
  Amount: string;
  Destination: string;
  CancelAfter: number;
  Condition: string;
  Fee: string;
  Sequence: number;
  SigningPubKey: string;
  TransactionType: "EscrowCreate";
}

export interface Instruction {
  tx_json: PaymentInstruction | EscrowInstruction;
  details: {
    sequence: number;
    block_height: number;
    log_index: number;
    was_submitted: boolean;
    minted_txid: string;
  };
  signatures: string[];
}

export interface SubmitSignatureWithBlob {
  Instruction: {
    BlockHeight: number;
    LogIndex: number;
  };
  Signature: {
    Blob: string;
  };
}

export interface SubmitSignerEvent {
  Instruction: {
    BlockHeight: number;
    LogIndex: number;
  };
  Signature: {
    Account: string;
    SigningPubKey: string;
    TxnSignature: string;
  };
}

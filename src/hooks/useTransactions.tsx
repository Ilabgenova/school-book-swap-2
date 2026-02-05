import { createContext, useContext, useState, ReactNode } from "react";

export type TransactionStatus = 
  | "reserved"           // Book reserved, awaiting handover
  | "buyer_confirmed"    // Buyer confirmed receipt
  | "seller_confirmed"   // Seller confirmed handover
  | "completed"          // Both parties confirmed
  | "cancelled";         // Transaction cancelled

export interface Transaction {
  id: string;
  listingId: string;
  bookTitle: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  bookPrice: number;
  status: TransactionStatus;
  createdAt: Date;
  buyerConfirmedAt?: Date;
  sellerConfirmedAt?: Date;
  completedAt?: Date;
}

interface TransactionsContextType {
  transactions: Transaction[];
  createTransaction: (data: Omit<Transaction, "id" | "status" | "createdAt">) => Transaction;
  confirmByBuyer: (transactionId: string) => void;
  confirmBySeller: (transactionId: string) => void;
  cancelTransaction: (transactionId: string) => void;
  getTransactionsByBuyer: (buyerId: string) => Transaction[];
  getTransactionsBySeller: (sellerId: string) => Transaction[];
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const createTransaction = (data: Omit<Transaction, "id" | "status" | "createdAt">): Transaction => {
    const newTransaction: Transaction = {
      ...data,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "reserved",
      createdAt: new Date(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  const checkAndCompleteTransaction = (txn: Transaction): Transaction => {
    if (txn.buyerConfirmedAt && txn.sellerConfirmedAt) {
      return { ...txn, status: "completed", completedAt: new Date() };
    }
    return txn;
  };

  const confirmByBuyer = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id !== transactionId) return txn;
        const updated = { 
          ...txn, 
          status: "buyer_confirmed" as TransactionStatus, 
          buyerConfirmedAt: new Date() 
        };
        return checkAndCompleteTransaction(updated);
      })
    );
  };

  const confirmBySeller = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((txn) => {
        if (txn.id !== transactionId) return txn;
        const updated = { 
          ...txn, 
          status: "seller_confirmed" as TransactionStatus, 
          sellerConfirmedAt: new Date() 
        };
        return checkAndCompleteTransaction(updated);
      })
    );
  };

  const cancelTransaction = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId ? { ...txn, status: "cancelled" as TransactionStatus } : txn
      )
    );
  };

  const getTransactionsByBuyer = (buyerId: string) => {
    return transactions.filter((txn) => txn.buyerId === buyerId);
  };

  const getTransactionsBySeller = (sellerId: string) => {
    return transactions.filter((txn) => txn.sellerId === sellerId);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        createTransaction,
        confirmByBuyer,
        confirmBySeller,
        cancelTransaction,
        getTransactionsByBuyer,
        getTransactionsBySeller,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};

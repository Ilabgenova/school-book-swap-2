import { createContext, useContext, useState, ReactNode } from "react";

export type TransactionStatus = 
  | "payment_held"      // Buyer paid, funds held by platform
  | "delivery_confirmed" // Buyer confirmed receipt
  | "payment_released"   // Funds released to seller
  | "cancelled";         // Transaction cancelled

export interface Transaction {
  id: string;
  listingId: string;
  bookTitle: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  bookPrice: number;
  appFee: number;
  totalPaid: number;
  paymentMethod: string;
  status: TransactionStatus;
  createdAt: Date;
  deliveryConfirmedAt?: Date;
  paymentReleasedAt?: Date;
}

interface TransactionsContextType {
  transactions: Transaction[];
  createTransaction: (data: Omit<Transaction, "id" | "status" | "createdAt">) => Transaction;
  confirmDelivery: (transactionId: string) => void;
  releasePayment: (transactionId: string) => void;
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
      status: "payment_held",
      createdAt: new Date(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    return newTransaction;
  };

  const confirmDelivery = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? { ...txn, status: "delivery_confirmed" as TransactionStatus, deliveryConfirmedAt: new Date() }
          : txn
      )
    );
  };

  const releasePayment = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? { ...txn, status: "payment_released" as TransactionStatus, paymentReleasedAt: new Date() }
          : txn
      )
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
        confirmDelivery,
        releasePayment,
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

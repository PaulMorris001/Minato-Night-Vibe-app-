import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

type AccountType = "client" | "vendor";

interface AccountContextType {
  activeAccount: AccountType;
  setActiveAccount: (type: AccountType) => void;
  isVendor: boolean;
  switchAccount: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [activeAccount, setActiveAccountState] = useState<AccountType>("client");

  useEffect(() => {
    loadActiveAccount();
  }, []);

  const loadActiveAccount = async () => {
    try {
      const stored = await SecureStore.getItemAsync("activeAccount");
      if (stored === "vendor" || stored === "client") {
        setActiveAccountState(stored);
      }
    } catch (error) {
      console.error("Error loading active account:", error);
    }
  };

  const setActiveAccount = async (type: AccountType) => {
    try {
      await SecureStore.setItemAsync("activeAccount", type);
      setActiveAccountState(type);
    } catch (error) {
      console.error("Error setting active account:", error);
    }
  };

  const switchAccount = () => {
    const newType: AccountType = activeAccount === "client" ? "vendor" : "client";
    setActiveAccount(newType);
  };

  return (
    <AccountContext.Provider
      value={{
        activeAccount,
        setActiveAccount,
        isVendor: activeAccount === "vendor",
        switchAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}

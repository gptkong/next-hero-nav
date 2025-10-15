"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NetworkType = "internet" | "local";

interface NetworkContextType {
  networkType: NetworkType;
  setNetworkType: (type: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [networkType, setNetworkType] = useState<NetworkType>("internet");

  return (
    <NetworkContext.Provider value={{ networkType, setNetworkType }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}

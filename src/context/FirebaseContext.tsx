import React, { createContext, useContext, useEffect, useState } from "react";
import { getSession, saveSession, clearSession } from "../utils/session";
import { initShopFirebase } from "../firebase/dynamicFirebase";

interface FirebaseContextType {
  shopConfig: any;
  setShopConfig: (config: any) => void;
  logout: () => void;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [shopConfig, setShopConfigState] = useState<any>(null);

  useEffect(() => {
    const storedConfig = getSession();
    if (storedConfig) {
      setShopConfigState(storedConfig);
      initShopFirebase(storedConfig); // 🔥 re-init Firebase
    }
  }, []);

  const setShopConfig = (config: any) => {
    saveSession(config);
    setShopConfigState(config);
  };

  const logout = () => {
    clearSession();
    setShopConfigState(null);
    window.location.href = "/";
  };

  return (
    <FirebaseContext.Provider value={{ shopConfig, setShopConfig, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseConfig = () => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("FirebaseContext missing");
  return ctx;
};

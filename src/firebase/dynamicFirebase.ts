import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let shopApp: FirebaseApp | null = null;
let shopDb: Firestore | null = null;

export const initShopFirebase = (config: any) => {
  if (!shopApp) {
    shopApp = initializeApp(config, config.projectId);
    shopDb = getFirestore(shopApp);
  }
  return { shopApp, shopDb };
};

export const getShopDb = (_shopId?: string) => shopDb;

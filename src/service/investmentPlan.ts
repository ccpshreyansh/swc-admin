import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Firestore
} from "firebase/firestore";
import { getShopDb } from "../firebase/dynamicFirebase";

export interface InvestmentPlan {
  id?: string;
  name: string;
  tenure: string;
  amount: string;
  details?: string;
  terms?: string;
}

// Helper to get collection reference safely
const getCollectionRef = (): ReturnType<typeof collection> => {
  const db: Firestore | null = getShopDb();
  if (!db) throw new Error("Shop DB not initialized");
  return collection(db, "investmentPlans");
};

/** Fetch all investment plans */
export const fetchInvestments = async (): Promise<InvestmentPlan[]> => {
  try {
    const collectionRef = getCollectionRef();
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as InvestmentPlan)
    );
  } catch (error) {
    console.error("Error fetching investment plans:", error);
    return [];
  }
};

/** Add a new investment plan */
export const addInvestment = async (plan: InvestmentPlan) => {
  try {
    const collectionRef = getCollectionRef();
    await addDoc(collectionRef, plan);
  } catch (error) {
    console.error("Error adding investment plan:", error);
    throw error;
  }
};

/** Update an existing investment plan by ID */
export const updateInvestment = async (id: string, plan: InvestmentPlan) => {
  try {
    const db = getShopDb();
    if (!db) throw new Error("Shop DB not initialized");
    const docRef = doc(db, "investmentPlans", id);
    await updateDoc(docRef, plan as any);
  } catch (error) {
    console.error("Error updating investment plan:", error);
    throw error;
  }
};

/** Delete an investment plan by ID */
export const deleteInvestment = async (id: string) => {
  try {
    const db = getShopDb();
    if (!db) throw new Error("Shop DB not initialized");
    const docRef = doc(db, "investmentPlans", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting investment plan:", error);
    throw error;
  }
};

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  Firestore,
} from "firebase/firestore";
import { getShopDb } from "../firebase/dynamicFirebase";

/* ---------------- GET DOC REF ---------------- */
const getRatesDocRef = () => {
  const db: Firestore | null = getShopDb();
  if (!db) throw new Error("Shop DB not initialized");
  return doc(db, "metalRates", "currentRates");
};

/* ---------------- ADD (ONLY IF NOT EXISTS) ---------------- */
export const addMetalRates = async (rates: any) => {
  try {
    const ref = getRatesDocRef();
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, rates);
      console.log("✅ Metal rates created");
    } else {
      console.warn("⚠️ Metal rates already exist, use update instead");
    }
  } catch (error) {
    console.error("❌ Error adding metal rates:", error);
    throw error;
  }
};

/* ---------------- GET ---------------- */
export const getMetalRates = async () => {
  try {
    const ref = getRatesDocRef();
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error("❌ Error fetching metal rates:", error);
    throw error;
  }
};

/* ---------------- UPDATE ---------------- */
export const updateMetalRates = async (rates: any) => {
  try {
    const ref = getRatesDocRef();
    await setDoc(ref, rates, { merge: true });
    console.log("✅ Metal rates updated");
  } catch (error) {
    console.error("❌ Error updating metal rates:", error);
    throw error;
  }
};

/* ---------------- DELETE ---------------- */
export const deleteMetalRates = async () => {
  try {
    const ref = getRatesDocRef();
    await deleteDoc(ref);
    console.log("🗑️ Metal rates deleted");
  } catch (error) {
    console.error("❌ Error deleting metal rates:", error);
    throw error;
  }
};

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getShopDb } from "../firebase/dynamicFirebase";

const col = () => {
  const db = getShopDb();
  if (!db) throw new Error("DB not ready");
  return collection(db, "newProducts");
};

export const fetchProductsByCategory = async (categoryId: string) => {
  const q = query(col(), where("categoryId", "==", categoryId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addProduct = async (data: any) => {
  await addDoc(col(), {
    ...data,
    productId: "PRD-" + Date.now(),
    createdAt: new Date(),
  });
};

export const updateProduct = async (id: string, data: any) => {
  const db = getShopDb();
  if (!db) return;
  await updateDoc(doc(db, "newProducts", id), {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteProduct = async (id: string) => {
  const db = getShopDb();
  if (!db) return;
  await deleteDoc(doc(db, "newProducts", id));
};

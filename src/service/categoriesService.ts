import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getShopDb } from "../firebase/dynamicFirebase";

const getCollection = () => {
  const db = getShopDb();
  if (!db) throw new Error("Shop DB not initialized");
  return collection(db, "firestoreCategories");
};

export const fetchCategories = async () => {
  const snapshot = await getDocs(getCollection());
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addCategory = async (title: string, base64Image: string) => {
  await addDoc(getCollection(), {
    title,
    image: base64Image,
    createdAt: new Date(),
  });
};

export const updateCategory = async (
  id: string,
  title: string,
  base64Image: string
) => {
  const db = getShopDb();
  if (!db) return;

  await updateDoc(doc(db, "firestoreCategories", id), {
    title,
    image: base64Image,
    updatedAt: new Date(),
  });
};

export const deleteCategory = async (id: string) => {
  const db = getShopDb();
  if (!db) return;

  await deleteDoc(doc(db, "firestoreCategories", id));
};

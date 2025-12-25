import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const masterFirebaseConfig = {
  apiKey: "AIzaSyCJLFXsc7As3vzTI4WhVNvH84TTwAKMPGs",
  authDomain: "jewellery-app-81948.firebaseapp.com",
  projectId: "jewellery-app-81948",
  storageBucket: "jewellery-app-81948.firebasestorage.app",
  messagingSenderId: "530023953234",
  appId: "1:530023953234:web:fce103de6576cf7f99c08b",
  measurementId: "G-SHGXE7064N"
};

const masterApp = initializeApp(masterFirebaseConfig);
export const masterDb = getFirestore(masterApp);

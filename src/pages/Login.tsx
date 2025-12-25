import { useState } from "react";
import { FiLock, FiUser } from "react-icons/fi";
import { GiDiamondRing } from "react-icons/gi";
import { doc, getDoc } from "firebase/firestore";
import { masterDb } from "../firebase/masterFirebase";
import { useFirebaseConfig } from "../context/FirebaseContext";
import { initShopFirebase } from "../firebase/dynamicFirebase";

export default function Login() {
  const [shopId, setShopId] = useState("");
  const [password, setPassword] = useState("");
  const { setShopConfig } = useFirebaseConfig();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!shopId || !password) return alert("Enter credentials");

    setLoading(true);
    try {
      const ref = doc(masterDb, "shops", shopId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Shop not found");
        setLoading(false);
        return;
      }

      const data = snap.data();
      if (data.password !== password) {
        alert("Invalid password");
        setLoading(false);
        return;
      }

      const config = {
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        projectId: data.projectId,
        appId: data.appId,
        messagingSenderId: data.messagingSenderId,
        measurementId: data.measurementId,
        shopName: data.shopName,
      };

      setShopConfig(config); // Saves to localStorage automatically
      initShopFirebase(config);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 mb-4">
          <GiDiamondRing className="text-5xl text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-800">Jewellery Admin</h1>
          <p className="text-gray-500 text-sm">by Shreyansh Webcraft</p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <FiUser className="text-gray-400 text-xl" />
            <input
              className="flex-1 outline-none text-gray-700"
              placeholder="Shop ID"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
            <FiLock className="text-gray-400 text-xl" />
            <input
              className="flex-1 outline-none text-gray-700"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-md text-white font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? "Authenticating..." : "Login Securely"}
        </button>
      </div>
    </div>
  );
}
